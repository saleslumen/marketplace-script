const SPACESHIP_API_BASE = "https://spaceship.dev/api/v1";
const SPACESHIP_CONNECTION_KEY = "spaceship";
const SPACESHIP_SECRET_CONNECTION_KEY = "spaceshipSecret";
const asString = (value) => (value === undefined || value === null ? "" : String(value).trim());
const asCsvList = (value) => {
  if (Array.isArray(value)) return value.map(asString).filter(Boolean);
  return asString(value).split(",").map((item) => item.trim()).filter(Boolean);
};
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
const asZoneList = (value) => {
  if (Array.isArray(value)) return value.filter((row) => row && typeof row === "object");
  const text = asString(value);
  if (!text) return [];
  if (text.startsWith("[")) {
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) return parsed.filter((row) => row && typeof row === "object");
    } catch (_error) {
      return [];
    }
  }
  return [];
};
const sleepMs = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const getSpaceshipAuth = async () => {
  const apiKey = await ConnectionApp.getApiKey(SPACESHIP_CONNECTION_KEY);
  const apiSecret = await ConnectionApp.getApiKey(SPACESHIP_SECRET_CONNECTION_KEY);
  if (!apiKey || !apiSecret) {
    throw new Error("SPACESHIP_AUTH_MISSING: connect the Spaceship API key and API secret");
  }
  return { apiKey, apiSecret };
};
const headerValue = (headers, name) => {
  if (!headers || typeof headers !== "object") return "";
  const wanted = String(name).toLowerCase();
  for (const [key, value] of Object.entries(headers)) {
    if (String(key).toLowerCase() === wanted) return asString(value);
  }
  return "";
};
const spaceshipRequest = async (path, method = "GET", body) => {
  const auth = await getSpaceshipAuth();
  const options = {
    method,
    headers: {
      "X-Api-Key": auth.apiKey,
      "X-Api-Secret": auth.apiSecret,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };
  if (body !== undefined) options.payload = JSON.stringify(body);
  const response = await UrlFetchApp.fetch(`${SPACESHIP_API_BASE}${path}`, options);
  const status = response.getResponseCode();
  const text = response.getContentText();
  const headers = typeof response.getHeaders === "function" ? response.getHeaders() : {};
  if (status === 202) {
    return {
      async: true,
      operationId: headerValue(headers, "spaceship-async-operationid"),
      body: text.trim() ? JSON.parse(text) : {},
      status,
    };
  }
  if (status < 200 || status >= 300) {
    const error = new Error(`SPACESHIP_REQUEST_FAILED (${status}): ${text}`);
    error.status = status;
    error.body = text;
    throw error;
  }
  return text.trim() ? JSON.parse(text) : {};
};
const spaceshipRequestRaw = async (path, method = "GET", body) => {
  const auth = await getSpaceshipAuth();
  const options = {
    method,
    headers: {
      "X-Api-Key": auth.apiKey,
      "X-Api-Secret": auth.apiSecret,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };
  if (body !== undefined) options.payload = JSON.stringify(body);
  const response = await UrlFetchApp.fetch(`${SPACESHIP_API_BASE}${path}`, options);
  const status = response.getResponseCode();
  const text = response.getContentText();
  const headers = typeof response.getHeaders === "function" ? response.getHeaders() : {};
  let parsed = {};
  if (text.trim()) {
    try {
      parsed = JSON.parse(text);
    } catch (_error) {
      parsed = { raw: text };
    }
  }
  return {
    status,
    body: parsed,
    operationId: headerValue(headers, "spaceship-async-operationid"),
    text,
  };
};
const extractDomainPrice = (row) => {
  if (!row || typeof row !== "object") return null;
  const candidates = [row.price, row.registrationPrice, row.registerPrice, row.amount, row.cost];
  if (row.prices && typeof row.prices === "object") {
    candidates.push(row.prices.register, row.prices.registration, row.prices.create);
  }
  for (const candidate of candidates) {
    const number = Number(candidate);
    if (Number.isFinite(number) && number >= 0) return number;
  }
  return null;
};
const getOwnedDomain = async (domain) => {
  const raw = await spaceshipRequestRaw(`/domains/${encodeURIComponent(domain)}`, "GET");
  if (raw.status === 200 && (raw.body.name || raw.body.unicodeName || raw.body.lifecycleStatus)) {
    return { owned: true, domain, detail: raw.body };
  }
  if (raw.status === 404) return { owned: false, domain, detail: null };
  throw new Error(`SPACESHIP_REQUEST_FAILED (${raw.status}): ${raw.text}`);
};
const pollAsyncOperation = async (operationId, options = {}) => {
  const id = asString(operationId);
  if (!id) return { status: "failed", operationId: "", failure: "async operation id missing" };
  const maxAttempts = Math.max(1, Number(options.maxAttempts) || 6);
  const delayMs = Math.max(250, Number(options.delayMs) || 2000);
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const statusResponse = await spaceshipRequest(`/async-operations/${encodeURIComponent(id)}`, "GET");
    const status = asString(statusResponse.status || statusResponse.state).toLowerCase();
    if (status === "success") return { status: "success", operationId: id, detail: statusResponse, failure: "" };
    if (status === "failed") {
      return {
        status: "failed",
        operationId: id,
        detail: statusResponse,
        failure: asString(statusResponse.error || statusResponse.message || "async operation failed"),
      };
    }
    if (attempt < maxAttempts - 1) await sleepMs(delayMs);
  }
  return { status: "pending", operationId: id, failure: "async operation still pending" };
};
const isPermanentNameserverApiError = (errorOrFailure) => {
  const message = asString(typeof errorOrFailure === "string" ? errorOrFailure : errorOrFailure && errorOrFailure.message);
  if (!message) return false;
  if (/AUTH_MISSING|UNAUTHORIZED|FORBIDDEN|invalid credentials|API key|ApiKey/i.test(message)) return true;
  const status = Number(typeof errorOrFailure === "object" && errorOrFailure ? errorOrFailure.status : NaN);
  if (status === 400 || status === 401 || status === 403 || status === 422) return true;
  if (/\((\s*)(400|401|403|422)(\s*)\)/.test(message)) return true;
  if (/not owned|Domain not found/i.test(message)) return true;
  return false;
};
const normalizeNameserverList = (value) => {
  if (value === undefined || value === null) return { nameservers: [], unparseable: false };
  if (Array.isArray(value)) {
    return { nameservers: value.map(asString).filter(Boolean), unparseable: false };
  }
  if (typeof value === "string" || typeof value === "number") {
    return { nameservers: asCsvList(value), unparseable: false };
  }
  return { nameservers: [], unparseable: true };
};
const evaluateNameserverReadBack = (readBack, expectedNameservers) => {
  const expected = expectedNameservers.map((ns) => asString(ns).toLowerCase()).filter(Boolean);
  const actual = Array.isArray(readBack && readBack.nameservers)
    ? readBack.nameservers.map((ns) => asString(ns).toLowerCase()).filter(Boolean)
    : [];
  const missingNs = expected.filter((ns) => !actual.includes(ns));
  const failure = asString(readBack && readBack.failure);
  if (!readBack) {
    return {
      kind: "pending",
      outcome: "NAMESERVER_READBACK_PENDING",
      actual: [],
      missingNs: expected,
      failure: "NS read-back empty or unparseable",
    };
  }
  if (readBack.owned === false || isPermanentNameserverApiError(failure)) {
    return {
      kind: "failed",
      outcome: "NAMESERVER_FAILED",
      actual,
      missingNs,
      failure: failure || "domain not owned",
    };
  }
  if (readBack.unparseable || !actual.length || missingNs.length) {
    let message = failure;
    if (!message) {
      if (readBack.unparseable) message = "NS read-back unparseable";
      else if (!actual.length) message = "NS read-back empty or lagging";
      else message = `NS read-back missing: ${missingNs.join(", ")}`;
    }
    return {
      kind: "pending",
      outcome: "NAMESERVER_READBACK_PENDING",
      actual,
      missingNs,
      failure: message,
    };
  }
  return { kind: "ok", outcome: "NAMESERVERS_SET", actual, missingNs: [], failure: "" };
};
const readBackNameservers = async (domain) => {
  const ownership = await getOwnedDomain(domain);
  if (!ownership.owned) return { domain, owned: false, nameservers: [], unparseable: false, failure: "domain not owned" };
  const detail = ownership.detail || {};
  const rawNs = detail.nameservers !== undefined ? detail.nameservers : detail.nameServers;
  const parsed = normalizeNameserverList(rawNs);
  return {
    domain,
    owned: true,
    nameservers: parsed.nameservers,
    unparseable: parsed.unparseable,
    detail,
    failure: parsed.unparseable ? "NS read-back unparseable" : "",
  };
};
