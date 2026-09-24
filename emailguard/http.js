const EMAILGUARD_API_BASE = "https://app.emailguard.io";
const CONNECTION_KEY = "emailguard";
const SECRET_KEYS = new Set([
  "password",
  "current_password",
  "password_confirmation",
  "imap_password",
  "smtp_password",
]);
const asString = (value) => (value === undefined || value === null ? "" : String(value).trim());
const asBoolean = (value, fallback = false) => {
  if (typeof value === "boolean") return value;
  const text = asString(value).toLowerCase();
  if (!text) return fallback;
  if (["1", "true", "yes", "y"].includes(text)) return true;
  if (["0", "false", "no", "n"].includes(text)) return false;
  return fallback;
};
const asNumber = (value, fallback) => {
  const text = asString(value);
  if (!text) return fallback;
  const number = Number(text);
  return Number.isFinite(number) ? number : fallback;
};
const asJsonList = (value) => {
  if (Array.isArray(value)) return value;
  const text = asString(value);
  if (!text) return [];
  if (text.startsWith("[")) {
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) return parsed;
    } catch (_error) {
      return [];
    }
  }
  return text.split(",").map((item) => item.trim()).filter(Boolean);
};
const buildQuery = (params) => {
  const parts = [];
  Object.keys(params || {}).forEach((key) => {
    const value = params[key];
    if (value === undefined || value === null || value === "") return;
    if (Array.isArray(value)) {
      value.forEach((item) => {
        const text = asString(item);
        if (text) parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(text)}`);
      });
      return;
    }
    parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(asString(value))}`);
  });
  return parts.length ? `?${parts.join("&")}` : "";
};
const firstPresent = (req, names) => {
  const source = req && typeof req === "object" ? req : {};
  for (const name of names) {
    if (!Object.prototype.hasOwnProperty.call(source, name)) continue;
    const value = source[name];
    if (value === undefined || value === null || value === "") continue;
    return value;
  }
  return undefined;
};
const isRetryableStatus = (status) => {
  const code = Number(status) || 0;
  return code === 429 || code >= 500 || code === 0;
};
const getEmailGuardApiKey = async () => ConnectionApp.getApiKey(CONNECTION_KEY);
const stripSecrets = (value) => {
  if (Array.isArray(value)) return value.map(stripSecrets);
  if (!value || typeof value !== "object") return value;
  const out = {};
  Object.keys(value).forEach((key) => {
    if (SECRET_KEYS.has(key)) return;
    out[key] = stripSecrets(value[key]);
  });
  return out;
};
const vendorData = (body) => {
  if (!body || typeof body !== "object") return body;
  if (Object.prototype.hasOwnProperty.call(body, "data")) return body.data;
  return body;
};
const classifyHttp = (raw) => {
  const status = Number(raw && raw.status) || 0;
  const body = (raw && raw.body && typeof raw.body === "object") ? raw.body : {};
  const text = asString(raw && raw.text);
  const message = asString(body.message || (body.data && body.data.message) || body.error || text);
  return {
    status,
    body,
    text,
    message,
    retryable: isRetryableStatus(status),
  };
};
const classifiedResult = (classified, successOutcome, failOutcome) => {
  const status = classified.status;
  const data = stripSecrets(vendorData(classified.body));
  const failure = classified.message || `EmailGuard request failed (${status})`;
  if (status === 401) {
    return { ok: false, outcome: "UNAUTHORIZED", retryable: false, failure, status };
  }
  if (status === 429 || classified.retryable) {
    return { ok: false, outcome: "RATE_LIMITED", retryable: true, failure: classified.message || "EmailGuard rate limited", status };
  }
  if (status < 200 || status >= 300) {
    return { ok: false, outcome: failOutcome, retryable: classified.retryable, failure, status };
  }
  return { ok: true, outcome: successOutcome, retryable: false, failure: "", status, data };
};
const missingInput = (fields) => ({
  ok: false,
  outcome: "MISSING_INPUT",
  retryable: false,
  failure: `${fields} is required`,
});
const buildMultipart = (fields) => {
  const boundary = "emailguard-form-boundary";
  const chunks = [];
  Object.keys(fields).forEach((name) => {
    const field = fields[name];
    if (field && typeof field === "object" && Object.prototype.hasOwnProperty.call(field, "content")) {
      const filename = asString(field.filename) || "upload.csv";
      const contentType = asString(field.contentType) || "text/csv";
      chunks.push(`--${boundary}\r\nContent-Disposition: form-data; name="${name}"; filename="${filename}"\r\nContent-Type: ${contentType}\r\n\r\n${field.content}\r\n`);
      return;
    }
    chunks.push(`--${boundary}\r\nContent-Disposition: form-data; name="${name}"\r\n\r\n${asString(field)}\r\n`);
  });
  chunks.push(`--${boundary}--\r\n`);
  return { boundary, payload: chunks.join("") };
};
const emailguardRequestRaw = async (path, method = "GET", body, opts = {}) => {
  const headers = { Accept: "application/json" };
  if (opts.auth !== false) {
    headers.Authorization = `Bearer ${await getEmailGuardApiKey()}`;
  }
  const verb = asString(method).toUpperCase() || "GET";
  const options = { method: verb, headers, muteHttpExceptions: true };
  let urlPath = path;
  if (verb === "GET") {
    if (body && typeof body === "object") urlPath = `${path}${buildQuery(body)}`;
  } else if (opts.multipart === true && body && typeof body === "object") {
    const packed = buildMultipart(body);
    headers["Content-Type"] = `multipart/form-data; boundary=${packed.boundary}`;
    options.payload = packed.payload;
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    options.payload = JSON.stringify(body);
  }
  const response = await UrlFetchApp.fetch(`${EMAILGUARD_API_BASE}${urlPath}`, options);
  const status = response.getResponseCode();
  const text = response.getContentText();
  let parsed = {};
  if (text.trim()) {
    try {
      parsed = JSON.parse(text);
    } catch (_error) {
      parsed = { data: text };
    }
  }
  return { status, body: parsed, text };
};
const runAuthed = async (path, method, body, successOutcome, failOutcome) => (
  classifiedResult(classifyHttp(await emailguardRequestRaw(path, method, body, { auth: true })), successOutcome, failOutcome)
);
const runPublic = async (path, method, body, successOutcome, failOutcome) => (
  classifiedResult(classifyHttp(await emailguardRequestRaw(path, method, body, { auth: false })), successOutcome, failOutcome)
);
