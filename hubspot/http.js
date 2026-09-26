const CONNECTION_KEY = "hubspot";
const DEFAULT_API_VERSION = "2026-09";
const API_ORIGIN = "https://api.hubapi.com";
const asString = (value) => (value === undefined || value === null ? "" : String(value).trim());
const asObject = (value) => (value && typeof value === "object" && !Array.isArray(value) ? value : {});
const asArray = (value) => (Array.isArray(value) ? value : []);
const inputObject = (input) => {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("HUBSPOT_INVALID_INPUT: input must be an object");
  return Object.assign({}, input);
};
const requiredPath = (input, key) => {
  const value = input[key];
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value !== "string" || !value.trim() || /[\s/]/.test(value.trim())) throw new Error(`HUBSPOT_INVALID_INPUT: ${key} is required`);
  return value.trim();
};
const requiredStringField = (input, key) => {
  const value = input[key];
  if (typeof value !== "string" || !value.trim()) throw new Error(`HUBSPOT_INVALID_INPUT: ${key} is required`);
  input[key] = value.trim();
  return input[key];
};
const requiredPresent = (input, key) => {
  if (!Object.prototype.hasOwnProperty.call(input, key) || input[key] === undefined || input[key] === null || input[key] === "") {
    throw new Error(`HUBSPOT_INVALID_INPUT: ${key} is required`);
  }
  return input[key];
};
const requiredObjectField = (input, key) => {
  const value = input[key];
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`HUBSPOT_INVALID_INPUT: ${key} is required`);
  return value;
};
const requiredArray = (input, key) => {
  const value = input[key];
  if (!Array.isArray(value) || !value.length) throw new Error(`HUBSPOT_INVALID_INPUT: ${key} is required`);
  return value;
};
const presentArray = (input, key) => {
  if (!Array.isArray(input[key])) throw new Error(`HUBSPOT_INVALID_INPUT: ${key} is required`);
  return input[key];
};
const requiredBoolean = (input, key) => {
  if (typeof input[key] !== "boolean") throw new Error(`HUBSPOT_INVALID_INPUT: ${key} is required`);
  return input[key];
};
const requiredInteger = (input, key) => {
  if (typeof input[key] !== "number" || !Number.isInteger(input[key])) throw new Error(`HUBSPOT_INVALID_INPUT: ${key} is required`);
  return input[key];
};
const requiredRawString = (input, key) => {
  const value = input[key];
  if (typeof value !== "string" || value.length < 1) throw new Error(`HUBSPOT_INVALID_INPUT: ${key} is required`);
  return value;
};
const queryFrom = (input, keys) => {
  const query = {};
  keys.forEach((key) => {
    if (!Object.prototype.hasOwnProperty.call(input, key)) return;
    query[key] = input[key];
  });
  return query;
};
const bodyFrom = (input, omitKeys) => {
  const body = {};
  Object.keys(input).forEach((key) => {
    if (omitKeys.indexOf(key) !== -1 || input[key] === undefined) return;
    body[key] = input[key];
  });
  return body;
};
const configValue = (key) => {
  const configuration = (ScriptContext && ScriptContext.configuration) || {};
  const value = configuration[key];
  return typeof value === "string" ? value.trim() : "";
};
const configuredApiVersion = () => {
  const raw = configValue("apiVersion") || DEFAULT_API_VERSION;
  if (/^\d{4}-\d{2}$/.test(raw)) return raw;
  throw new Error("HUBSPOT_NOT_CONFIGURED: apiVersion must look like 2026-09");
};
const queryString = (values) => {
  const query = [];
  Object.entries(asObject(values)).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    query.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
  });
  const encoded = query.join("&");
  return encoded ? `?${encoded}` : "";
};
const headerValue = (headers, name) => {
  const listed = asObject(headers);
  const found = Object.keys(listed).find((key) => key.toLowerCase() === name.toLowerCase());
  return found ? asString(listed[found]) : "";
};
const hasHeader = (headers, name) => Object.keys(asObject(headers)).some((key) => key.toLowerCase() === name.toLowerCase());
const formatHubSpotError = (status, text) => {
  const raw = asString(text);
  if (!raw) return `HUBSPOT_REQUEST_FAILED (${status})`;
  try {
    const parsed = JSON.parse(raw);
    const first = Array.isArray(parsed) ? parsed[0] : parsed;
    if (first && typeof first === "object") {
      const category = asString(first.category);
      const message = asString(first.message);
      const correlationId = asString(first.correlationId);
      const nested = asArray(first.errors)
        .map((item) => asString(item && item.message))
        .filter(Boolean);
      const detail = [message, ...nested].filter(Boolean).join("; ");
      const bits = [String(status)];
      if (category) bits.push(category);
      if (correlationId) bits.push(correlationId);
      if (detail) return `HUBSPOT_REQUEST_FAILED (${bits.join(" ")}): ${detail}`;
    }
  } catch (_error) {
    return `HUBSPOT_REQUEST_FAILED (${status}): ${raw}`;
  }
  return `HUBSPOT_REQUEST_FAILED (${status}): ${raw}`;
};
const apiPath = (path) => {
  const raw = asString(path);
  if (!raw) throw new Error("HUBSPOT_INVALID_INPUT: path is required");
  if (/^https?:\/\//i.test(raw)) {
    const match = raw.match(/^https:\/\/([A-Za-z0-9.-]+)(?::443)?(\/.*)?$/i);
    if (!match || `https://${match[1].toLowerCase()}` !== API_ORIGIN) {
      throw new Error("HUBSPOT_INVALID_INPUT: absolute URLs must stay on https://api.hubapi.com");
    }
    return asString(match[2]) || "/";
  }
  return raw.startsWith("/") ? raw : `/${raw}`;
};
const applyHeaders = (headers, extra) => {
  Object.entries(asObject(extra)).forEach(([key, value]) => {
    if (key.toLowerCase() === "authorization") throw new Error("HUBSPOT_INVALID_INPUT: Authorization cannot be overridden");
    if (value === undefined || value === null) return;
    headers[key] = String(value);
  });
  return headers;
};
const requestJson = async (path, method, body, query, headers) => {
  const apiKey = await ConnectionApp.getApiKey(CONNECTION_KEY);
  let suffix = apiPath(path);
  const extra = queryString(query);
  if (extra) {
    if (suffix.includes("?")) throw new Error("HUBSPOT_INVALID_INPUT: path already has a query string");
    suffix += extra;
  }
  const verb = asString(method).toUpperCase() || "GET";
  if (!/^[A-Z]+$/.test(verb)) throw new Error("HUBSPOT_INVALID_INPUT: method is invalid");
  const options = {
    method: verb,
    headers: applyHeaders({ Authorization: "Bearer " + apiKey, Accept: "application/json" }, headers),
    muteHttpExceptions: true,
  };
  if (body !== undefined) {
    if (!hasHeader(options.headers, "content-type")) options.headers["Content-Type"] = "application/json";
    options.payload = typeof body === "string" ? body : JSON.stringify(body);
  }
  const response = await UrlFetchApp.fetch(API_ORIGIN + suffix, options);
  const status = response.getResponseCode();
  const text = response.getContentText();
  const responseHeaders = response.getHeaders() || {};
  const contentType = headerValue(responseHeaders, "content-type");
  if (status < 200 || status >= 300) throw new Error(formatHubSpotError(status, text));
  if (!text.trim()) return {};
  if (/octet-stream|image\/|audio\/|video\/|application\/zip|application\/pdf/i.test(contentType)) {
    throw new Error("HUBSPOT_REQUEST_FAILED: binary responses are not readable as text");
  }
  try {
    return JSON.parse(text);
  } catch (_error) {
    return text;
  }
};
