const TRULYINBOX_API_BASE = "https://lynx-api.trulyinbox.com";
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
const readOptional = (source, key, kind) => {
  if (source[key] === undefined) return undefined;
  return readRequired(source, key, key, kind);
};
const readNullableNumber = (source, key) => {
  if (source[key] === undefined) return undefined;
  if (source[key] === null) return null;
  return readRequired(source, key, key, "number");
};
const readTypedArray = (source, key, required, itemKind) => {
  if (source[key] === undefined) {
    if (required) invalidInput(`${key} is required`);
    return undefined;
  }
  const value = source[key];
  const validItem = (item) => {
    if (itemKind === "number") return typeof item === "number" && Number.isFinite(item);
    if (itemKind === "string") return typeof item === "string";
    return Boolean(item) && typeof item === "object" && !Array.isArray(item);
  };
  if (!Array.isArray(value) || value.some((item) => !validItem(item))) {
    const expected = itemKind === "object" ? "an array of objects" : `an array of ${itemKind}s`;
    invalidInput(`${key} must be ${expected}`);
  }
  return value;
};
const put = (body, key, value) => {
  if (value !== undefined) body[key] = value;
};
const workspacePath = (workspaceId, suffix) => `/v2/workspaces/${encodeURIComponent(workspaceId)}${suffix}`;
const optionalQueryString = (source, name) => {
  if (source[name] === undefined) return undefined;
  if (typeof source[name] !== "string") invalidInput(`${name} must be a string`);
  return source[name];
};
const optionalQueryNumber = (source, name) => {
  if (source[name] === undefined) return undefined;
  if (typeof source[name] !== "number" || !Number.isFinite(source[name])) invalidInput(`${name} must be a number`);
  return source[name];
};
const optionalQueryBoolean = (source, name) => {
  if (source[name] === undefined) return undefined;
  if (typeof source[name] !== "boolean") invalidInput(`${name} must be a boolean`);
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
        parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(item))}`);
      });
      return;
    }
    parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
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
    if (typeof parsed.errorMessage === "string" && parsed.errorMessage.trim()) return redact(parsed.errorMessage.trim());
    const error = parsed.error;
    if (error && typeof error === "object" && !Array.isArray(error)) {
      if (typeof error.message === "string" && error.message.trim()) return redact(error.message.trim());
      if (typeof error.code === "string" && error.code.trim()) return redact(error.code.trim());
    }
    if (typeof parsed.errorCode === "string" && parsed.errorCode.trim()) return redact(parsed.errorCode.trim());
  }
  const redacted = redact(raw);
  return redacted.length > 500 ? redacted.slice(0, 500) : redacted;
};
const trulyinboxRequest = async (method, path, body, authenticated = true) => {
  const headers = { Accept: "application/json" };
  let apiKey = "";
  if (authenticated) {
    apiKey = await ConnectionApp.getApiKey(CONNECTION_KEY);
    headers.Authorization = `Bearer ${apiKey}`;
  }
  const options = { method, headers, muteHttpExceptions: true };
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    options.payload = JSON.stringify(body);
  }
  const response = await UrlFetchApp.fetch(`${TRULYINBOX_API_BASE}${path}`, options);
  const status = response.getResponseCode();
  const text = response.getContentText();
  if (status < 200 || status >= 300) throw new Error(`TRULYINBOX_REQUEST_FAILED: ${status} ${trulyinboxFailureMessage(text, apiKey)}`);
  if (!text || !String(text).trim()) return undefined;
  try {
    return JSON.parse(text);
  } catch (_error) {
    throw new Error(`TRULYINBOX_REQUEST_FAILED: ${status} response was not JSON`);
  }
};
