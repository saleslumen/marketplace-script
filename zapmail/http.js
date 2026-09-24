const ZAPMAIL_API_BASE = "https://api.zapmail.ai/api";
const CONNECTION_KEY = "zapmail";
const ZAPMAIL_CONNECT_NAMESERVERS = [
  "pns61.cloudns.net",
  "pns62.cloudns.com",
  "pns63.cloudns.net",
  "pns64.cloudns.uk",
];
const ZAPMAIL_MAX_MAILBOXES_PER_DOMAIN = 5;
const asString = (value) => (value === undefined || value === null ? "" : String(value).trim());
const isRetryableRequestError = (error) => {
  const message = asString(error && error.message);
  const match = message.match(/\((\d{3})\)/);
  if (!match) return /timeout|ECONN|ENOTFOUND|network|Too many requests/i.test(message);
  const status = Number(match[1]);
  return status === 408 || status === 429 || status >= 500;
};
const isAdminMailboxPendingError = (error) => {
  const message = asString(error && error.message);
  return /admin mailbox not found/i.test(message) || /\(404\)/.test(message);
};
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
const getZapmailApiKey = async () => ConnectionApp.getApiKey(CONNECTION_KEY);
const zapmailRequestRaw = async (path, method = "GET", body, workspaceId, serviceProvider) => {
  const apiKey = await getZapmailApiKey();
  const headers = {
    "x-auth-zapmail": apiKey,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  const workspace = asString(workspaceId);
  if (workspace) headers["x-workspace-key"] = workspace;
  const provider = asString(serviceProvider || "GOOGLE").toUpperCase();
  if (provider) headers["x-service-provider"] = provider;
  const options = { method, headers };
  if (body !== undefined) options.payload = JSON.stringify(body);
  const response = await UrlFetchApp.fetch(`${ZAPMAIL_API_BASE}${path}`, options);
  const status = response.getResponseCode();
  const text = response.getContentText();
  let parsed = {};
  if (text.trim()) {
    try {
      parsed = JSON.parse(text);
    } catch (_error) {
      parsed = { error: true, message: text };
    }
  }
  return { status, body: parsed, text };
};
const zapmailRequest = async (path, method = "GET", body, workspaceId, serviceProvider) => {
  const raw = await zapmailRequestRaw(path, method, body, workspaceId, serviceProvider);
  if (raw.status < 200 || raw.status >= 300) {
    throw new Error(`ZAPMAIL_REQUEST_FAILED (${raw.status}): ${raw.text}`);
  }
  return raw.body || {};
};
const parseJsonArray = (value) => {
  if (Array.isArray(value)) return value;
  const text = asString(value);
  if (!text) return [];
  if (text.startsWith("[")) {
    try {
      const parsed = JSON.parse(text);
      return Array.isArray(parsed) ? parsed : [];
    } catch (_error) {
      return [];
    }
  }
  return asCsvList(text);
};
const mapMailbox = (mailbox, domainName, domainId) => {
  const username = asString(mailbox.username || mailbox.mailboxUsername);
  const domain = asString(mailbox.domain || mailbox.domainName || domainName);
  return {
    uid: asString(mailbox.id || mailbox.mailboxId),
    username,
    domainName: domain,
    domainId: asString(mailbox.domainId || domainId),
    email: asString(mailbox.email) || (username && domain ? `${username}@${domain}` : ""),
    firstName: asString(mailbox.firstName),
    lastName: asString(mailbox.lastName),
    status: asString(mailbox.status),
    isWarmedUp: mailbox.isWarmedUp === true,
  };
};
const flattenMailboxes = (data) => {
  const domains = (data && data.domains) || [];
  const mailboxes = [];
  domains.forEach((domain) => {
    const domainName = asString(domain.domain);
    const domainId = asString(domain.id);
    (domain.mailboxes || []).forEach((mailbox) => {
      mailboxes.push(mapMailbox(mailbox, domainName, domainId));
    });
  });
  return mailboxes;
};
const isPresentMailboxStatus = (status) => {
  const normalized = asString(status).toUpperCase();
  return ["ACTIVE", "IN_PROGRESS", "PENDING", "CREATING", "SCHEDULED", ""].includes(normalized);
};
const isActiveMailboxStatus = (status) => asString(status).toUpperCase() === "ACTIVE";
const expectedMailboxEmail = (username, domainName) => {
  const local = asString(username).toLowerCase();
  const domain = asString(domainName).toLowerCase();
  return local && domain ? `${local}@${domain}` : "";
};
const listPresentMailboxes = async (workspaceId, domainName) => {
  const mailboxes = [];
  let page = 1;
  let totalPages = 1;
  for (let i = 0; i < 50; i += 1) {
    const listed = await listMailboxes({
      workspaceId,
      domain: domainName,
      page: String(page),
      limit: "50",
    });
    (listed.mailboxes || []).forEach((mailbox) => {
      if (isPresentMailboxStatus(mailbox.status)) mailboxes.push(mailbox);
    });
    totalPages = asNumber(listed.totalPages, 1);
    if (page >= totalPages) break;
    page += 1;
  }
  return mailboxes;
};
const resolveDomainId = async (workspaceId, domainName) => {
  const listed = await listDomains({ workspaceId, contains: domainName });
  const match = (listed.domains || []).find((domain) => domain.domainName === asString(domainName).toLowerCase());
  return match ? match.domainId : "";
};
const CONNECT_SUCCESS = new Set(["SUCCESS", "DOMAIN_ALREADY_CONNECTED"]);
const CONNECT_RETRY = new Set([
  "PENDING",
  "CHECKING_NS_IN_WHOIS",
  "NS_NOT_CHANGED",
  "CHECKING_IF_DOMAIN_IS_REGISTERED",
  "CHECKING_EXISTING_WORKSPACE_STATUS",
  "CHECKING_BLACKLISTED_STATUS",
]);
const CONNECT_FAILED = new Set([
  "DOMAIN_NOT_REGISTERED",
  "WORKSPACE_ALREADY_EXISTS",
  "BLACKLISTED_DOMAIN",
  "BANNED_DOMAIN",
]);
const connectStatusClass = (status) => {
  const normalized = asString(status).toUpperCase();
  if (CONNECT_SUCCESS.has(normalized)) return "SUCCESS";
  if (CONNECT_RETRY.has(normalized)) return "RETRY";
  if (CONNECT_FAILED.has(normalized)) return "FAILED";
  return "UNKNOWN";
};
