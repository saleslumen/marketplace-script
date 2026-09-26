const DYNADOT_API_BASE_PROD = "https://api.dynadot.com";
const DYNADOT_API_BASE_SANDBOX = "https://api-sandbox.dynadot.com";
const DYNADOT_CONNECTION_KEY = "dynadot";
const DYNADOT_SECRET_CONNECTION_KEY = "dynadotSecret";
const asString = (value) => (value === undefined || value === null ? "" : String(value).trim());
const missing = (value) => value === undefined || value === null || value === "";
const invalid = (reason) => {
  throw new Error(`DYNADOT_INVALID_INPUT: ${reason}`);
};
const labelOf = (prefix, name) => (prefix ? `${prefix}.${name}` : name);
const normalizeApiBase = (value) => {
  const text = asString(value);
  const lower = text.toLowerCase();
  if (lower === "sandbox") return DYNADOT_API_BASE_SANDBOX;
  if ((lower.startsWith("http://") || lower.startsWith("https://")) && lower.includes("sandbox")) return DYNADOT_API_BASE_SANDBOX;
  return DYNADOT_API_BASE_PROD;
};
const configValue = (key) => {
  const configuration = (typeof ScriptContext !== "undefined" && ScriptContext && ScriptContext.configuration) || {};
  const value = configuration[key];
  return typeof value === "string" ? value.trim() : "";
};
const nextRequestId = () => {
  if (typeof dynadotCreateRequestId === "function") return dynadotCreateRequestId();
  if (typeof Utilities !== "undefined" && Utilities.getUuid) return Utilities.getUuid();
  throw new Error("DYNADOT_REQUEST_FAILED: request id helper is required");
};
function createSignature(apiKey, apiSecret, fullPathAndQuery, xRequestId, requestBody) {
  const stringToSign = `${asString(apiKey)}\n${asString(fullPathAndQuery)}\n${asString(xRequestId)}\n${asString(requestBody)}`;
  if (typeof dynadotHmacSha256Base64 === "function") return dynadotHmacSha256Base64(apiSecret, stringToSign);
  if (typeof Utilities === "undefined" || !Utilities.computeHmacSha256Signature || !Utilities.base64Encode) {
    throw new Error("DYNADOT_REQUEST_FAILED: HMAC helper is required");
  }
  return Utilities.base64Encode(Utilities.computeHmacSha256Signature(stringToSign, apiSecret));
}
const redactSecrets = (text, secrets) => {
  let out = asString(text);
  const values = secrets && typeof secrets === "object" ? secrets : {};
  [values.apiKey, values.apiSecret, values.authorization, values.signature].forEach((secret) => {
    const token = asString(secret);
    if (token) out = out.split(token).join("[REDACTED]");
  });
  out = out.replace(/(Authorization:\s*Bearer\s+)(\S+)/gi, "$1[REDACTED]");
  out = out.replace(/(X-Signature:\s*)(\S+)/gi, "$1[REDACTED]");
  out = out.replace(/([?&]key=)[^&\s]*/gi, "$1[REDACTED]");
  return out;
};
const vendorMessage = (body, text) => {
  if (body && typeof body === "object") {
    const error = body.error;
    const description = error && typeof error === "object" ? asString(error.description || error.Description) : asString(error);
    const message = asString(body.message || body.Message || description);
    if (message) return message;
  }
  return asString(text);
};
const parseResponseText = (text) => {
  const raw = text === undefined || text === null ? "" : String(text).trim();
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch (_error) {
    return null;
  }
};
const getDynadotAuth = async () => {
  const apiKey = asString(await ConnectionApp.getApiKey(DYNADOT_CONNECTION_KEY));
  const apiSecret = asString(await ConnectionApp.getApiKey(DYNADOT_SECRET_CONNECTION_KEY));
  if (!apiKey || !apiSecret) throw new Error("DYNADOT_AUTH_MISSING: connect the Dynadot API key and signing secret");
  return { apiKey, apiSecret, apiBase: normalizeApiBase(configValue("apiBase") || "prod") };
};
const pathText = (value, label) => {
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value === "string" && value !== "") return value;
  invalid(`${label} must be a string or number`);
};
const checkObject = (source, fields, prefix) => {
  const allowed = new Set((fields || []).map((field) => field.name));
  Object.keys(source).forEach((key) => {
    if (!allowed.has(key)) invalid(`${labelOf(prefix, key)} is not a parameter`);
  });
  const out = {};
  (fields || []).forEach((field) => {
    const label = labelOf(prefix, field.name);
    const value = source[field.name];
    if (missing(value) || (field.required && field.type === "list" && Array.isArray(value) && value.length === 0)) {
      if (field.required) invalid(`${label} is required`);
      return;
    }
    out[field.name] = checkField(value, field, label);
  });
  return out;
};
const checkField = (value, field, label) => {
  if (field.type === "path") return pathText(value, label);
  if (field.type === "string") {
    if (typeof value !== "string") invalid(`${label} must be a string`);
    return value;
  }
  if (field.type === "integer" || field.type === "double") {
    if (typeof value !== "number" || !Number.isFinite(value)) invalid(`${label} must be a number`);
    return value;
  }
  if (field.type === "boolean") {
    if (typeof value !== "boolean") invalid(`${label} must be a boolean`);
    return value;
  }
  if (field.type === "list") {
    if (!Array.isArray(value)) invalid(`${label} must be a list`);
    return value.map((item, index) => {
      const itemLabel = `${label}[${index}]`;
      if (field.item === "object") {
        if (!item || typeof item !== "object" || Array.isArray(item)) invalid(`${itemLabel} must be an object`);
        return checkObject(item, field.fields || [], itemLabel);
      }
      if (typeof item !== "string") invalid(`${itemLabel} must be a string`);
      return item;
    });
  }
  if (field.type === "object") {
    if (!value || typeof value !== "object" || Array.isArray(value)) invalid(`${label} must be an object`);
    return checkObject(value, field.fields || [], label);
  }
  invalid(`${label} is not supported`);
};
const encodeQuery = (value, field) => {
  if (field.type === "list") return value.map((item) => encodeURIComponent(item)).join(",");
  const text = field.type === "boolean" ? (value ? "true" : "false") : String(value);
  return encodeURIComponent(text);
};
const readInput = (input, needsObject) => {
  if (input === undefined || input === null) {
    if (needsObject) invalid("input must be an object");
    return {};
  }
  if (typeof input !== "object" || Array.isArray(input)) invalid("input must be an object");
  return input;
};
async function dynadotSend(method, requestPath, payloadText) {
  const auth = await getDynadotAuth();
  const verb = asString(method).toUpperCase() || "GET";
  const path = requestPath.startsWith("/") ? requestPath : `/${requestPath}`;
  const fullPathAndQuery = `/restful/v2${path}`;
  const headers = { Accept: "application/json", Authorization: `Bearer ${auth.apiKey}` };
  const options = { method: verb, headers, muteHttpExceptions: true };
  if (payloadText) {
    headers["Content-Type"] = "application/json";
    options.payload = payloadText;
  }
  const xRequestId = nextRequestId();
  headers["X-Request-ID"] = xRequestId;
  headers["X-Signature"] = createSignature(auth.apiKey, auth.apiSecret, fullPathAndQuery, xRequestId, payloadText || "");
  const secrets = { apiKey: auth.apiKey, apiSecret: auth.apiSecret, authorization: `Bearer ${auth.apiKey}`, signature: headers["X-Signature"] };
  let response;
  try {
    response = await UrlFetchApp.fetch(`${auth.apiBase}${fullPathAndQuery}`, options);
  } catch (error) {
    throw new Error(`DYNADOT_REQUEST_FAILED: 0 ${redactSecrets(error && error.message, secrets)}`);
  }
  const status = Number(response.getResponseCode()) || 0;
  const text = response.getContentText();
  const parsed = parseResponseText(text);
  if (status < 200 || status >= 300) {
    const message = redactSecrets(vendorMessage(parsed, text), secrets) || "request failed";
    throw new Error(`DYNADOT_REQUEST_FAILED: ${status} ${message}`);
  }
  if (parsed === null) throw new Error(`DYNADOT_REQUEST_FAILED: ${status} invalid json`);
  return parsed;
}
async function dynadotRest(spec, input) {
  const fields = spec.fields || [];
  const needsObject = fields.some((field) => field.required || field.in === "path");
  const source = readInput(input, needsObject);
  const allowed = new Set(fields.map((field) => field.name));
  Object.keys(source).forEach((key) => {
    if (!allowed.has(key)) invalid(`${key} is not a parameter`);
  });
  const pathValues = {};
  const query = [];
  const body = {};
  fields.forEach((field) => {
    const value = source[field.name];
    const absent = missing(value) || (field.required && field.type === "list" && Array.isArray(value) && value.length === 0);
    if (absent) {
      if (field.required || field.in === "path") invalid(`${field.name} is required`);
      return;
    }
    if (field.in === "path") {
      pathValues[field.name] = pathText(value, field.name);
      return;
    }
    const checked = checkField(value, field, field.name);
    if (field.in === "query") query.push([field.name, encodeQuery(checked, field)]);
    else body[field.name] = checked;
  });
  let path = spec.path;
  Object.keys(pathValues).forEach((key) => {
    path = path.split(`{${key}}`).join(encodeURIComponent(pathValues[key]));
  });
  if (path.includes("{") || path.includes("}")) invalid("path parameter is required");
  const queryString = query.map(([key, value]) => `${encodeURIComponent(key)}=${value}`).join("&");
  const requestPath = queryString ? `${path}?${queryString}` : path;
  const payloadText = Object.keys(body).length ? JSON.stringify(body) : "";
  return dynadotSend(spec.method, requestPath, payloadText);
}
