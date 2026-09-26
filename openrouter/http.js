const OPENROUTER_API_BASE = "https://openrouter.ai/api/v1";
const CONNECTION_KEY = "openrouter";
const getOpenRouterApiKey = async () => ConnectionApp.getApiKey(CONNECTION_KEY);
const invalidInput = (reason) => new Error(`OPENROUTER_INVALID_INPUT: ${reason}`);
const requireObject = (input) => {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw invalidInput("input must be an object");
  return input;
};
const optionalObject = (input) => (input === undefined || input === null ? {} : requireObject(input));
const typePhrase = (type) => {
  if (type.includes("|")) return type.split("|").map(typePhrase).join(" or ");
  if (type === "string") return "a string";
  if (type === "integer") return "an integer";
  if (type === "number") return "a number";
  if (type === "boolean") return "a boolean";
  if (type === "object") return "an object";
  if (type === "array") return "an array";
  if (type === "string-array") return "an array of strings";
  return "a valid value";
};
const matchesType = (value, type) => {
  if (type.includes("|")) return type.split("|").some((part) => matchesType(value, part));
  if (type === "string") return typeof value === "string";
  if (type === "string-array") return Array.isArray(value) && value.every((item) => typeof item === "string");
  if (type === "array") return Array.isArray(value);
  if (type === "object") return Boolean(value) && typeof value === "object" && !Array.isArray(value);
  if (type === "boolean") return typeof value === "boolean";
  if (type === "number") return typeof value === "number" && Number.isFinite(value);
  if (type === "integer") return typeof value === "number" && Number.isInteger(value);
  return type === "any";
};
const rejectStream = (req) => {
  if (!Object.prototype.hasOwnProperty.call(req, "stream") || req.stream === undefined) return;
  if (typeof req.stream !== "boolean") throw invalidInput("stream must be a boolean");
  if (req.stream === true) throw invalidInput("stream is not supported");
};
const readField = (source, field) => {
  const name = field.name;
  const present = Object.prototype.hasOwnProperty.call(source, name);
  const value = present ? source[name] : undefined;
  if (value === undefined) {
    if (field.required) throw invalidInput(`${name} is required`);
    return undefined;
  }
  if (value === null) {
    if (field.nullable) return null;
    throw invalidInput(`${name} is required`);
  }
  if (name === "stream") {
    if (typeof value !== "boolean") throw invalidInput("stream must be a boolean");
    if (value === true) throw invalidInput("stream is not supported");
  }
  if (!matchesType(value, field.type)) throw invalidInput(`${name} must be ${typePhrase(field.type)}`);
  if (field.required && typeof value === "string" && value.length === 0) throw invalidInput(`${name} is required`);
  return value;
};
const buildQuery = (pairs) => (pairs.length ? `?${pairs.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`).join("&")}` : "");
const appendQuery = (pairs, field, value) => {
  if (value === undefined || value === null) return;
  if (Array.isArray(value)) {
    value.forEach((item) => pairs.push([field.name, item]));
    return;
  }
  pairs.push([field.name, value]);
};
const failureMessage = (text, apiKey) => {
  let message = "request failed";
  const raw = typeof text === "string" ? text.trim() : "";
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      const error = parsed && typeof parsed === "object" ? parsed.error : undefined;
      if (error && typeof error === "object" && typeof error.message === "string" && error.message.trim()) message = error.message.trim();
      else if (typeof error === "string" && error.trim()) message = error.trim();
      else if (parsed && typeof parsed.message === "string" && parsed.message.trim()) message = parsed.message.trim();
      else message = raw;
    } catch (_error) {
      message = raw;
    }
  }
  if (apiKey) message = message.split(apiKey).join("[redacted]");
  message = message.replace(/Bearer\s+\S+/gi, "Bearer [redacted]");
  message = message.replace(/\s+/g, " ").trim();
  if (!message) message = "request failed";
  return message.length > 500 ? message.slice(0, 500) : message;
};
const responseBody = (response, text) => {
  if (!text.trim()) return {};
  const headers = response.getHeaders ? response.getHeaders() : {};
  const contentType = String((headers && (headers["Content-Type"] || headers["content-type"])) || "").toLowerCase();
  if (contentType.includes("text/event-stream") || (contentType && !contentType.includes("json"))) return text;
  try {
    return JSON.parse(text);
  } catch (_error) {
    return text;
  }
};
const openrouterFetch = async (url, method, payload, contentType, headerFields) => {
  const apiKey = await getOpenRouterApiKey();
  const headers = { Accept: headerFields.accept || "application/json" };
  Object.keys(headerFields.extra || {}).forEach((key) => {
    headers[key] = headerFields.extra[key];
  });
  headers.Authorization = `Bearer ${apiKey}`;
  const options = { method, headers, muteHttpExceptions: true };
  if (payload !== undefined) {
    headers["Content-Type"] = contentType || "application/json";
    options.payload = payload;
  }
  const response = await UrlFetchApp.fetch(url, options);
  const status = response.getResponseCode();
  const text = response.getContentText();
  if (status < 200 || status >= 300) throw new Error(`OPENROUTER_REQUEST_FAILED: ${status} ${failureMessage(text, apiKey)}`);
  return responseBody(response, text);
};
const parameterNames = (spec) => {
  const names = new Set();
  (spec.pathParams || []).forEach((field) => names.add(field.name));
  (spec.query || []).forEach((field) => names.add(field.name));
  (spec.headers || []).forEach((field) => names.add(field.name));
  return names;
};
const requestBody = (req, spec) => {
  const taken = parameterNames(spec);
  const body = {};
  Object.keys(req).forEach((key) => {
    if (taken.has(key) || req[key] === undefined) return;
    body[key] = req[key];
  });
  (spec.required || []).forEach((field) => readField(body, field));
  return body;
};
const formPayload = (pairs) => pairs.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`).join("&");
const multipartPayload = (fields) => {
  const boundary = "openrouter-form-boundary";
  const chunks = [];
  fields.forEach((field) => {
    if (field.name === "file") {
      chunks.push(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="file"\r\nContent-Type: application/octet-stream\r\n\r\n${field.value}\r\n`);
      return;
    }
    const values = Array.isArray(field.value) ? field.value : [field.value];
    values.forEach((value) => {
      const text = value && typeof value === "object" ? JSON.stringify(value) : String(value);
      chunks.push(`--${boundary}\r\nContent-Disposition: form-data; name="${field.name}"\r\n\r\n${text}\r\n`);
    });
  });
  chunks.push(`--${boundary}--\r\n`);
  return { boundary, payload: chunks.join("") };
};
const openrouterOperation = async (input, spec) => {
  const req = spec.optionalInput ? optionalObject(input) : requireObject(input);
  if (spec.rejectStream) rejectStream(req);
  let path = spec.path;
  (spec.pathParams || []).forEach((field) => {
    const value = readField(req, { name: field.name, type: "string", required: true });
    path = path.split(`{${field.name}}`).join(encodeURIComponent(value));
  });
  const query = [];
  (spec.query || []).forEach((field) => appendQuery(query, field, readField(req, field)));
  const extraHeaders = {};
  (spec.headers || []).forEach((field) => {
    const value = readField(req, field);
    if (value === undefined || value === null) return;
    if (typeof value !== "string" || value.length === 0) throw invalidInput(`${field.name} must be a non-empty string`);
    extraHeaders[field.name] = value;
  });
  const origin = spec.origin || OPENROUTER_API_BASE;
  const url = `${origin}${path}${buildQuery(query)}`;
  const headerFields = { accept: spec.accept, extra: extraHeaders };
  if (spec.encoding === "multipart") {
    const body = requestBody(req, spec);
    const parts = [];
    Object.keys(body).forEach((name) => {
      if (body[name] === null) return;
      parts.push({ name, value: body[name] });
    });
    const packed = multipartPayload(parts);
    return openrouterFetch(url, spec.method, packed.payload, `multipart/form-data; boundary=${packed.boundary}`, headerFields);
  }
  if (spec.encoding === "form") {
    const body = requestBody(req, spec);
    const pairs = [];
    Object.keys(body).forEach((name) => appendQuery(pairs, { name }, body[name]));
    return openrouterFetch(url, spec.method, formPayload(pairs), "application/x-www-form-urlencoded", headerFields);
  }
  if (spec.encoding === "json") return openrouterFetch(url, spec.method, JSON.stringify(requestBody(req, spec)), "application/json", headerFields);
  return openrouterFetch(url, spec.method, undefined, undefined, headerFields);
};
