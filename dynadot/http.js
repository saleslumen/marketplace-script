const DYNADOT_API_BASE_PROD = "https://api.dynadot.com";
const DYNADOT_API_BASE_SANDBOX = "https://api-sandbox.dynadot.com";
const DYNADOT_CONNECTION_KEY = "dynadot";
const DYNADOT_SECRET_CONNECTION_KEY = "dynadotSecret";
const SECRET_FIELD_KEYS = new Set(["apikey", "apisecret", "authorization", "x-signature", "x_signature"]);
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
const asVendorYes = (value) => {
  if (value === true) return true;
  const text = asString(value).toLowerCase();
  return text === "yes" || text === "true" || text === "1";
};
const normalizeApiBase = (value) => {
  const text = asString(value);
  const lower = text.toLowerCase();
  if (lower === "sandbox") return DYNADOT_API_BASE_SANDBOX;
  if ((lower.startsWith("http://") || lower.startsWith("https://")) && lower.includes("sandbox")) {
    return DYNADOT_API_BASE_SANDBOX;
  }
  return DYNADOT_API_BASE_PROD;
};
const buildQuery = (params) => {
  const parts = [];
  Object.keys(params || {}).forEach((key) => {
    const value = params[key];
    if (value === undefined || value === null || value === "") return;
    if (Array.isArray(value)) {
      const joined = value.map(asString).filter(Boolean).join(",");
      if (joined) parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(joined)}`);
      return;
    }
    if (typeof value === "boolean") {
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value ? "true" : "false")}`);
      return;
    }
    parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(asString(value))}`);
  });
  return parts.length ? `?${parts.join("&")}` : "";
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
  out = out.replace(/([?&]key=)[^&]*/gi, "$1[REDACTED]");
  return out;
};
const stripSecrets = (value) => {
  if (Array.isArray(value)) return value.map(stripSecrets);
  if (!value || typeof value !== "object") return value;
  const out = {};
  Object.keys(value).forEach((key) => {
    if (SECRET_FIELD_KEYS.has(String(key).toLowerCase())) return;
    out[key] = stripSecrets(value[key]);
  });
  return out;
};
const vendorCode = (body) => {
  if (!body || typeof body !== "object") return 0;
  return Number(body.code !== undefined ? body.code : body.Code) || 0;
};
const vendorMessage = (body, text) => {
  if (body && typeof body === "object") {
    const error = body.error || body.Error;
    const description = error && typeof error === "object" ? asString(error.description || error.Description) : asString(error);
    const message = asString(body.message || body.Message || description);
    if (message) return message;
  }
  return asString(text);
};
const vendorPayload = (body) => {
  if (!body || typeof body !== "object") return body;
  if (Object.prototype.hasOwnProperty.call(body, "data")) return body.data;
  if (Object.prototype.hasOwnProperty.call(body, "Data")) return body.Data;
  const out = { ...body };
  delete out.ok;
  delete out.outcome;
  return out;
};
const isRetryableStatus = (status) => {
  const code = Number(status) || 0;
  return code === 429 || code >= 500 || code === 0;
};
const configValue = (key) => {
  const configuration = (ScriptContext && ScriptContext.configuration) || {};
  const value = configuration[key];
  return typeof value === "string" ? value.trim() : "";
};
const getDynadotAuth = async () => {
  const apiKey = asString(await ConnectionApp.getApiKey(DYNADOT_CONNECTION_KEY));
  const apiSecret = asString(await ConnectionApp.getApiKey(DYNADOT_SECRET_CONNECTION_KEY));
  if (!apiKey || !apiSecret) {
    throw new Error("DYNADOT_AUTH_MISSING: connect the Dynadot API key and signing secret");
  }
  return { apiKey, apiSecret, apiBase: normalizeApiBase(configValue("apiBase") || "prod") };
};
const classifyHttp = (raw, secrets) => {
  const status = Number(raw && raw.status) || 0;
  const body = raw && raw.body && typeof raw.body === "object" ? raw.body : {};
  const text = redactSecrets(asString(raw && raw.text), secrets);
  const message = redactSecrets(vendorMessage(body, text), secrets);
  return {
    status,
    body,
    text,
    message,
    retryable: isRetryableStatus(status) || vendorCode(body) === 429,
    secrets,
  };
};
const classifiedResult = (classified, successOutcome, failOutcome) => {
  const status = classified.status;
  const body = classified.body && typeof classified.body === "object" ? classified.body : {};
  const vendorStatus = vendorCode(body) || status;
  const data = stripSecrets(vendorPayload(body));
  const failure = classified.message || `DYNADOT_REQUEST_FAILED (${status})`;
  if (status === 401 || vendorStatus === 401) {
    return { ok: false, outcome: "UNAUTHORIZED", retryable: false, failure, status: status || vendorStatus };
  }
  if (status === 429 || vendorStatus === 429 || classified.retryable) {
    return { ok: false, outcome: "RATE_LIMITED", retryable: true, failure: classified.message || "Dynadot rate limited", status: status || vendorStatus };
  }
  if (status < 200 || status >= 300 || vendorStatus >= 400) {
    return { ok: false, outcome: failOutcome, retryable: classified.retryable, failure, status };
  }
  return { ok: true, outcome: successOutcome, retryable: false, failure: "", status, data };
};
const parseResponseText = (text) => {
  if (!asString(text)) return {};
  try {
    return JSON.parse(text);
  } catch (_error) {
    return { raw: text };
  }
};
const dynadotRequestRaw = async (path, method = "GET", body) => {
  const auth = await getDynadotAuth();
  const verb = asString(method).toUpperCase() || "GET";
  let requestPath = asString(path).startsWith("/") ? asString(path) : `/${asString(path)}`;
  let payloadText = "";
  const headers = { Accept: "application/json", Authorization: `Bearer ${auth.apiKey}` };
  const options = { method: verb, headers, muteHttpExceptions: true };
  if (verb === "GET") {
    if (body && typeof body === "object") requestPath = `${requestPath}${buildQuery(body)}`;
  } else if (body !== undefined) {
    payloadText = typeof body === "string" ? body : JSON.stringify(body);
    headers["Content-Type"] = "application/json";
    options.payload = payloadText;
  }
  const fullPathAndQuery = `/restful/v2${requestPath}`;
  const xRequestId = nextRequestId();
  headers["X-Request-ID"] = xRequestId;
  headers["X-Signature"] = createSignature(auth.apiKey, auth.apiSecret, fullPathAndQuery, xRequestId, payloadText);
  const secrets = { apiKey: auth.apiKey, apiSecret: auth.apiSecret, authorization: `Bearer ${auth.apiKey}`, signature: headers["X-Signature"] };
  const response = await UrlFetchApp.fetch(`${auth.apiBase}${fullPathAndQuery}`, options);
  const status = response.getResponseCode();
  const text = response.getContentText();
  return {
    status,
    body: parseResponseText(text),
    text: redactSecrets(text, secrets),
    fullPathAndQuery,
    xRequestId,
    secrets,
  };
};
const dynadotApi3Raw = async (command, params) => {
  const auth = await getDynadotAuth();
  const query = { key: auth.apiKey, command: asString(command), ...(params && typeof params === "object" ? params : {}) };
  const fullPathAndQuery = `/api3.json${buildQuery(query)}`;
  const secrets = { apiKey: auth.apiKey, apiSecret: auth.apiSecret };
  const response = await UrlFetchApp.fetch(`${auth.apiBase}${fullPathAndQuery}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    muteHttpExceptions: true,
  });
  const status = response.getResponseCode();
  const text = response.getContentText();
  return {
    status,
    body: parseResponseText(text),
    text: redactSecrets(text, secrets),
    fullPathAndQuery: redactSecrets(fullPathAndQuery, secrets),
    secrets,
  };
};
const api3Envelope = (body) => {
  if (!body || typeof body !== "object") {
    return { header: {}, code: undefined, status: "", error: "", data: body };
  }
  const wrapper = Object.keys(body).find((key) => /Response$/i.test(key)) || "";
  const header = wrapper && body[wrapper] && typeof body[wrapper] === "object" ? body[wrapper] : body;
  const codeRaw = header.ResponseCode !== undefined ? header.ResponseCode : header.SuccessCode;
  const code = codeRaw === undefined || codeRaw === null || codeRaw === "" ? undefined : Number(codeRaw);
  const status = asString(header.Status);
  const error = asString(header.Error || header.Status);
  const data = stripSecrets({ ...header });
  delete data.ok;
  delete data.outcome;
  return { header, code, status, error, data };
};
const classifiedApi3 = (raw, successOutcome, failOutcome) => {
  const classified = classifyHttp(raw, raw.secrets);
  const status = classified.status;
  const failure = classified.message || `DYNADOT_REQUEST_FAILED (${status})`;
  if (status === 401) {
    return { ok: false, outcome: "UNAUTHORIZED", retryable: false, failure, status };
  }
  if (status === 429) {
    return { ok: false, outcome: "RATE_LIMITED", retryable: true, failure: classified.message || "Dynadot rate limited", status };
  }
  if (status < 200 || status >= 300) {
    return { ok: false, outcome: status >= 500 ? "RATE_LIMITED" : failOutcome, retryable: isRetryableStatus(status), failure, status };
  }
  const parsed = api3Envelope(classified.body);
  if (parsed.code === 0 || (parsed.code === undefined && /^success$/i.test(parsed.status))) {
    return { ok: true, outcome: successOutcome, retryable: false, failure: "", status, data: parsed.data };
  }
  return {
    ok: false,
    outcome: failOutcome,
    retryable: false,
    failure: redactSecrets(parsed.error || failure, raw.secrets),
    status,
    data: parsed.data,
    api3Code: parsed.code,
    api3Status: parsed.status,
  };
};
const isNotOwnedApi3 = (classified) => {
  if (!classified || classified.ok) return false;
  if (classified.outcome === "UNAUTHORIZED" || classified.outcome === "RATE_LIMITED") return false;
  const text = `${classified.failure || ""} ${classified.api3Status || ""}`.toLowerCase();
  return /not in your account|not found|does not exist|no such domain|unknown domain|isn't in your account|is not in your account/.test(text);
};
const firstDefined = (objects, key) => {
  for (const row of objects) {
    if (!row || typeof row !== "object") continue;
    if (row[key] !== undefined && row[key] !== null && row[key] !== "") return row[key];
  }
  return undefined;
};
const contactIdParam = (sources, ...keys) => {
  for (const key of keys) {
    const value = firstDefined(sources, key);
    if (value === undefined || value === null || value === "") continue;
    if (typeof value === "object") continue;
    return asString(value);
  }
  return "";
};
const collectRegisterInput = (input) => {
  const req = input && typeof input === "object" ? input : {};
  const contacts = req.contacts && typeof req.contacts === "object" && !Array.isArray(req.contacts) ? req.contacts : {};
  const sources = [req, contacts];
  const params = {};
  params.duration = Math.max(1, asNumber(firstDefined(sources, "duration"), 1) || 1);
  const currency = asString(firstDefined(sources, "currency"));
  if (currency) params.currency = currency;
  const coupon = asString(firstDefined(sources, "coupon") || firstDefined(sources, "coupon_code"));
  if (coupon) params.coupon = coupon;
  const language = asString(firstDefined(sources, "language"));
  if (language) params.language = language;
  if (asBoolean(firstDefined(sources, "premium"), false) || asBoolean(firstDefined(sources, "register_premium"), false)) {
    params.premium = 1;
  }
  const option0 = asString(firstDefined(sources, "option0"));
  if (option0) params.option0 = option0;
  const option1 = asString(firstDefined(sources, "option1"));
  if (option1) params.option1 = option1;
  const registrant = contactIdParam(sources, "registrant_contact", "registrant_contact_id");
  if (registrant) params.registrant_contact = registrant;
  const admin = contactIdParam(sources, "admin_contact", "admin_contact_id");
  if (admin) params.admin_contact = admin;
  const technical = contactIdParam(sources, "technical_contact", "tech_contact", "tech_contact_id");
  if (technical) params.technical_contact = technical;
  const billing = contactIdParam(sources, "billing_contact", "billing_contact_id");
  if (billing) params.billing_contact = billing;
  return params;
};
const extractDomainPrice = (row) => {
  if (!row || typeof row !== "object") return null;
  const candidates = [row.price, row.registration_price, row.registrationPrice, row.register_price, row.amount, row.cost];
  const prices = Array.isArray(row.price_list) ? row.price_list : Array.isArray(row.priceList) ? row.priceList : [];
  prices.forEach((item) => {
    if (item && typeof item === "object") candidates.push(item.registration_price, item.registrationPrice, item.price);
  });
  for (const candidate of candidates) {
    if (typeof candidate === "string") {
      const matched = candidate.match(/-?\d+(?:\.\d+)?/);
      if (matched) {
        const number = Number(matched[0]);
        if (Number.isFinite(number) && number >= 0) return number;
      }
    }
    const number = Number(candidate);
    if (Number.isFinite(number) && number >= 0) return number;
  }
  return null;
};
const nameserverNames = (value) => {
  if (value === undefined || value === null) return { nameservers: [], unparseable: false };
  if (Array.isArray(value)) {
    const names = value.map((row) => {
      if (typeof row === "string" || typeof row === "number") return asString(row);
      if (row && typeof row === "object") return asString(row.Host || row.host || row.server_name || row.serverName || row.nameserver || row.name);
      return "";
    }).filter(Boolean);
    return { nameservers: names, unparseable: false };
  }
  if (typeof value === "string" || typeof value === "number") {
    return { nameservers: asCsvList(value), unparseable: false };
  }
  if (typeof value === "object") {
    const names = [];
    Object.keys(value).sort().forEach((key) => {
      if (/^Host\d*$/i.test(key) || /^ns\d+$/i.test(key)) names.push(asString(value[key]));
    });
    if (names.filter(Boolean).length) return { nameservers: names.filter(Boolean), unparseable: false };
    if (!Object.keys(value).length) return { nameservers: [], unparseable: false };
    return { nameservers: [], unparseable: true };
  }
  return { nameservers: [], unparseable: true };
};
const setNsParams = (domain, nameservers) => {
  const params = { domain: asString(domain).toLowerCase() };
  nameservers.slice(0, 13).forEach((ns, index) => {
    params[`ns${index}`] = asString(ns);
  });
  return params;
};
const uniqueHostnames = (nameservers) => {
  const seen = new Set();
  const out = [];
  asCsvList(nameservers).forEach((ns) => {
    const host = asString(ns).toLowerCase();
    if (!host || seen.has(host)) return;
    seen.add(host);
    out.push(host);
  });
  return out;
};
const serverListHosts = (data) => {
  if (!data || typeof data !== "object") return [];
  const rows = Array.isArray(data.ServerList)
    ? data.ServerList
    : Array.isArray(data.serverList)
      ? data.serverList
      : [];
  const nested = data.NameServerList || data.nameServerList;
  const nestedList = nested && (nested.List || nested.list);
  const nestedServers = nestedList && (nestedList.Server || nestedList.server);
  const extra = Array.isArray(nestedServers) ? nestedServers : nestedServers ? [nestedServers] : [];
  const names = [];
  rows.concat(extra).forEach((row) => {
    if (typeof row === "string" || typeof row === "number") {
      const host = asString(row).toLowerCase();
      if (host) names.push(host);
      return;
    }
    if (!row || typeof row !== "object") return;
    const host = asString(row.ServerName || row.serverName || row.Host || row.host || row.Name || row.name).toLowerCase();
    if (host) names.push(host);
  });
  return names;
};
const isAlreadyPresentNsError = (failure) => {
  const text = asString(failure).toLowerCase();
  if (!text) return false;
  if (/does not exist|doesn't exist|not exist|not found|not in your account/.test(text) && !/already/.test(text)) return false;
  return /already (exist|present|added|in)|duplicate/.test(text);
};
const searchOneDomain = async (domain) => {
  const name = asString(domain).toLowerCase();
  const raw = await dynadotRequestRaw(`/domains/${encodeURIComponent(name)}/search`, "GET");
  const classified = classifiedResult(classifyHttp(raw, raw.secrets), "AVAILABLE", "AVAILABILITY_FAILED");
  if (!classified.ok) return { classified, row: null };
  const data = classified.data && typeof classified.data === "object" ? classified.data : {};
  const row = {
    domain: asString(data.domain_name || data.domainName || name).toLowerCase(),
    available: asVendorYes(data.available),
    premium: asVendorYes(data.premium),
    price: extractDomainPrice(data),
    raw: data,
  };
  return { classified, row };
};
const listDomainRows = (data) => {
  if (!data || typeof data !== "object") return [];
  if (Array.isArray(data.MainDomains)) return data.MainDomains;
  if (Array.isArray(data.mainDomains)) return data.mainDomains;
  const list = data.DomainInfoList || data.domainInfoList;
  if (Array.isArray(list)) return list;
  if (list && Array.isArray(list.DomainInfo)) return list.DomainInfo;
  if (list && Array.isArray(list.Domain)) return list.Domain;
  return [];
};
const domainRowName = (row) => {
  if (!row || typeof row !== "object") return "";
  const nested = row.Domain && typeof row.Domain === "object" ? row.Domain : row;
  return asString(nested.Name || nested.name || nested.domain_name || nested.domainName || nested.domain).toLowerCase();
};
const getOwnedDomain = async (domain) => {
  const name = asString(domain).toLowerCase();
  if (!name) return { owned: false, domain: "", detail: null, failure: "domain required" };
  const raw = await dynadotApi3Raw("domain_info", { domain: name });
  const classified = classifiedApi3(raw, "DOMAIN", "DOMAIN_FAILED");
  if (classified.ok) {
    const data = classified.data && typeof classified.data === "object" ? classified.data : {};
    const info = data.DomainInfo && typeof data.DomainInfo === "object" ? data.DomainInfo : data;
    const domainName = asString(info.Name || info.name || name).toLowerCase();
    return { owned: true, domain: domainName || name, detail: info, failure: "" };
  }
  if (isNotOwnedApi3(classified)) {
    return { owned: false, domain: name, detail: null, failure: classified.failure || "domain not in account" };
  }
  const error = new Error(classified.failure || `DYNADOT_REQUEST_FAILED (${classified.status})`);
  error.status = classified.status;
  error.outcome = classified.outcome;
  error.retryable = classified.retryable;
  throw error;
};
const isPermanentNameserverApiError = (errorOrFailure) => {
  const message = asString(typeof errorOrFailure === "string" ? errorOrFailure : errorOrFailure && errorOrFailure.message);
  if (!message) return false;
  if (/AUTH_MISSING|UNAUTHORIZED|FORBIDDEN|invalid credentials|API key|ApiKey/i.test(message)) return true;
  const status = Number(typeof errorOrFailure === "object" && errorOrFailure ? errorOrFailure.status : NaN);
  if (status === 400 || status === 401 || status === 403 || status === 422) return true;
  if (/\((\s*)(400|401|403|422)(\s*)\)/.test(message)) return true;
  if (/not owned|Domain not found|Can not find|must already be in your account|does not exist in your account/i.test(message)) return true;
  return false;
};
const evaluateNameserverReadBack = (readBack, expectedNameservers) => {
  const expected = expectedNameservers.map((ns) => asString(ns).toLowerCase()).filter(Boolean);
  const actual = Array.isArray(readBack && readBack.nameservers)
    ? readBack.nameservers.map((ns) => asString(ns).toLowerCase()).filter(Boolean)
    : [];
  const missingNs = expected.filter((ns) => !actual.includes(ns));
  const failure = asString(readBack && readBack.failure);
  if (!readBack) {
    return { kind: "pending", outcome: "NAMESERVER_READBACK_PENDING", actual: [], missingNs: expected, failure: "NS read-back empty or unparseable" };
  }
  if (readBack.owned === false || isPermanentNameserverApiError(failure)) {
    return { kind: "failed", outcome: "NAMESERVER_FAILED", actual, missingNs, failure: failure || "domain not owned" };
  }
  if (readBack.unparseable || !actual.length || missingNs.length) {
    let message = failure;
    if (!message) {
      if (readBack.unparseable) message = "NS read-back unparseable";
      else if (!actual.length) message = "NS read-back empty or lagging";
      else message = `NS read-back missing: ${missingNs.join(", ")}`;
    }
    return { kind: "pending", outcome: "NAMESERVER_READBACK_PENDING", actual, missingNs, failure: message };
  }
  return { kind: "ok", outcome: "NAMESERVERS_SET", actual, missingNs: [], failure: "" };
};
const readBackNameservers = async (domain) => {
  const raw = await dynadotApi3Raw("get_ns", { domain });
  const classified = classifiedApi3(raw, "NAMESERVERS", "NAMESERVER_FAILED");
  if (!classified.ok) {
    const error = new Error(classified.failure || "NS read-back failed");
    error.status = classified.status;
    error.outcome = classified.outcome;
    error.retryable = classified.retryable;
    throw error;
  }
  const data = classified.data && typeof classified.data === "object" ? classified.data : {};
  const parsed = nameserverNames(data.NsContent || data.nsContent || data.Host || data);
  return {
    domain,
    owned: true,
    nameservers: parsed.nameservers,
    unparseable: parsed.unparseable,
    detail: data,
    failure: parsed.unparseable ? "NS read-back unparseable" : "",
  };
};
const ensureAccountNameservers = async (nameservers) => {
  const wanted = uniqueHostnames(nameservers);
  const inAccount = new Set();
  const listRaw = await dynadotApi3Raw("server_list");
  const listed = classifiedApi3(listRaw, "SERVER_LIST", "SERVER_LIST_FAILED");
  if (listed.outcome === "UNAUTHORIZED") {
    return { ok: false, outcome: "UNAUTHORIZED", retryable: false, failure: listed.failure, status: listed.status };
  }
  if (listed.ok) {
    serverListHosts(listed.data).forEach((host) => inAccount.add(host));
  } else if (listed.retryable) {
    return { ok: false, outcome: listed.outcome, retryable: true, failure: listed.failure, status: listed.status };
  }
  for (const host of wanted) {
    if (inAccount.has(host)) continue;
    const raw = await dynadotApi3Raw("add_ns", { host });
    const classified = classifiedApi3(raw, "NS_ADDED", "ADD_NS_FAILED");
    if (classified.ok || isAlreadyPresentNsError(classified.failure)) {
      inAccount.add(host);
      continue;
    }
    return {
      ok: false,
      outcome: classified.outcome === "UNAUTHORIZED" ? "UNAUTHORIZED" : classified.outcome,
      retryable: classified.retryable,
      failure: classified.failure,
      status: classified.status,
    };
  }
  return { ok: true, outcome: "NS_IN_ACCOUNT", failure: "", inAccount: [...inAccount] };
};
