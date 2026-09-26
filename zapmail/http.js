const ZAPMAIL_API_BASE = "https://api.zapmail.ai/api";
const CONNECTION_KEY = "zapmail";
const inputObject = (input) => {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("ZAPMAIL_INVALID_INPUT: input must be an object");
  return Object.assign({}, input);
};
const requiredString = (input, key) => {
  const value = input[key];
  if (typeof value !== "string" || !value.trim()) throw new Error(`ZAPMAIL_INVALID_INPUT: ${key} is required`);
  input[key] = value.trim();
  return input[key];
};
const requiredPresent = (input, key) => {
  if (!Object.prototype.hasOwnProperty.call(input, key) || input[key] === undefined || input[key] === null || input[key] === "") {
    throw new Error(`ZAPMAIL_INVALID_INPUT: ${key} is required`);
  }
  return input[key];
};
const requireField = (input, key, type) => {
  if (type === "string") {
    requiredString(input, key);
    return;
  }
  if (type === "array") {
    if (!Array.isArray(input[key])) throw new Error(`ZAPMAIL_INVALID_INPUT: ${key} is required`);
    return;
  }
  if (type === "object") {
    const value = input[key];
    if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`ZAPMAIL_INVALID_INPUT: ${key} is required`);
    return;
  }
  if (type === "boolean") {
    if (typeof input[key] !== "boolean") throw new Error(`ZAPMAIL_INVALID_INPUT: ${key} is required`);
    return;
  }
  if (type === "integer" || type === "number") {
    if (typeof input[key] !== "number" || !Number.isFinite(input[key])) throw new Error(`ZAPMAIL_INVALID_INPUT: ${key} is required`);
    return;
  }
  if (type === "null") {
    if (!Object.prototype.hasOwnProperty.call(input, key) || input[key] === undefined) throw new Error(`ZAPMAIL_INVALID_INPUT: ${key} is required`);
    return;
  }
  requiredPresent(input, key);
};
const readServiceProvider = (input, required) => {
  const missing = !Object.prototype.hasOwnProperty.call(input, "serviceProvider") || input.serviceProvider === undefined || input.serviceProvider === null || input.serviceProvider === "";
  if (missing) {
    if (required) throw new Error("ZAPMAIL_INVALID_INPUT: serviceProvider must be GOOGLE or MICROSOFT");
    return "";
  }
  if (input.serviceProvider !== "GOOGLE" && input.serviceProvider !== "MICROSOFT") throw new Error("ZAPMAIL_INVALID_INPUT: serviceProvider must be GOOGLE or MICROSOFT");
  return input.serviceProvider;
};
const readHeader = (input, key, required) => {
  const missing = !Object.prototype.hasOwnProperty.call(input, key) || input[key] === undefined || input[key] === null || input[key] === "";
  if (missing) {
    if (required) throw new Error(`ZAPMAIL_INVALID_INPUT: ${key} is required`);
    return "";
  }
  if (typeof input[key] !== "string") throw new Error(`ZAPMAIL_INVALID_INPUT: ${key} must be a string`);
  const value = input[key].trim();
  if (!value) {
    if (required) throw new Error(`ZAPMAIL_INVALID_INPUT: ${key} is required`);
    return "";
  }
  return value;
};
const omit = (input, keys) => {
  const body = {};
  Object.keys(input).forEach((key) => {
    if (keys.includes(key) || input[key] === undefined) return;
    body[key] = input[key];
  });
  return body;
};
const appendQuery = (parts, key, value) => {
  if (value === undefined || value === null) return;
  if (Array.isArray(value)) {
    if (!value.length) return;
    parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value.map((item) => (item === undefined || item === null ? "" : String(item))).join(","))}`);
    return;
  }
  if (typeof value === "object") {
    Object.keys(value).forEach((child) => appendQuery(parts, `${key}.${child}`, value[child]));
    return;
  }
  parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
};
const queryString = (input, keys) => {
  const parts = [];
  keys.forEach((key) => {
    if (!Object.prototype.hasOwnProperty.call(input, key)) return;
    appendQuery(parts, key, input[key]);
  });
  return parts.length ? `?${parts.join("&")}` : "";
};
const withQuery = (path, input, keys) => `${path}${queryString(input, keys)}`;
const redact = (value, apiKey) => (apiKey ? String(value).split(apiKey).join("[redacted]") : String(value));
const failureMessage = (text, apiKey) => {
  const raw = typeof text === "string" ? text.trim() : "";
  if (!raw) return "request failed";
  const clipped = raw.length > 500 ? raw.slice(0, 500) : raw;
  let message = clipped;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && typeof parsed.message === "string" && parsed.message.trim()) message = parsed.message.trim();
  } catch (_error) {
    message = clipped;
  }
  const redacted = redact(message, apiKey).trim();
  return redacted || "request failed";
};
const emptyBody = (body) => Boolean(body) && typeof body === "object" && !Array.isArray(body) && Object.keys(body).length === 0;
const zapmailRequest = async (path, method, options) => {
  const apiKey = await ConnectionApp.getApiKey(CONNECTION_KEY);
  const request = options || {};
  const headers = { "x-auth-zapmail": apiKey, Accept: "application/json" };
  if (request.workspaceKey) headers["x-workspace-key"] = request.workspaceKey;
  if (request.workspaceId) headers["x-workspace-id"] = request.workspaceId;
  if (request.serviceProvider) headers["x-service-provider"] = request.serviceProvider;
  const fetchOptions = { method, headers, muteHttpExceptions: true };
  if (request.body !== undefined && !emptyBody(request.body)) {
    headers["Content-Type"] = "application/json";
    fetchOptions.payload = JSON.stringify(request.body);
  }
  const response = await UrlFetchApp.fetch(`${ZAPMAIL_API_BASE}${path}`, fetchOptions);
  const status = response.getResponseCode();
  const text = response.getContentText();
  if (status < 200 || status >= 300) throw new Error(`ZAPMAIL_REQUEST_FAILED: ${status} ${failureMessage(text, apiKey)}`);
  if (!String(text || "").trim()) return {};
  try {
    return JSON.parse(text);
  } catch (_error) {
    return text;
  }
};
