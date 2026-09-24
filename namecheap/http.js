const NAMECHEAP_API_BASE_PROD = "https://api.namecheap.com/xml.response";
const NAMECHEAP_API_BASE_SANDBOX = "https://api.sandbox.namecheap.com/xml.response";
const CONNECTION_KEY = "namecheap";
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
const sleepMs = (ms) => {
  const wait = Math.max(0, Number(ms) || 0);
  if (wait > 0 && typeof Utilities !== "undefined" && Utilities.sleep) Utilities.sleep(wait);
};
const normalizeApiBase = (value) => {
  const text = asString(value).toLowerCase();
  if (!text || text === "prod" || text === "production") return NAMECHEAP_API_BASE_PROD;
  if (text === "sandbox") return NAMECHEAP_API_BASE_SANDBOX;
  if (text.includes("sandbox")) return NAMECHEAP_API_BASE_SANDBOX;
  if (text.startsWith("http://") || text.startsWith("https://")) return asString(value);
  return NAMECHEAP_API_BASE_PROD;
};
const redactSecrets = (text, apiKey) => {
  let out = asString(text);
  const key = asString(apiKey);
  if (key) out = out.split(key).join("[REDACTED]");
  out = out.replace(/([?&]ApiKey=)[^&]*/gi, "$1[REDACTED]");
  return out;
};
const attributeMap = (node) => {
  if (!node || typeof node !== "object") return {};
  const attrs = node["@_"] && typeof node["@_"] === "object" ? node["@_"] : {};
  const out = {};
  for (const [key, value] of Object.entries(attrs)) out[key] = asString(value);
  return out;
};
const asArray = (value) => {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
};
const textValue = (node) => {
  if (node === undefined || node === null) return "";
  if (typeof node === "string" || typeof node === "number" || typeof node === "boolean") return asString(node);
  if (typeof node === "object" && node["#text"] !== undefined) return asString(node["#text"]);
  return "";
};
const parseNamecheapXml = (xmlText) => {
  if (typeof XMLParser !== "function") {
    throw new Error("NAMECHEAP_XML_PARSER_MISSING: XMLParser global is required");
  }
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
    attributesGroupName: "@_",
    textNodeName: "#text",
    trimValues: true,
    allowBooleanAttributes: true,
  });
  const parsed = parser.parse(asString(xmlText) || "<ApiResponse Status=\"ERROR\"/>");
  return parsed && parsed.ApiResponse ? parsed.ApiResponse : parsed;
};
const extractErrors = (apiResponse) => {
  const errorsNode = apiResponse && apiResponse.Errors;
  if (!errorsNode) return [];
  const rows = asArray(errorsNode.Error);
  return rows.map((row) => {
    if (typeof row === "string") return { number: "", message: asString(row) };
    const attrs = attributeMap(row);
    return {
      number: asString(attrs.Number || attrs.number),
      message: asString(textValue(row) || attrs.Description || attrs.Message),
    };
  }).filter((row) => row.message || row.number);
};
const configValue = (key) => {
  const configuration = (ScriptContext && ScriptContext.configuration) || {};
  const value = configuration[key];
  return typeof value === "string" ? value.trim() : "";
};
const getNamecheapAuth = async () => {
  const apiUser = configValue("apiUser");
  const apiKey = asString(await ConnectionApp.getApiKey(CONNECTION_KEY));
  const userName = configValue("userName");
  const clientIp = configValue("clientIp");
  if (!apiUser || !apiKey || !userName || !clientIp) {
    throw new Error(
      "NAMECHEAP_AUTH_MISSING: connect the Namecheap API key and set apiUser, userName, and clientIp (whitelist ClientIp in Namecheap API Access)",
    );
  }
  return {
    apiUser,
    apiKey,
    userName,
    clientIp,
    apiBase: normalizeApiBase(configValue("apiBase") || "prod"),
  };
};
const namecheapRequest = async (command, params = {}, options = {}) => {
  const auth = await getNamecheapAuth();
  const method = asString(options.method || "GET").toUpperCase() === "POST" ? "POST" : "GET";
  const query = {
    ApiUser: auth.apiUser,
    ApiKey: auth.apiKey,
    UserName: auth.userName,
    ClientIp: auth.clientIp,
    Command: asString(command),
  };
  for (const [key, value] of Object.entries(params || {})) {
    if (value === undefined || value === null) continue;
    const text = asString(value);
    if (!text && text !== "0") continue;
    query[key] = text;
  }
  const encoded = Object.entries(query)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join("&");
  const url = method === "GET" ? `${auth.apiBase}?${encoded}` : auth.apiBase;
  const fetchOptions = {
    method,
    headers: { Accept: "application/xml, text/xml, */*" },
  };
  if (method === "POST") {
    fetchOptions.headers["Content-Type"] = "application/x-www-form-urlencoded";
    fetchOptions.payload = encoded;
  }
  const response = await UrlFetchApp.fetch(url, fetchOptions);
  const status = response.getResponseCode();
  const text = response.getContentText();
  const safeText = redactSecrets(text, auth.apiKey);
  if (status < 200 || status >= 300) {
    throw new Error(`NAMECHEAP_REQUEST_FAILED (${status}): ${safeText}`);
  }
  let apiResponse;
  try {
    apiResponse = parseNamecheapXml(text);
  } catch (error) {
    throw new Error(`NAMECHEAP_XML_PARSE_FAILED: ${asString(error && error.message) || "invalid XML"}`);
  }
  const apiStatus = asString(attributeMap(apiResponse).Status || apiResponse.Status).toUpperCase();
  const errors = extractErrors(apiResponse);
  if (apiStatus !== "OK") {
    const detail = errors.map((row) => `${row.number ? `${row.number}: ` : ""}${row.message}`).join("; ") || safeText;
    const err = new Error(`NAMECHEAP_API_ERROR: ${detail}`);
    err.status = apiStatus || "ERROR";
    err.errors = errors;
    throw err;
  }
  return {
    status: apiStatus,
    command: asString(apiResponse.RequestedCommand || command),
    commandResponse: apiResponse.CommandResponse || {},
    errors,
    warnings: apiResponse.Warnings || {},
    raw: apiResponse,
  };
};
const CONTACT_ROLES = ["Registrant", "Tech", "Admin", "AuxBilling"];
const CONTACT_REQUIRED_FIELDS = [
  "FirstName",
  "LastName",
  "Address1",
  "City",
  "StateProvince",
  "PostalCode",
  "Country",
  "Phone",
  "EmailAddress",
];
const CONTACT_OPTIONAL_FIELDS = [
  "OrganizationName",
  "JobTitle",
  "Address2",
  "StateProvinceChoice",
  "PhoneExt",
  "Fax",
];
const normalizeContactPerson = (value) => {
  if (!value || typeof value !== "object") return {};
  const aliases = {
    firstName: "FirstName",
    first_name: "FirstName",
    lastName: "LastName",
    last_name: "LastName",
    address1: "Address1",
    address_1: "Address1",
    address2: "Address2",
    address_2: "Address2",
    city: "City",
    stateProvince: "StateProvince",
    state: "StateProvince",
    province: "StateProvince",
    state_province: "StateProvince",
    stateProvinceChoice: "StateProvinceChoice",
    postalCode: "PostalCode",
    postal_code: "PostalCode",
    zip: "PostalCode",
    country: "Country",
    phone: "Phone",
    phoneExt: "PhoneExt",
    fax: "Fax",
    emailAddress: "EmailAddress",
    email: "EmailAddress",
    organizationName: "OrganizationName",
    organization: "OrganizationName",
    org: "OrganizationName",
    jobTitle: "JobTitle",
  };
  const out = {};
  for (const [key, raw] of Object.entries(value)) {
    const canon = aliases[key] || key;
    if ([...CONTACT_REQUIRED_FIELDS, ...CONTACT_OPTIONAL_FIELDS].includes(canon)) {
      out[canon] = asString(raw);
    }
  }
  return out;
};
const validateContactsForCreate = (contactsInput) => {
  const source = contactsInput && typeof contactsInput === "object" ? contactsInput : {};
  const shared =
    normalizeContactPerson(source.contact || source.default || source.registrant || source.Registrant);
  const byRole = {
    Registrant: Object.keys(normalizeContactPerson(source.registrant || source.Registrant)).length
      ? normalizeContactPerson(source.registrant || source.Registrant)
      : shared,
    Tech: Object.keys(normalizeContactPerson(source.tech || source.Tech)).length
      ? normalizeContactPerson(source.tech || source.Tech)
      : shared,
    Admin: Object.keys(normalizeContactPerson(source.admin || source.Admin)).length
      ? normalizeContactPerson(source.admin || source.Admin)
      : shared,
    AuxBilling: Object.keys(normalizeContactPerson(source.auxBilling || source.AuxBilling || source.billing)).length
      ? normalizeContactPerson(source.auxBilling || source.AuxBilling || source.billing)
      : shared,
  };
  for (const role of CONTACT_ROLES) {
    const flatPrefix = `${role}`;
    for (const field of [...CONTACT_REQUIRED_FIELDS, ...CONTACT_OPTIONAL_FIELDS]) {
      const flatKey = `${flatPrefix}${field}`;
      if (source[flatKey] !== undefined && source[flatKey] !== null && asString(source[flatKey])) {
        byRole[role][field] = asString(source[flatKey]);
      }
    }
  }
  const missing = [];
  for (const role of CONTACT_ROLES) {
    for (const field of CONTACT_REQUIRED_FIELDS) {
      if (!asString(byRole[role][field])) missing.push(`${role}${field}`);
    }
    const phone = asString(byRole[role].Phone);
    if (phone && !/^\+\d+\.\d+$/.test(phone)) {
      missing.push(`${role}Phone(format:+NNN.NNNNNNNNNN)`);
    }
  }
  if (missing.length) {
    return {
      ok: false,
      params: {},
      failure: `contacts missing/invalid for domains.create: ${missing.join(", ")}`,
    };
  }
  const params = {};
  for (const role of CONTACT_ROLES) {
    for (const field of [...CONTACT_REQUIRED_FIELDS, ...CONTACT_OPTIONAL_FIELDS]) {
      const value = asString(byRole[role][field]);
      if (value) params[`${role}${field}`] = value;
    }
  }
  const years = asNumber(source.years || source.Years, 1);
  params.Years = String(Math.max(1, years || 1));
  const addFreeWhoisguard = asString(source.addFreeWhoisguard || source.AddFreeWhoisguard || "yes") || "yes";
  const wgEnabled = asString(source.wgEnabled || source.WGEnabled || "yes") || "yes";
  params.AddFreeWhoisguard = addFreeWhoisguard;
  params.WGEnabled = wgEnabled;
  return { ok: true, params, failure: "" };
};
let tldListCache = null;
const loadTldNames = async () => {
  if (Array.isArray(tldListCache) && tldListCache.length) return tldListCache;
  const response = await namecheapRequest("namecheap.domains.getTldList", {});
  const tldsNode = response.commandResponse && response.commandResponse.Tlds;
  const rows = asArray(tldsNode && tldsNode.Tld);
  const names = rows
    .map((row) => asString(attributeMap(row).Name || textValue(row)).toLowerCase())
    .filter(Boolean);
  tldListCache = [...new Set(names)].sort((a, b) => b.length - a.length);
  return tldListCache;
};
/**
 * Resolve SLD/TLD without naive last-label splits for multi-part TLDs (e.g. co.uk).
 * Prefer explicit sld/tld, then owned metadata, then longest match against getTldList.
 */
