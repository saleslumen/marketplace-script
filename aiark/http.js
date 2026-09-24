const AIARK_API_BASE = "https://api.ai-ark.com/api/developer-portal";
const CONNECTION_KEY = "aiark";
const asString = (value) => (value === undefined || value === null ? "" : String(value).trim());
const asCsvList = (value) => {
  if (Array.isArray(value)) return value.map(asString).filter(Boolean);
  const text = asString(value);
  if (!text) return [];
  if (text.startsWith("[")) {
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) return parsed.map(asString).filter(Boolean);
    } catch (_error) {
      return text.split(",").map((item) => item.trim()).filter(Boolean);
    }
  }
  return text.split(",").map((item) => item.trim()).filter(Boolean);
};
const asNumber = (value, fallback) => {
  const text = asString(value);
  if (!text) return fallback;
  const number = Number(text);
  return Number.isFinite(number) ? number : fallback;
};
const isRetryableStatus = (status) => {
  const code = Number(status) || 0;
  return code === 429 || code >= 500 || code === 0;
};
const getAiArkApiKey = async () => ConnectionApp.getApiKey(CONNECTION_KEY);
const buildQuery = (params) => {
  const parts = [];
  Object.keys(params || {}).forEach((key) => {
    const value = params[key];
    if (value === undefined || value === null || value === "") return;
    parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(asString(value))}`);
  });
  return parts.length ? `?${parts.join("&")}` : "";
};
const classifyHttp = (raw) => {
  const status = Number(raw && raw.status) || 0;
  const body = raw && raw.body && typeof raw.body === "object" ? raw.body : {};
  const text = asString(raw && raw.text);
  const message = asString(body.message || body.error || text);
  const errorCode = asString(body.error_code || body.errorCode || body.code || body.status);
  return {
    status,
    body,
    text,
    message,
    errorCode,
    retryable: isRetryableStatus(status),
    unauthorized: status === 401,
    paymentRequired: status === 402,
    conflict: status === 409,
    forbidden: status === 403,
    notFound: status === 404,
  };
};
const throwClassified = (classified) => {
  const status = Number(classified && classified.status) || 0;
  const message = asString(classified && classified.message) || "request failed";
  if (status === 401) throw new Error(`AIARK_REQUEST_FAILED (401): ${message || "missing or invalid X-TOKEN"}`);
  if (status === 402) throw new Error(`AIARK_REQUEST_FAILED (402): ${message || "not enough credits"}`);
  if (status === 429) throw new Error(`AIARK_REQUEST_FAILED (429): ${message || "rate limit exceeded"}`);
  if (status >= 500) throw new Error(`AIARK_REQUEST_FAILED (${status}): ${message || "server error"}`);
  throw new Error(`AIARK_REQUEST_FAILED (${status}): ${message}`);
};
const aiarkRequest = async (path, method = "GET", body, query) => {
  const apiKey = await getAiArkApiKey();
  const headers = {
    "X-TOKEN": apiKey,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  const options = { method, headers, muteHttpExceptions: true };
  if (body !== undefined) options.payload = JSON.stringify(body);
  const response = await UrlFetchApp.fetch(`${AIARK_API_BASE}${path}${buildQuery(query)}`, options);
  const status = response.getResponseCode();
  const text = response.getContentText();
  let parsed = {};
  if (text.trim()) {
    try {
      parsed = JSON.parse(text);
    } catch (_error) {
      throw new Error("AIARK_INVALID_RESPONSE: expected JSON");
    }
  }
  const classified = classifyHttp({ status, body: parsed, text });
  if (classified.unauthorized || classified.paymentRequired || classified.retryable) throwClassified(classified);
  return classified;
};
const AIARK_SENIORITIES = new Set([
  "founder",
  "owner",
  "partner",
  "c_suite",
  "vp",
  "director",
  "head",
  "manager",
  "senior",
  "mid-level",
  "entry",
  "intern",
]);
const normalizeDomain = (value) => {
  const text = asString(value).toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "");
  return text.split("/")[0];
};
const mapSeniorities = (values) => {
  const items = [];
  const seen = new Set();
  asCsvList(values).forEach((value) => {
    let key = asString(value).toLowerCase().replace(/\s+/g, "_").replace(/-/g, "_");
    if (key === "mid_level") key = "mid-level";
    if (key === "c-suite" || key === "c_suite") key = "c_suite";
    if (!AIARK_SENIORITIES.has(key) || seen.has(key)) return;
    seen.add(key);
    items.push(key);
  });
  return items;
};
const parseEmployeeRange = (value) => {
  const text = asString(value).replace(/\s+/g, "");
  if (!text) return null;
  const plus = text.endsWith("+");
  const cleaned = plus ? text.slice(0, -1) : text;
  const parts = cleaned.split(/[-,]/).map((part) => Number(part)).filter((part) => Number.isFinite(part));
  if (!parts.length) return null;
  if (plus || parts.length === 1) return { start: parts[0] };
  const start = Math.min(parts[0], parts[1]);
  const end = Math.max(parts[0], parts[1]);
  return { start, end };
};
const parseEmployeeRanges = (values) => asCsvList(values).map(parseEmployeeRange).filter(Boolean);
const textInclude = (mode, content) => ({ any: { include: { mode, content } } });
const plainInclude = (content) => ({ any: { include: content } });
const buildPeopleFilters = (input) => {
  const req = input && typeof input === "object" ? input : {};
  const titles = asCsvList(req.titles);
  const seniorities = mapSeniorities(req.seniorities);
  const personLocations = asCsvList(req.personLocations);
  const organizationLocations = asCsvList(req.organizationLocations);
  const employeeRanges = parseEmployeeRanges(req.employeeRanges);
  const domains = asCsvList(req.domains).map(normalizeDomain).filter(Boolean);
  const keywords = asCsvList(req.keywords);
  const contact = {};
  const account = {};
  if (titles.length) contact.experience = { latest: { title: textInclude("SMART", titles) } };
  if (seniorities.length) contact.seniority = plainInclude(seniorities);
  if (personLocations.length) contact.location = plainInclude(personLocations);
  if (organizationLocations.length) account.location = plainInclude(organizationLocations);
  if (employeeRanges.length) account.employeeSize = { type: "RANGE", range: employeeRanges };
  if (domains.length) account.domain = plainInclude(domains);
  if (keywords.length) account.industries = textInclude("WORD", keywords);
  const hasFilter = Boolean(Object.keys(contact).length || Object.keys(account).length);
  const body = {};
  if (Object.keys(contact).length) body.contact = contact;
  if (Object.keys(account).length) body.account = account;
  return { body, hasFilter };
};
const missingFiltersResult = (extra = {}) => ({
  ok: false,
  outcome: "MISSING_FILTERS",
  people: [],
  complete: false,
  hasMore: false,
  nextPage: "",
  trackId: asString(extra.trackId),
  inquiryPage: asString(extra.inquiryPage || "0"),
  withEmail: 0,
  withoutEmail: 0,
  total: "0",
  state: "",
  failure: extra.failure || "Provide at least one ICP filter: titles, seniorities, personLocations, organizationLocations, employeeRanges, domains, or keywords",
});
const personName = (row) => {
  const profile = row && row.profile && typeof row.profile === "object" ? row.profile : {};
  const input = row && row.input && typeof row.input === "object" ? row.input : {};
  return {
    firstName: asString(profile.first_name || input.firstname || row.firstName || row.first_name),
    lastName: asString(profile.last_name || input.lastname || row.lastName || row.last_name),
    title: asString(profile.title || row.title),
  };
};
const personCompany = (row) => {
  const company = row && row.company && typeof row.company === "object" ? row.company : {};
  const summary = company.summary && typeof company.summary === "object" ? company.summary : {};
  const link = company.link && typeof company.link === "object" ? company.link : {};
  return asString(summary.name || company.name || row.companyName || link.domain);
};
const emailBlock = (row) => (row && row.email && typeof row.email === "object" ? row.email : {});
const emailOutputs = (row) => {
  const block = emailBlock(row);
  const fromBlock = Array.isArray(block.output) ? block.output : [];
  const fromOutput = Array.isArray(row && row.output) ? row.output : [];
  return fromBlock.length ? fromBlock : fromOutput;
};
const emailState = (row) => asString(emailBlock(row).state || row.emailState).toUpperCase();
const isEmailProcessing = (row) => emailState(row) === "PROCESSING";
const firstValidEmail = (row) => {
  if (isEmailProcessing(row)) return "";
  const items = emailOutputs(row);
  for (const item of items) {
    if (!item || typeof item !== "object") continue;
    const address = asString(item.address).toLowerCase();
    if (!address) continue;
    if (item.found === false) continue;
    if (asString(item.status) && asString(item.status).toUpperCase() === "INVALID") continue;
    return address;
  }
  return "";
};
const mapSearchPerson = (row) => {
  const names = personName(row);
  return {
    id: asString(row && row.id),
    firstName: names.firstName,
    lastName: names.lastName,
    title: names.title,
    company: personCompany(row),
    hasEmail: false,
  };
};
const mapExportPerson = (row) => {
  const names = personName(row);
  const processing = isEmailProcessing(row);
  return {
    id: asString(row && row.id),
    email: processing ? "" : firstValidEmail(row),
    emailState: emailState(row),
    firstName: names.firstName,
    lastName: names.lastName,
    title: names.title,
    company: personCompany(row),
  };
};
const mapPeopleList = (value) => {
  if (Array.isArray(value)) return value.filter((row) => row && typeof row === "object");
  if (value && typeof value === "object" && Array.isArray(value.content)) {
    return value.content.filter((row) => row && typeof row === "object");
  }
  return [];
};
const exportPageSize = (value, fallback, max) => Math.min(max, Math.max(1, asNumber(value, fallback)));
const webhookUrl = (value) => {
  const text = asString(value);
  return /^https:\/\//i.test(text) ? text : "";
};
const statisticsState = (classified) => asString(classified && classified.body && classified.body.state).toUpperCase();
const statisticsCounts = (classified) => {
  const stats = classified && classified.body && classified.body.statistics && typeof classified.body.statistics === "object" ? classified.body.statistics : {};
  return {
    total: asNumber(stats.total, 0),
    found: asNumber(stats.found, 0),
    success: asNumber(stats.success, 0),
    failed: asNumber(stats.failed, 0),
  };
};
const isStuckRefund = (classified) => {
  if (!classified || !classified.forbidden) return false;
  const haystack = `${asString(classified.errorCode)} ${asString(classified.message)}`.toLowerCase();
  return /stuck|4031013|4031014|refund/.test(haystack);
};
const isNoResultRefund = (classified) => {
  const haystack = `${asString(classified && classified.errorCode)} ${asString(classified && classified.message)}`.toLowerCase();
  return /search_no_results|no_emails_found/.test(haystack);
};
const pendingExportResult = (trackId, extra = {}) => ({
  ok: false,
  outcome: "EXPORT_PENDING",
  people: [],
  complete: false,
  hasMore: true,
  nextPage: asString(extra.nextPage || extra.inquiryPage || "0"),
  trackId,
  inquiryPage: asString(extra.inquiryPage || "0"),
  withEmail: 0,
  withoutEmail: 0,
  total: asString(extra.total || "0"),
  state: asString(extra.state || "PENDING"),
  failure: extra.failure || "Export submitted; rerun the same correlationId with this trackId (do not POST export again)",
});
const failedExportResult = (trackId, failure, extra = {}) => ({
  ok: false,
  outcome: extra.outcome || "EXPORT_FAILED",
  people: [],
  complete: extra.complete === true,
  hasMore: false,
  nextPage: "",
  trackId: asString(trackId),
  inquiryPage: asString(extra.inquiryPage || "0"),
  withEmail: extra.withEmail || 0,
  withoutEmail: extra.withoutEmail || 0,
  total: asString(extra.total || "0"),
  state: asString(extra.state || ""),
  failure,
});
const submitPeopleExport = async (req, pageSize) => {
  const filters = buildPeopleFilters(req);
  if (!filters.hasFilter) return missingFiltersResult();
  const body = { ...filters.body, page: 0, size: pageSize };
  const hook = webhookUrl(req.webhook);
  if (hook) body.webhook = hook;
  const classified = await aiarkRequest("/v1/people/export", "POST", body);
  if (classified.notFound) return failedExportResult("", "Export search returned no people", { outcome: "EXPORT_EMPTY", complete: true });
  if (classified.status === 400 && /pending/i.test(classified.message)) {
    return pendingExportResult("", { failure: classified.message || "Too many pending export jobs; retry the same start without a trackId after in-flight jobs drain" });
  }
  if (classified.status < 200 || classified.status >= 300) throwClassified(classified);
  const trackId = asString(classified.body.trackId);
  if (!trackId) return failedExportResult("", "Export accepted without trackId");
  return pendingExportResult(trackId, { state: statisticsState(classified) || "PENDING", total: statisticsCounts(classified).total });
};
const collectExportPage = (inquiries, trackId) => {
  const pageNumber = Math.max(0, asNumber(inquiries.page, 0));
  const rows = inquiries.people || [];
  if (rows.some(isEmailProcessing)) {
    return pendingExportResult(trackId, {
      inquiryPage: String(pageNumber),
      nextPage: String(pageNumber),
      total: inquiries.totalElements,
      state: "PROCESSING",
      failure: "Inquiry page still has PROCESSING emails; rerun the same trackId and inquiryPage (do not POST export again)",
    });
  }
  const people = [];
  let withEmail = 0;
  let withoutEmail = 0;
  rows.forEach((row) => {
    const email = asString(row.email);
    if (email) withEmail += 1;
    else withoutEmail += 1;
    people.push(row);
  });
  const hasMore = inquiries.last !== true;
  return {
    ok: true,
    outcome: hasMore ? "EXPORTED_PARTIAL" : "EXPORTED",
    people,
    complete: !hasMore,
    hasMore,
    nextPage: hasMore ? String(pageNumber + 1) : "",
    trackId,
    inquiryPage: String(pageNumber),
    withEmail,
    withoutEmail,
    total: asString(inquiries.totalElements || people.length),
    state: "DONE",
    failure: hasMore ? `More AI Ark inquiry pages remain; nextPage=${pageNumber + 1}` : "",
  };
};
