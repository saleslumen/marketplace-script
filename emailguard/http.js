const EMAILGUARD_API_BASE = "https://app.emailguard.io";
const CONNECTION_KEY = "emailguard";
const asString = (value) => (value === undefined || value === null ? "" : String(value).trim());
const invalid = (reason) => {
  throw new Error(`EMAILGUARD_INVALID_INPUT: ${reason}`);
};
const inputObject = (input) => (input && typeof input === "object" && !Array.isArray(input) ? input : {});
const requireText = (input, name) => {
  const text = asString(input[name]);
  if (!text) invalid(`${name} is required`);
  return text;
};
const optionalText = (input, name) => {
  if (!Object.prototype.hasOwnProperty.call(input, name)) return undefined;
  const text = asString(input[name]);
  return text ? text : undefined;
};
const requireFiniteNumber = (input, name) => {
  const value = input[name];
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const text = asString(value);
  if (!text) invalid(`${name} is required`);
  const number = Number(text);
  if (!Number.isFinite(number)) invalid(`${name} is required`);
  return number;
};
const requireArray = (input, name) => {
  const value = input[name];
  if (Array.isArray(value)) {
    if (!value.length) invalid(`${name} is required`);
    return value;
  }
  if (value === undefined || value === null || value === "") invalid(`${name} is required`);
  invalid(`${name} must be an array`);
};
const optionalBoolean = (input, name) => {
  if (!Object.prototype.hasOwnProperty.call(input, name)) return undefined;
  const value = input[name];
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value !== "boolean") invalid(`${name} must be a boolean`);
  return value;
};
const csvPart = (value) => {
  if (value && typeof value === "object" && Object.prototype.hasOwnProperty.call(value, "content")) return value;
  const text = asString(value);
  if (!text) return undefined;
  return { content: text, filename: "contacts.csv" };
};
const buildQuery = (params) => {
  const parts = [];
  Object.keys(params || {}).forEach((key) => {
    const value = params[key];
    if (value === undefined || value === null || value === "") return;
    if (Array.isArray(value)) {
      value.forEach((item) => {
        const text = asString(item);
        if (text) parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(text)}`);
      });
      return;
    }
    parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(asString(value))}`);
  });
  return parts.length ? `?${parts.join("&")}` : "";
};
const buildMultipart = (fields) => {
  const boundary = "emailguard-form-boundary";
  const chunks = [];
  Object.keys(fields).forEach((name) => {
    const field = fields[name];
    if (field && typeof field === "object" && Object.prototype.hasOwnProperty.call(field, "content")) {
      const filename = asString(field.filename) || "upload.csv";
      const contentType = asString(field.contentType) || "text/csv";
      chunks.push(`--${boundary}\r\nContent-Disposition: form-data; name="${name}"; filename="${filename}"\r\nContent-Type: ${contentType}\r\n\r\n${field.content}\r\n`);
      return;
    }
    chunks.push(`--${boundary}\r\nContent-Disposition: form-data; name="${name}"\r\n\r\n${asString(field)}\r\n`);
  });
  chunks.push(`--${boundary}--\r\n`);
  return { boundary, payload: chunks.join("") };
};
const getEmailGuardApiKey = async () => ConnectionApp.getApiKey(CONNECTION_KEY);
const vendorMessage = (parsed, text) => {
  const body = parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  const nested = body.data && typeof body.data === "object" ? body.data.message : undefined;
  return asString(body.message || nested || body.error || (typeof parsed === "string" ? parsed : text));
};
const collectPasswordValues = (value, out) => {
  if (!value || typeof value !== "object") return;
  if (Array.isArray(value)) {
    value.forEach((item) => collectPasswordValues(item, out));
    return;
  }
  Object.keys(value).forEach((key) => {
    const item = value[key];
    if (/password/i.test(key)) {
      const text = typeof item === "string" ? item : "";
      if (text) out.push(text);
      return;
    }
    if (item && typeof item === "object") collectPasswordValues(item, out);
  });
};
const failureMessage = (text, token, requestBody) => {
  const raw = typeof text === "string" ? text.trim() : "";
  let parsed = null;
  if (raw) {
    try {
      parsed = JSON.parse(raw);
    } catch (_error) {
      parsed = null;
    }
  }
  let message = parsed ? vendorMessage(parsed, raw) : raw;
  if (!message) message = "request failed";
  const secrets = [];
  if (typeof token === "string" && token) secrets.push(token);
  collectPasswordValues(requestBody, secrets);
  if (parsed && typeof parsed === "object") collectPasswordValues(parsed, secrets);
  const unique = [];
  secrets.forEach((secret) => {
    if (secret && !unique.includes(secret)) unique.push(secret);
  });
  unique.sort((left, right) => right.length - left.length);
  unique.forEach((secret) => {
    message = message.split(secret).join("[redacted]");
  });
  message = message.replace(/Bearer\s+\S+/gi, "Bearer [redacted]").trim();
  if (!message) message = "request failed";
  return message.length > 500 ? message.slice(0, 500) : message;
};
const emailguardRequest = async (path, method = "GET", body, opts = {}) => {
  const headers = { Accept: "application/json" };
  let token = "";
  if (opts.auth !== false) {
    token = await getEmailGuardApiKey();
    headers.Authorization = `Bearer ${token}`;
  }
  const verb = asString(method).toUpperCase() || "GET";
  const options = { method: verb, headers, muteHttpExceptions: true };
  let urlPath = path;
  if (verb === "GET" && body && typeof body === "object") urlPath = `${path}${buildQuery(body)}`;
  else if (opts.multipart === true && body && typeof body === "object") {
    const packed = buildMultipart(body);
    headers["Content-Type"] = `multipart/form-data; boundary=${packed.boundary}`;
    options.payload = packed.payload;
  } else if (verb !== "GET" && body !== undefined) {
    headers["Content-Type"] = "application/json";
    options.payload = JSON.stringify(body);
  }
  const response = await UrlFetchApp.fetch(`${EMAILGUARD_API_BASE}${urlPath}`, options);
  const status = response.getResponseCode();
  const text = response.getContentText();
  let parsed = {};
  if (text.trim()) {
    try {
      parsed = JSON.parse(text);
    } catch (_error) {
      parsed = text;
    }
  }
  if (status < 200 || status >= 300) throw new Error(`EMAILGUARD_REQUEST_FAILED: ${status} ${failureMessage(text, token, body)}`);
  return parsed;
};
