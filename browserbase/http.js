const BROWSERBASE_API_BASE = "https://api.browserbase.com";
const CONNECTION_KEY = "browserbase";
const SESSION_STATUSES = ["PENDING", "RUNNING", "ERROR", "TIMED_OUT", "COMPLETED"];
const REGIONS = ["us-west-2", "us-east-1", "eu-central-1", "ap-southeast-1"];
const OS_VALUES = ["windows", "mac", "linux", "mobile", "tablet"];
const PROXY_TYPES = ["browserbase", "external", "none"];
const BROWSER_SETTING_FLAGS = ["blockAds", "solveCaptchas", "recordSession", "logSession", "advancedStealth", "verified", "ignoreCertificateErrors"];
const COUNTRY_CODE = /^[A-Za-z]{2}$/;
const UUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
const DATE_TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;
const PAGE_ID = /^\d+$/;
const defined = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key) && obj[key] !== undefined;
const joinOr = (allowed) => (allowed.length < 2 ? allowed.join("") : `${allowed.slice(0, -1).join(", ")}, or ${allowed[allowed.length - 1]}`);
const fail = (message) => {
  throw new Error(`BROWSERBASE_REQUEST_FAILED: ${message}`);
};
const requireObjectInput = (input) => {
  if (!input || typeof input !== "object" || Array.isArray(input)) fail("input must be an object");
  return input;
};
const optionalInput = (input) => (input === undefined || input === null ? {} : requireObjectInput(input));
const requireString = (value, name) => {
  if (typeof value !== "string" || value.length < 1) fail(`${name} is required`);
  return value;
};
const requireId = (value, name) => {
  if (typeof value !== "string" || !value.trim()) fail(`${name} is required`);
  return value.trim();
};
const requireBoolean = (value, name) => {
  if (typeof value !== "boolean") fail(`${name} must be a boolean`);
  return value;
};
const requireInteger = (value, name, min, max) => {
  if (typeof value !== "number" || !Number.isInteger(value)) fail(`${name} must be an integer`);
  if ((min !== undefined && value < min) || (max !== undefined && value > max)) {
    const range = max === undefined ? `an integer greater than or equal to ${min}` : `an integer from ${min} to ${max}`;
    fail(`${name} must be ${range}`);
  }
  return value;
};
const requireNumber = (value, name, min) => {
  if (typeof value !== "number" || !Number.isFinite(value) || value < min) fail(`${name} must be a number greater than or equal to ${min}`);
  return value;
};
const requireEnum = (value, name, allowed) => {
  if (!allowed.includes(value)) fail(`${name} must be ${joinOr(allowed)}`);
  return value;
};
const requirePattern = (value, name, pattern, expected) => {
  if (typeof value !== "string" || !pattern.test(value)) fail(`${name} must be ${expected}`);
  return value;
};
const requirePlainObject = (value, name) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) fail(`${name} must be an object`);
  return value;
};
const requireBoundedString = (value, name, max) => {
  const text = requireString(value, name);
  if (text.length > max) fail(`${name} must be at most ${max} characters`);
  return text;
};
const requireStringArray = (value, name) => {
  if (!Array.isArray(value)) fail(`${name} must be an array`);
  return value.map((item, index) => requireString(item, `${name}[${index}]`));
};
const requireUuidArray = (value, name) => {
  if (!Array.isArray(value)) fail(`${name} must be an array`);
  return value.map((item, index) => requirePattern(item, `${name}[${index}]`, UUID, "a UUID"));
};
const requireDateTime = (value, name) => requirePattern(value, name, DATE_TIME, "an RFC 3339 date-time");
const requirePathId = (input) => {
  const req = requireObjectInput(input);
  return { req, id: requireId(req.id, "id") };
};
const requirePageId = (value) => {
  if (typeof value !== "string" || value.length < 1 || value.length > 3 || !PAGE_ID.test(value)) fail("pageId must be 1 to 3 digits");
  return value;
};
const pushQuery = (parts, key, value) => {
  parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
};
const queryString = (parts) => (parts.length ? `?${parts.join("&")}` : "");
const buildGeolocation = (value, name) => {
  const geo = requirePlainObject(value, name);
  const out = { country: requirePattern(geo.country, `${name}.country`, COUNTRY_CODE, "a 2-letter country code") };
  if (defined(geo, "state")) out.state = requirePattern(geo.state, `${name}.state`, COUNTRY_CODE, "a 2-letter state code");
  if (defined(geo, "city")) out.city = requireString(geo.city, `${name}.city`);
  return out;
};
const buildProxy = (value, index) => {
  const name = `proxies[${index}]`;
  const proxy = requirePlainObject(value, name);
  const type = requireEnum(proxy.type, `${name}.type`, PROXY_TYPES);
  const item = { type };
  if (type === "external") item.server = requireString(proxy.server, `${name}.server`);
  if (defined(proxy, "domainPattern")) item.domainPattern = requireString(proxy.domainPattern, `${name}.domainPattern`);
  if (type === "external" && defined(proxy, "username")) item.username = requireString(proxy.username, `${name}.username`);
  if (type === "external" && defined(proxy, "password")) item.password = requireString(proxy.password, `${name}.password`);
  if (type === "browserbase" && defined(proxy, "geolocation")) item.geolocation = buildGeolocation(proxy.geolocation, `${name}.geolocation`);
  return item;
};
const buildProxies = (value) => {
  if (typeof value === "boolean") return value;
  if (!Array.isArray(value)) fail("proxies must be a boolean or an array");
  return value.map((item, index) => buildProxy(item, index));
};
const buildProxySettings = (value) => {
  const settings = requirePlainObject(value, "proxySettings");
  const body = {};
  if (defined(settings, "caCertificates")) body.caCertificates = requireUuidArray(settings.caCertificates, "proxySettings.caCertificates");
  if (!Object.keys(body).length) fail("proxySettings is empty");
  return body;
};
const buildBrowserSettings = (value) => {
  const settings = requirePlainObject(value, "browserSettings");
  const body = {};
  if (defined(settings, "context")) {
    const context = requirePlainObject(settings.context, "browserSettings.context");
    const next = { id: requireString(context.id, "browserSettings.context.id") };
    if (defined(context, "persist")) next.persist = requireBoolean(context.persist, "browserSettings.context.persist");
    body.context = next;
  }
  if (defined(settings, "extensionId")) body.extensionId = requireString(settings.extensionId, "browserSettings.extensionId");
  if (defined(settings, "viewport")) {
    const viewport = requirePlainObject(settings.viewport, "browserSettings.viewport");
    const next = {};
    if (defined(viewport, "width")) next.width = requireInteger(viewport.width, "browserSettings.viewport.width");
    if (defined(viewport, "height")) next.height = requireInteger(viewport.height, "browserSettings.viewport.height");
    if (!Object.keys(next).length) fail("browserSettings.viewport.width or browserSettings.viewport.height is required");
    body.viewport = next;
  }
  BROWSER_SETTING_FLAGS.forEach((key) => {
    if (defined(settings, key)) body[key] = requireBoolean(settings[key], `browserSettings.${key}`);
  });
  if (defined(settings, "captchaImageSelector")) body.captchaImageSelector = requireString(settings.captchaImageSelector, "browserSettings.captchaImageSelector");
  if (defined(settings, "captchaInputSelector")) body.captchaInputSelector = requireString(settings.captchaInputSelector, "browserSettings.captchaInputSelector");
  if (defined(settings, "os")) body.os = requireEnum(settings.os, "browserSettings.os", OS_VALUES);
  if (defined(settings, "allowedDomains")) body.allowedDomains = requireStringArray(settings.allowedDomains, "browserSettings.allowedDomains");
  if (!Object.keys(body).length) fail("browserSettings is empty");
  return body;
};
const buildCreateSessionBody = (input) => {
  const req = optionalInput(input);
  const body = {};
  if (defined(req, "projectId")) body.projectId = requireString(req.projectId, "projectId");
  if (defined(req, "extensionId")) body.extensionId = requireString(req.extensionId, "extensionId");
  if (defined(req, "browserSettings")) body.browserSettings = buildBrowserSettings(req.browserSettings);
  if (defined(req, "timeout")) body.timeout = requireInteger(req.timeout, "timeout", 60, 21600);
  if (defined(req, "keepAlive")) body.keepAlive = requireBoolean(req.keepAlive, "keepAlive");
  if (defined(req, "proxies")) body.proxies = buildProxies(req.proxies);
  if (defined(req, "proxySettings")) body.proxySettings = buildProxySettings(req.proxySettings);
  if (defined(req, "region")) body.region = requireEnum(req.region, "region", REGIONS);
  if (defined(req, "userMetadata")) body.userMetadata = requirePlainObject(req.userMetadata, "userMetadata");
  return body;
};
const buildContextBody = (input) => {
  const req = optionalInput(input);
  const body = {};
  if (defined(req, "projectId")) body.projectId = requireString(req.projectId, "projectId");
  if (defined(req, "name")) body.name = requireBoundedString(req.name, "name", 128);
  return body;
};
const buildDownloadsQuery = (input) => {
  const req = requireObjectInput(input);
  const parts = [];
  pushQuery(parts, "sessionId", requireId(req.sessionId, "sessionId"));
  if (defined(req, "filename")) pushQuery(parts, "filename", requireBoundedString(req.filename, "filename", 255));
  if (defined(req, "mimeType")) pushQuery(parts, "mimeType", requireBoundedString(req.mimeType, "mimeType", 255));
  if (defined(req, "minSize")) pushQuery(parts, "minSize", requireNumber(req.minSize, "minSize", 0));
  if (defined(req, "maxSize")) pushQuery(parts, "maxSize", requireNumber(req.maxSize, "maxSize", 0));
  if (defined(req, "createdAfter")) pushQuery(parts, "createdAfter", requireDateTime(req.createdAfter, "createdAfter"));
  if (defined(req, "createdBefore")) pushQuery(parts, "createdBefore", requireDateTime(req.createdBefore, "createdBefore"));
  if (defined(req, "limit")) pushQuery(parts, "limit", requireInteger(req.limit, "limit", 1, 100));
  if (defined(req, "offset")) pushQuery(parts, "offset", requireInteger(req.offset, "offset", 0));
  return queryString(parts);
};
const multipartFile = (file) => {
  const content = requireString(file, "file");
  let boundary = "browserbaseboundary";
  while (content.includes(boundary)) boundary += "x";
  const payload = `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="file"\r\nContent-Type: application/octet-stream\r\n\r\n${content}\r\n--${boundary}--\r\n`;
  return { boundary, payload };
};
const browserbaseRequest = async (path, method, body, request) => {
  const apiKey = await ConnectionApp.getApiKey(CONNECTION_KEY);
  const headers = { "X-BB-API-Key": apiKey, Accept: request && request.accept ? request.accept : "application/json" };
  const options = { method, headers };
  if (request && request.multipart) {
    const packed = multipartFile(request.file);
    headers["Content-Type"] = `multipart/form-data; boundary=${packed.boundary}`;
    options.payload = packed.payload;
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    options.payload = JSON.stringify(body);
  }
  const response = await UrlFetchApp.fetch(`${BROWSERBASE_API_BASE}${path}`, options);
  const status = response.getResponseCode();
  const text = response.getContentText();
  if (status < 200 || status >= 300) throw new Error(`BROWSERBASE_REQUEST_FAILED (${status}): ${text}`);
  if (request && request.raw) return text;
  return text.trim() ? JSON.parse(text) : null;
};