const resolveSldTld = async (domainOrParts) => {
  const req = domainOrParts && typeof domainOrParts === "object" ? domainOrParts : { domain: domainOrParts };
  const explicitSld = asString(req.sld || req.SLD);
  const explicitTld = asString(req.tld || req.TLD);
  if (explicitSld && explicitTld) {
    return { ok: true, domain: `${explicitSld}.${explicitTld}`.toLowerCase(), sld: explicitSld, tld: explicitTld, source: "explicit" };
  }
  const domain = asString(req.domain || req.name || req.DomainName || req.Domain).toLowerCase().replace(/\.$/, "");
  if (!domain || !domain.includes(".")) {
    return { ok: false, domain, sld: "", tld: "", failure: "domain or explicit sld/tld required", source: "" };
  }
  const metaSld = asString(req.metaSld || (req.detail && (req.detail.sld || req.detail.SLD)));
  const metaTld = asString(req.metaTld || (req.detail && (req.detail.tld || req.detail.TLD)));
  if (metaSld && metaTld) {
    return { ok: true, domain, sld: metaSld, tld: metaTld, source: "owned_metadata" };
  }
  const tlds = await loadTldNames();
  for (const tld of tlds) {
    if (domain === tld || !domain.endsWith(`.${tld}`)) continue;
    const sld = domain.slice(0, -(tld.length + 1));
    if (sld && !sld.includes(".")) {
      return { ok: true, domain, sld, tld, source: "getTldList" };
    }
  }
  const labels = domain.split(".").filter(Boolean);
  if (labels.length === 2) {
    return { ok: true, domain, sld: labels[0], tld: labels[1], source: "two_label" };
  }
  return {
    ok: false,
    domain,
    sld: "",
    tld: "",
    failure: `Unable to resolve SLD/TLD for ${domain}; pass explicit sld/tld (multi-part public suffix)`,
    source: "",
  };
};
const ownedSetFromList = async () => {
  const listed = await listDomains({});
  const set = new Set((listed.domains || []).map((row) => asString(row.domain).toLowerCase()).filter(Boolean));
  return { set, domains: listed.domains || [] };
};
const getDomainInfo = async (domain) => {
  const name = asString(domain).toLowerCase();
  if (!name) return { owned: false, domain: "", detail: null, nameservers: [], failure: "domain required" };
  try {
    const response = await namecheapRequest("namecheap.domains.getInfo", { DomainName: name });
    const result = response.commandResponse && response.commandResponse.DomainGetInfoResult;
    const attrs = attributeMap(result);
    const domainName = asString(attrs.DomainName || name).toLowerCase();
    const dns = result && result.DnsDetails ? result.DnsDetails : {};
    const nameservers = asArray(dns.Nameserver || dns.NameServer)
      .map((row) => asString(textValue(row) || row))
      .filter(Boolean);
    return {
      owned: true,
      domain: domainName,
      detail: {
        id: asString(attrs.ID),
        status: asString(attrs.Status),
        ownerName: asString(attrs.OwnerName),
        isOwner: asBoolean(attrs.IsOwner, true),
        isPremium: asBoolean(attrs.IsPremium, false),
        nameservers,
        dnsDetails: attributeMap(dns),
      },
      nameservers,
      failure: "",
    };
  } catch (error) {
    const message = asString(error && error.message);
    if (/Domain not found|not associated|2019166|2016166/i.test(message)) {
      return { owned: false, domain: name, detail: null, nameservers: [], failure: message };
    }
    throw error;
  }
};
const loadRegisterPricingByTld = async () => {
  try {
    const response = await namecheapRequest("namecheap.users.getPricing", {
      ProductType: "DOMAIN",
      ActionName: "REGISTER",
    });
    const productType = response.commandResponse &&
      response.commandResponse.UserGetPricingResult &&
      response.commandResponse.UserGetPricingResult.ProductType;
    const categories = asArray(productType && productType.ProductCategory);
    const registerCategory = categories.find((row) => asString(attributeMap(row).Name).toUpperCase() === "REGISTER") || categories[0];
    const products = asArray(registerCategory && registerCategory.Product);
    const map = {};
    for (const product of products) {
      const tld = asString(attributeMap(product).Name).toLowerCase();
      if (!tld) continue;
      const prices = asArray(product.Price);
      let chosen = null;
      for (const price of prices) {
        const attrs = attributeMap(price);
        const duration = asNumber(attrs.Duration, 0);
        const durationType = asString(attrs.DurationType).toUpperCase();
        if (duration === 1 && (durationType === "YEAR" || !durationType)) {
          chosen = asNumber(attrs.Price || attrs.YourPrice || attrs.RegularPrice, null);
          break;
        }
      }
      if (chosen === null && prices.length) {
        const attrs = attributeMap(prices[0]);
        chosen = asNumber(attrs.Price || attrs.YourPrice || attrs.RegularPrice, null);
      }
      if (chosen !== null) map[tld] = chosen;
    }
    return map;
  } catch (_error) {
    return {};
  }
};
const extractCreatePrice = (attrs) => {
  const charged = asNumber(attrs.ChargedAmount, null);
  return charged;
};
const isPermanentNameserverApiError = (errorOrFailure) => {
  const message = asString(typeof errorOrFailure === "string" ? errorOrFailure : errorOrFailure && errorOrFailure.message);
  if (!message) return false;
  if (/AUTH_MISSING|UNAUTHORIZED|FORBIDDEN|invalid credentials|API key|ApiKey|not whitelisted|IP.*whitelist/i.test(message)) {
    return true;
  }
  const status = Number(typeof errorOrFailure === "object" && errorOrFailure ? errorOrFailure.status : NaN);
  if (status === 400 || status === 401 || status === 403 || status === 422) return true;
  if (/NAMECHEAP_API_ERROR/i.test(message) && !/timeout|temporar|rate|busy|try again/i.test(message)) return true;
  if (/Domain not found|not associated|2019166|2016166|not owned/i.test(message)) return true;
  return false;
};
const normalizeNameserverList = (value) => {
  if (value === undefined || value === null) return { nameservers: [], unparseable: false };
  if (Array.isArray(value)) {
    return { nameservers: value.map((row) => asString(textValue(row) || row)).filter(Boolean), unparseable: false };
  }
  if (typeof value === "string" || typeof value === "number") {
    return { nameservers: asCsvList(value), unparseable: false };
  }
  return { nameservers: [], unparseable: true };
};
const evaluateNameserverReadBack = (readBack, expectedNameservers) => {
  const expected = expectedNameservers.map((ns) => asString(ns).toLowerCase()).filter(Boolean);
  const actual = asArray(readBack && readBack.nameservers).map((ns) => asString(ns).toLowerCase()).filter(Boolean);
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
const readBackNameservers = async (domain, sld, tld) => {
  const split = sld && tld ? { ok: true, sld, tld, domain } : await resolveSldTld({ domain, sld, tld });
  if (!split.ok) return { domain, owned: false, nameservers: [], unparseable: false, failure: split.failure };
  try {
    const response = await namecheapRequest("namecheap.domains.dns.getList", {
      SLD: split.sld,
      TLD: split.tld,
    });
    const result = response.commandResponse && response.commandResponse.DomainDNSGetListResult;
    const parsed = normalizeNameserverList(result && (result.Nameserver || result.NameServer));
    return {
      domain: asString(attributeMap(result).Domain || domain).toLowerCase(),
      owned: true,
      nameservers: parsed.nameservers,
      unparseable: parsed.unparseable,
      isUsingOurDns: asBoolean(attributeMap(result).IsUsingOurDNS, false),
      failure: parsed.unparseable ? "NS read-back unparseable" : "",
    };
  } catch (error) {
    const info = await getDomainInfo(domain);
    if (info.owned && info.nameservers.length) {
      return { domain, owned: true, nameservers: info.nameservers, unparseable: false, failure: "" };
    }
    return {
      domain,
      owned: info.owned,
      nameservers: [],
      unparseable: false,
      failure: asString(error && error.message) || "dns.getList failed",
    };
  }
};
