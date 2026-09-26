const CLOUDFLARE_API_BASE = "https://api.cloudflare.com/client/v4";
const CONNECTION_KEY = "cloudflare";
const LIST_ZONE_QUERY = ["account", "direction", "match", "name", "order", "page", "per_page", "status", "type"];
const LIST_DNS_RECORD_QUERY = ["comment", "content", "direction", "include_shadow_metadata", "match", "name", "order", "page", "per_page", "proxied", "search", "shadowed_by_name", "shadowing_name", "tag", "tag_match", "type"];
const SHADOW_METADATA_QUERY = ["include_shadow_metadata"];
const DNS_RECORD_BODY_OMIT = ["zone_id", "dns_record_id", "include_shadow_metadata"];
const asString = (value) => (value === undefined || value === null ? "" : String(value).trim());
const inputObject = (input) => {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("CLOUDFLARE_INVALID_INPUT: input must be an object");
  return Object.assign({}, input);
};
const requiredString = (input, key) => {
  const value = input[key];
  if (typeof value !== "string" || !value.trim()) throw new Error(`CLOUDFLARE_INVALID_INPUT: ${key} is required`);
  input[key] = value.trim();
  return input[key];
};
const requiredObject = (input, key) => {
  const value = input[key];
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`CLOUDFLARE_INVALID_INPUT: ${key} is required`);
  return value;
};
const requiredArray = (input, key) => {
  if (!Array.isArray(input[key])) throw new Error(`CLOUDFLARE_INVALID_INPUT: ${key} is required`);
  return input[key];
};
const requiredPresent = (input, key) => {
  if (!Object.prototype.hasOwnProperty.call(input, key) || input[key] === undefined || input[key] === null || input[key] === "") {
    throw new Error(`CLOUDFLARE_INVALID_INPUT: ${key} is required`);
  }
  return input[key];
};
const present = (input, key) => Object.prototype.hasOwnProperty.call(input, key) && input[key] !== undefined;
const pick = (input, keys) => {
  const body = {};
  keys.forEach((key) => {
    if (!present(input, key)) return;
    body[key] = input[key];
  });
  return body;
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
const redact = (value, token) => {
  let out = value;
  if (token) out = out.split(token).join("[redacted]");
  return out.replace(/Bearer\s+\S+/gi, "Bearer [redacted]");
};
const failureMessage = (text, token) => {
  const raw = typeof text === "string" ? text.trim() : "";
  if (!raw) return "request failed";
  const clipped = raw.length > 500 ? raw.slice(0, 500) : raw;
  try {
    const parsed = JSON.parse(raw);
    const errors = parsed && Array.isArray(parsed.errors) ? parsed.errors : [];
    const first = errors.length ? errors[0] : undefined;
    const message = first && typeof first === "object" ? asString(first.message) : asString(first);
    if (message) return redact(message, token);
  } catch (_error) {
    return redact(clipped, token);
  }
  return redact(clipped, token);
};
const multipartBody = (fields) => {
  const boundary = "cloudflare-form-boundary";
  const chunks = [];
  Object.keys(fields).forEach((name) => {
    const value = fields[name];
    if (value === undefined || value === null) return;
    chunks.push(`--${boundary}\r\nContent-Disposition: form-data; name="${name}"\r\n\r\n${String(value)}\r\n`);
  });
  chunks.push(`--${boundary}--\r\n`);
  return { boundary, payload: chunks.join("") };
};
const cloudflareRequest = async (path, method, options) => {
  const token = await ConnectionApp.getApiKey(CONNECTION_KEY);
  const request = options || {};
  const headers = { Authorization: `Bearer ${token}`, Accept: request.accept || "application/json" };
  const fetchOptions = { method, headers, muteHttpExceptions: true };
  if (request.multipart) {
    headers["Content-Type"] = `multipart/form-data; boundary=${request.multipart.boundary}`;
    fetchOptions.payload = request.multipart.payload;
  } else if (request.body !== undefined) {
    headers["Content-Type"] = "application/json";
    fetchOptions.payload = JSON.stringify(request.body);
  }
  const response = await UrlFetchApp.fetch(`${CLOUDFLARE_API_BASE}${path}`, fetchOptions);
  const status = response.getResponseCode();
  const text = response.getContentText();
  if (status < 200 || status >= 300) throw new Error(`CLOUDFLARE_REQUEST_FAILED: ${status} ${failureMessage(text, token)}`);
  if (request.raw) return text;
  if (!String(text || "").trim()) return {};
  try {
    return JSON.parse(text);
  } catch (_error) {
    throw new Error(`CLOUDFLARE_REQUEST_FAILED: ${status} ${failureMessage(text, token)}`);
  }
};
const requireDnsRecord = (input) => {
  requiredString(input, "name");
  requiredPresent(input, "ttl");
  requiredString(input, "type");
};
