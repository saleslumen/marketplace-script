const CONNECTION_KEY = "hubspot";
const DEFAULT_API_VERSION = "2026-09";
const API_ORIGIN = "https://api.hubapi.com";
const BATCH_RECORD_LIMIT = 100;
const ASSOCIATION_CREATE_LIMIT = 2000;
const ASSOCIATION_ARCHIVE_FROM_LIMIT = 100;
const asString = (value) => (value === undefined || value === null ? "" : String(value).trim());
const asObject = (value) => (value && typeof value === "object" && !Array.isArray(value) ? value : {});
const asArray = (value) => (Array.isArray(value) ? value : []);
const asProperties = (value) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("HUBSPOT_INVALID_INPUT: properties must be an object");
  return value;
};
const requireObject = (value, label) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`HUBSPOT_INVALID_INPUT: ${label} must be an object`);
  return value;
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
const requireObjectType = (value, label = "objectType") => {
  const objectType = asString(value);
  if (!objectType || /[\s/]/.test(objectType)) throw new Error(`HUBSPOT_INVALID_INPUT: ${label} is required`);
  return objectType;
};
const requireId = (value, label = "id") => {
  const id = asString(value);
  if (!id) throw new Error(`HUBSPOT_INVALID_INPUT: ${label} is required`);
  return id;
};
const requireList = (value, label, max) => {
  const listed = asArray(value);
  if (!listed.length) throw new Error(`HUBSPOT_INVALID_INPUT: ${label} is required`);
  if (max && listed.length > max) throw new Error(`HUBSPOT_INVALID_INPUT: at most ${max} ${label}`);
  return listed;
};
const requireObjectList = (value, label, max) => {
  const listed = requireList(value, label, max);
  listed.forEach((item, index) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      throw new Error(`HUBSPOT_INVALID_INPUT: ${label}[${index}] must be an object`);
    }
  });
  return listed;
};
const requireInputs = (value) => requireObjectList(value, "inputs", BATCH_RECORD_LIMIT);
const requireAssociationCreateInputs = (value) => requireObjectList(value, "inputs", ASSOCIATION_CREATE_LIMIT);
const requireArchiveAssociationInputs = (value) => {
  const listed = requireObjectList(value, "inputs");
  const fromIds = new Set();
  listed.forEach((item, index) => {
    const fromId = asString(item.from && item.from.id);
    fromIds.add(fromId || `missing:${index}`);
  });
  if (fromIds.size > ASSOCIATION_ARCHIVE_FROM_LIMIT) {
    throw new Error(`HUBSPOT_INVALID_INPUT: at most ${ASSOCIATION_ARCHIVE_FROM_LIMIT} unique from inputs`);
  }
  return listed;
};
const optionalCommaList = (value, label) => {
  if (value === undefined || value === null || value === "") return "";
  if (typeof value !== "string") throw new Error(`HUBSPOT_INVALID_INPUT: ${label} must be a comma-separated string`);
  return asString(value);
};
const optionalProperties = (value) => optionalCommaList(value, "properties");
const optionalAssociations = (value) => optionalCommaList(value, "associations");
const optionalIdProperty = (value) => {
  if (value === undefined || value === null || value === "") return "";
  if (typeof value !== "string") throw new Error("HUBSPOT_INVALID_INPUT: idProperty must be a string");
  return asString(value);
};
const optionalAssociationList = (value) => {
  if (value === undefined || value === null || value === "") return undefined;
  if (!Array.isArray(value)) throw new Error("HUBSPOT_INVALID_INPUT: associations must be an array");
  if (!value.length) return undefined;
  value.forEach((item, index) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      throw new Error(`HUBSPOT_INVALID_INPUT: associations[${index}] must be an object`);
    }
  });
  return value;
};
const optionalLimit = (value) => {
  if (value === undefined || value === null || value === "") return undefined;
  const limit = Number(value);
  if (!Number.isInteger(limit) || limit < 1 || limit > BATCH_RECORD_LIMIT) {
    throw new Error(`HUBSPOT_INVALID_INPUT: limit must be an integer from 1 to ${BATCH_RECORD_LIMIT}`);
  }
  return limit;
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
const objectsPath = (objectType, rest) =>
  `/crm/objects/${configuredApiVersion()}/${encodeURIComponent(requireObjectType(objectType))}${asString(rest)}`;
const propertiesPath = (objectType) => `/crm/properties/${configuredApiVersion()}/${encodeURIComponent(requireObjectType(objectType))}`;
const associationsBatchPath = (fromObjectType, toObjectType, rest) =>
  `/crm/associations/${configuredApiVersion()}/${encodeURIComponent(requireObjectType(fromObjectType, "fromObjectType"))}/${encodeURIComponent(requireObjectType(toObjectType, "toObjectType"))}${asString(rest)}`;
const objectAssociationsPath = (fromObjectType, fromId, toObjectType) =>
  `/crm/objects/${configuredApiVersion()}/${encodeURIComponent(requireObjectType(fromObjectType, "fromObjectType"))}/${encodeURIComponent(requireId(fromId, "fromId"))}/associations/${encodeURIComponent(requireObjectType(toObjectType, "toObjectType"))}`;
const accountPath = () => `/account-info/${configuredApiVersion()}/details`;
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
  if (!text.trim()) return { success: true, status };
  if (/octet-stream|image\/|audio\/|video\/|application\/zip|application\/pdf/i.test(contentType)) {
    throw new Error("HUBSPOT_REQUEST_FAILED: binary responses are not readable as text");
  }
  try {
    return JSON.parse(text);
  } catch (_error) {
    return { success: true, status, text, contentType };
  }
};
