const CONNECTION_KEY = "salesforce";
const DEFAULT_API_VERSION = "v68.0";
const SOBJECT_NAME = /^[A-Za-z][A-Za-z0-9_]*$/;
const COLLECTION_RECORD_LIMIT = 200;
const COMPOSITE_REQUEST_LIMIT = 25;
const asString = (value) => (value === undefined || value === null ? "" : String(value).trim());
const asObject = (value) => (value && typeof value === "object" && !Array.isArray(value) ? value : {});
const asArray = (value) => (Array.isArray(value) ? value : []);
const asFields = (value) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("SALESFORCE_INVALID_INPUT: fields must be an object");
  return value;
};
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
  if (raw.toLowerCase() === "latest") return "latest";
  if (!/^\d+\.\d+$/.test(raw)) throw new Error("SALESFORCE_NOT_CONFIGURED: apiVersion must look like v68.0 or latest");
  return `v${raw}`;
};
const requireSObject = (value) => {
  const sobject = asString(value);
  if (!SOBJECT_NAME.test(sobject)) throw new Error("SALESFORCE_INVALID_INPUT: sobject is required and must be an API name");
  return sobject;
};
const requireId = (value, label = "id") => {
  const id = asString(value);
  if (!id) throw new Error(`SALESFORCE_INVALID_INPUT: ${label} is required`);
  return id;
};
const requireList = (value, label, max) => {
  const listed = asArray(value);
  if (!listed.length) throw new Error(`SALESFORCE_INVALID_INPUT: ${label} is required`);
  if (max && listed.length > max) throw new Error(`SALESFORCE_INVALID_INPUT: at most ${max} ${label}`);
  return listed;
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
const optionalFlag = (value) => {
  if (value === true || value === false) return value;
  if (asString(value).toLowerCase() === "true") return true;
  if (asString(value).toLowerCase() === "false") return false;
  return undefined;
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
const locationId = (location) => {
  const parts = asString(location).split("?")[0].split("/").filter(Boolean);
  return parts.length ? asString(parts[parts.length - 1]) : "";
};
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
const queryResult = (result) => ({
  totalSize: Number(result.totalSize) || 0,
  done: result.done !== false,
  nextRecordsUrl: asString(result.nextRecordsUrl),
  records: asArray(result.records),
});
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
  if (!text.trim()) return { success: true, status, location: headerValue(responseHeaders, "location") };
  if (/octet-stream|image\/|audio\/|video\/|application\/zip|application\/pdf/i.test(contentType)) {
    throw new Error("SALESFORCE_REQUEST_FAILED: binary responses are not readable as text");
  }
  try {
    return JSON.parse(text);
  } catch (_error) {
    return { success: true, status, text, contentType };
  }
};
const dataRequest = (path, method, body, query, headers) => requestJson(dataPath(path), method, body, query, headers);
const withSObjectType = (sobject, records) =>
  requireObjectList(records, "records", COLLECTION_RECORD_LIMIT).map((record, index) => {
    const fields = record;
    const attributes = asObject(fields.attributes);
    const type = asString(attributes.type) || sobject;
    if (!SOBJECT_NAME.test(type)) {
      throw new Error(`SALESFORCE_INVALID_INPUT: records[${index}] needs sobject or attributes.type`);
    }
    const next = { ...fields };
    delete next.attributes;
    return { ...next, attributes: { ...attributes, type } };
  });
