const TRULYINBOX_API_BASE = "https://lupus-edge.trulyinbox.com/v1";
const CONNECTION_KEY = "trulyinbox";
const invalidInput = (reason) => {
  throw new Error(`TRULYINBOX_INVALID_INPUT: ${reason}`);
};
const requireObjectInput = (input) => {
  if (!input || typeof input !== "object" || Array.isArray(input)) invalidInput("input must be an object");
  return input;
};
const readRequired = (source, key, label, kind) => {
  const value = source[key];
  if (kind === "string") {
    if (typeof value !== "string" || value === "") invalidInput(`${label} is required`);
    return value;
  }
  if (kind === "number") {
    if (typeof value !== "number" || !Number.isFinite(value)) invalidInput(`${label} is required`);
    return value;
  }
  if (kind === "boolean") {
    if (typeof value !== "boolean") invalidInput(`${label} is required`);
    return value;
  }
  if (kind === "array") {
    if (!Array.isArray(value)) invalidInput(`${label} is required`);
    return value;
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) invalidInput(`${label} is required`);
  return value;
};
const optionalQueryString = (source, name) => {
  if (source[name] === undefined) return undefined;
  if (typeof source[name] !== "string") invalidInput(`${name} must be a string`);
  return source[name];
};
const optionalQueryStrings = (source, name) => {
  if (source[name] === undefined) return undefined;
  if (!Array.isArray(source[name]) || source[name].some((item) => typeof item !== "string")) invalidInput(`${name} must be an array of strings`);
  return source[name];
};
const trulyinboxQuery = (params) => {
  const parts = [];
  Object.keys(params).forEach((key) => {
    const value = params[key];
    if (value === undefined) return;
    if (Array.isArray(value)) {
      value.forEach((item) => {
        parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(item)}`);
      });
      return;
    }
    parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
  });
  return parts.length ? `?${parts.join("&")}` : "";
};
const trulyinboxFailureMessage = (text, apiKey) => {
  const redact = (value) => (apiKey ? value.split(apiKey).join("[redacted]") : value);
  const raw = typeof text === "string" ? text.trim() : "";
  if (!raw) return "request failed";
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (_error) {
    parsed = undefined;
  }
  if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
    if (typeof parsed.message === "string" && parsed.message.trim()) return redact(parsed.message.trim());
    if (typeof parsed.error === "string" && parsed.error.trim()) return redact(parsed.error.trim());
    if (typeof parsed.error_code === "string" && parsed.error_code.trim()) return redact(parsed.error_code.trim());
  }
  const redacted = redact(raw);
  return redacted.length > 500 ? redacted.slice(0, 500) : redacted;
};
const trulyinboxRequest = async (method, path, body) => {
  const apiKey = await ConnectionApp.getApiKey(CONNECTION_KEY);
  const headers = { "X-Api-Key": apiKey, Accept: "application/json" };
  const options = { method, headers, muteHttpExceptions: true };
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    options.payload = JSON.stringify(body);
  }
  const response = await UrlFetchApp.fetch(`${TRULYINBOX_API_BASE}${path}`, options);
  const status = response.getResponseCode();
  const text = response.getContentText();
  if (status < 200 || status >= 300) throw new Error(`TRULYINBOX_REQUEST_FAILED: ${status} ${trulyinboxFailureMessage(text, apiKey)}`);
  if (!text || !String(text).trim()) return {};
  try {
    return JSON.parse(text);
  } catch (_error) {
    throw new Error(`TRULYINBOX_REQUEST_FAILED: ${status} response was not JSON`);
  }
};
