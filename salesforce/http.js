const CONNECTION_KEY = "salesforce";
const DEFAULT_API_VERSION = "v68.0";
const SOBJECT_NAME = /^[A-Za-z][A-Za-z0-9_]*$/;
const COLLECTION_RECORD_LIMIT = 200;
const COLLECTION_RETRIEVE_LIMIT = 2000;
const COMPOSITE_REQUEST_LIMIT = 25;
const CONDITIONAL_HEADERS = ["If-Match", "If-None-Match", "If-Modified-Since", "If-Unmodified-Since"];
const asString = (value) => (value === undefined || value === null ? "" : String(value).trim());
const asObject = (value) => (value && typeof value === "object" && !Array.isArray(value) ? value : {});
const configValue = (key) => {
  const configuration = (ScriptContext && ScriptContext.configuration) || {};
  const value = configuration[key];
  return typeof value === "string" ? value.trim() : "";
};
const configuredInstanceUrl = () => {
  const raw = configValue("instanceUrl");
  if (!raw) throw new Error("SALESFORCE_NOT_CONFIGURED: instanceUrl is required");
  const match = raw.match(/^https:\/\/([A-Za-z0-9.-]+)(?::443)?(\/.*)?$/i);
  if (!match) {
    throw new Error("SALESFORCE_NOT_CONFIGURED: instanceUrl must be an https origin such as https://mycompany.my.salesforce.com");
  }
  const path = asString(match[2]);
  if (path && path !== "/") throw new Error("SALESFORCE_NOT_CONFIGURED: instanceUrl must be an origin without a path");
  return `https://${match[1].toLowerCase()}`;
};
const configuredApiVersion = () => {
  const raw = (configValue("apiVersion") || DEFAULT_API_VERSION).replace(/^v/i, "");
  if (!/^\d+\.\d+$/.test(raw)) throw new Error("SALESFORCE_NOT_CONFIGURED: apiVersion must look like v68.0");
  return `v${raw}`;
};
const requireInput = (input) => {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("SALESFORCE_INVALID_INPUT: input must be an object");
  return input;
};
const requireText = (value, label) => {
  if (typeof value !== "string") throw new Error(`SALESFORCE_INVALID_INPUT: ${label} must be a string`);
  const text = value.trim();
  if (!text) throw new Error(`SALESFORCE_INVALID_INPUT: ${label} is required`);
  return text;
};
const optionalText = (value, label) => {
  if (value === undefined || value === null || value === "") return undefined;
  return requireText(value, label);
};
const requireApiName = (value, label) => {
  const name = requireText(value, label);
  if (!SOBJECT_NAME.test(name)) throw new Error(`SALESFORCE_INVALID_INPUT: ${label} must be an API name`);
  return name;
};
const requireSObject = (value) => requireApiName(value, "sObject");
const requireId = (value, label = "id") => requireText(value, label);
const requireQueryLocator = (value) => {
  const locator = requireText(value, "queryLocator");
  if (locator.includes("/") || locator.includes("?") || locator.includes("&")) {
    throw new Error("SALESFORCE_INVALID_INPUT: queryLocator must be the locator token");
  }
  return locator;
};
const optionalBoolean = (value, label) => {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "boolean") throw new Error(`SALESFORCE_INVALID_INPUT: ${label} must be a boolean`);
  return value;
};
const assignBoolean = (target, req, label) => {
  const value = optionalBoolean(req[label], label);
  if (value !== undefined) target[label] = value;
  return target;
};
const requireList = (value, label, max) => {
  if (!Array.isArray(value)) throw new Error(`SALESFORCE_INVALID_INPUT: ${label} must be an array`);
  if (!value.length) throw new Error(`SALESFORCE_INVALID_INPUT: ${label} is required`);
  if (max && value.length > max) throw new Error(`SALESFORCE_INVALID_INPUT: at most ${max} ${label}`);
  return value;
};
const requireObjectList = (value, label, max) => {
  const listed = requireList(value, label, max);
  listed.forEach((item, index) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      throw new Error(`SALESFORCE_INVALID_INPUT: ${label}[${index}] must be an object`);
    }
  });
  return listed;
};
const requireStringArray = (value, label, max) => {
  const listed = requireList(value, label, max);
  listed.forEach((item, index) => {
    if (typeof item !== "string" || item.trim() === "") throw new Error(`SALESFORCE_INVALID_INPUT: ${label}[${index}] must be a string`);
  });
  return listed;
};
const requireCommaSeparated = (value, label, max) => {
  const text = requireText(value, label);
  const parts = text.split(",");
  if (parts.some((part) => part.trim() === "")) throw new Error(`SALESFORCE_INVALID_INPUT: ${label} must be a comma-separated list`);
  if (max && parts.length > max) throw new Error(`SALESFORCE_INVALID_INPUT: at most ${max} ${label}`);
  return text;
};
const recordBody = (req, reserved) => {
  const record = {};
  Object.keys(req).forEach((key) => {
    if (reserved.indexOf(key) !== -1) return;
    record[key] = req[key];
  });
  return record;
};
const conditionalHeaders = (req) => {
  const headers = {};
  CONDITIONAL_HEADERS.forEach((name) => {
    const value = req[name];
    if (value === undefined || value === null || value === "") return;
    if (typeof value !== "string") throw new Error(`SALESFORCE_INVALID_INPUT: ${name} must be a string`);
    headers[name] = value;
  });
  return Object.keys(headers).length ? headers : undefined;
};
const collectionBody = (req) => assignBoolean({ records: requireObjectList(req.records, "records", COLLECTION_RECORD_LIMIT) }, req, "allOrNone");
const sObjectPath = (sObject, suffix) => `/sobjects/${encodeURIComponent(requireSObject(sObject))}${suffix || ""}`;
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
const formatSalesforceError = (status, text) => {
  const raw = asString(text);
  if (!raw) return `SALESFORCE_REQUEST_FAILED (${status})`;
  try {
    const parsed = JSON.parse(raw);
    const first = Array.isArray(parsed) ? parsed[0] : parsed;
    if (first && typeof first === "object") {
      const code = asString(first.errorCode || first.error);
      const message = asString(first.message || first.error_description);
      if (code || message) return `SALESFORCE_REQUEST_FAILED (${status}${code ? ` ${code}` : ""}): ${message || raw}`;
    }
  } catch (_error) {
    return `SALESFORCE_REQUEST_FAILED (${status}): ${raw}`;
  }
  return `SALESFORCE_REQUEST_FAILED (${status}): ${raw}`;
};
const instancePath = (path) => {
  const raw = asString(path);
  if (!raw) throw new Error("SALESFORCE_INVALID_INPUT: path is required");
  if (/^https?:\/\//i.test(raw)) {
    const origin = configuredInstanceUrl();
    const match = raw.match(/^https:\/\/([A-Za-z0-9.-]+)/i);
    if (!match || `https://${match[1].toLowerCase()}` !== origin) {
      throw new Error("SALESFORCE_INVALID_INPUT: absolute URLs must stay on the configured instanceUrl");
    }
    const rest = raw.slice(raw.toLowerCase().indexOf(match[1].toLowerCase()) + match[1].length).replace(/^:\d+/, "");
    return rest || "/";
  }
  return raw.startsWith("/") ? raw : `/${raw}`;
};
const dataPath = (path) => {
  const suffix = asString(path);
  if (!suffix || suffix === "/") return `/services/data/${configuredApiVersion()}`;
  return `/services/data/${configuredApiVersion()}${suffix.startsWith("/") ? suffix : `/${suffix}`}`;
};
const applyHeaders = (headers, extra) => {
  Object.entries(asObject(extra)).forEach(([key, value]) => {
    if (key.toLowerCase() === "authorization") throw new Error("SALESFORCE_INVALID_INPUT: Authorization cannot be overridden");
    if (value === undefined || value === null) return;
    headers[key] = String(value);
  });
  return headers;
};
const requestJson = async (path, method, body, query, headers) => {
  const token = await ConnectionApp.getAccessToken(CONNECTION_KEY);
  let suffix = instancePath(path);
  const extra = queryString(query);
  if (extra) {
    if (suffix.includes("?")) throw new Error("SALESFORCE_INVALID_INPUT: path already has a query string");
    suffix += extra;
  }
  const verb = asString(method).toUpperCase() || "GET";
  if (!/^[A-Z]+$/.test(verb)) throw new Error("SALESFORCE_INVALID_INPUT: method is invalid");
  const options = {
    method: verb,
    headers: applyHeaders({ Authorization: "Bearer " + token, Accept: "application/json" }, headers),
    muteHttpExceptions: true,
  };
  if (body !== undefined) {
    if (!hasHeader(options.headers, "content-type")) options.headers["Content-Type"] = "application/json";
    options.payload = typeof body === "string" ? body : JSON.stringify(body);
  }
  const response = await UrlFetchApp.fetch(configuredInstanceUrl() + suffix, options);
  const status = response.getResponseCode();
  const text = response.getContentText();
  const responseHeaders = response.getHeaders() || {};
  const contentType = headerValue(responseHeaders, "content-type");
  if (status < 200 || status >= 300) throw new Error(formatSalesforceError(status, text));
  if (!text.trim()) return {};
  if (/octet-stream|image\/|audio\/|video\/|application\/zip|application\/pdf/i.test(contentType)) {
    throw new Error("SALESFORCE_REQUEST_FAILED: binary responses are not readable as text");
  }
  try {
    return JSON.parse(text);
  } catch (_error) {
    return text;
  }
};
const dataRequest = (path, method, body, query, headers) => requestJson(dataPath(path), method, body, query, headers);
