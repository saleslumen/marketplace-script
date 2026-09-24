const INBOXKIT_API_BASE = "https://api.inboxkit.com";
const INBOXKIT_CONNECTION_KEY = "inboxkit";
const CLOUDFLARE_CONNECTION_KEY = "cloudflare";
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
const getInboxKitApiKey = async () => ConnectionApp.getApiKey(INBOXKIT_CONNECTION_KEY);
const getWorkspaceCloudflareApiToken = async (workspaceId) => {
  const id = asString(workspaceId);
  if (!id) throw new Error("INBOXKIT_WORKSPACE_MISSING: workspaceId is required");
  return ConnectionApp.getApiKey(CLOUDFLARE_CONNECTION_KEY);
};
const sleepMs = (ms) => {
  const wait = Math.max(0, Number(ms) || 0);
  if (wait > 0 && typeof Utilities !== "undefined" && Utilities.sleep) Utilities.sleep(wait);
};
const inboxKitRequestRaw = async (path, method = "GET", body, workspaceId) => {
  const apiKey = await getInboxKitApiKey();
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  const workspace = asString(workspaceId);
  if (workspace) headers["X-Workspace-Id"] = workspace;
  const options = { method, headers };
  if (body !== undefined) options.payload = JSON.stringify(body);
  const response = await UrlFetchApp.fetch(`${INBOXKIT_API_BASE}${path}`, options);
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
const inboxKitRequest = async (path, method = "GET", body, workspaceId) => {
  const raw = await inboxKitRequestRaw(path, method, body, workspaceId);
  if (raw.status < 200 || raw.status >= 300) {
    throw new Error(`INBOXKIT_REQUEST_FAILED (${raw.status}): ${raw.text}`);
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
const mapMailbox = (mailbox) => {
  const username = asString(mailbox.username);
  const domainName = asString(mailbox.domain_name || mailbox.domain);
  const adminKnown = Object.prototype.hasOwnProperty.call(mailbox, "is_admin")
    || Object.prototype.hasOwnProperty.call(mailbox, "isAdmin");
  return {
    uid: asString(mailbox.uid),
    username,
    domainName,
    email: username && domainName ? `${username}@${domainName}` : "",
    firstName: asString(mailbox.first_name),
    lastName: asString(mailbox.last_name),
    platform: asString(mailbox.platform),
    status: asString(mailbox.status),
    isAdmin: mailbox.is_admin === true || mailbox.isAdmin === true,
    adminKnown,
  };
};
const isTerminalConsentFailure = (status) =>
  ["errored", "failed", "error", "rejected", "denied"].includes(asString(status).toLowerCase());
const isTerminalConsentSuccess = (status) =>
  ["completed", "complete", "accepted", "success", "succeeded"].includes(asString(status).toLowerCase());
const listGoogleMailboxesByStatus = async (workspaceId, status, options = {}) => {
  const allPages = !(options.allPages === false || asString(options.allPages).toLowerCase() === "false");
  const limit = asNumber(options.limit, 50);
  let page = asNumber(options.page, 1);
  const mailboxes = [];
  let total = 0;
  let pages = 1;
  let currentPage = page;
  const maxPages = allPages ? 50 : 1;
  for (let i = 0; i < maxPages; i += 1) {
    const body = {
      page,
      limit,
      platform: "GOOGLE",
    };
    if (asString(status)) body.status = asString(status);
    if (asString(options.keyword)) body.keyword = asString(options.keyword);
    if (asString(options.domain)) body.domain = asString(options.domain);
    const response = await inboxKitRequest("/v1/api/mailboxes/list", "POST", body, workspaceId);
    if (response.error) throw new Error(`INBOXKIT_REQUEST_FAILED: ${asString(response.message) || "list failed"}`);
    const pageRows = (response.mailboxes || []).map(mapMailbox).filter((mailbox) => mailbox.uid);
    mailboxes.push(...pageRows);
    total = Number(response.total || mailboxes.length) || mailboxes.length;
    pages = Number(response.pages || 1) || 1;
    currentPage = Number(response.current_page || page) || page;
    if (!allPages) break;
    if (page >= pages) break;
    if (!pageRows.length) break;
    page += 1;
  }
  return {
    mailboxes,
    total: total || mailboxes.length,
    currentPage,
    pages,
    fetched: mailboxes.length,
  };
};
const asConsentUrlList = (value) => {
  if (Array.isArray(value)) return value.map(asString).filter(Boolean);
  const text = asString(value);
  if (!text) return [];
  if (text.startsWith("[")) {
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) return parsed.map(asString).filter(Boolean);
    } catch (_error) {
      /* fall through */
    }
  }
  return text.split(",").map((item) => item.trim()).filter(Boolean);
};
const asMailboxList = (value) => {
  if (Array.isArray(value)) return value.filter((row) => row && typeof row === "object");
  if (typeof value === "string" && value.trim().startsWith("[")) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.filter((row) => row && typeof row === "object");
    } catch (_error) {
      return [];
    }
  }
  return [];
};
const expectedMailboxEmail = (username, domainName) => {
  const local = asString(username).toLowerCase();
  const domain = asString(domainName).toLowerCase();
  return local && domain ? `${local}@${domain}` : "";
};
const isPresentMailboxStatus = (status) => {
  const normalized = asString(status).toLowerCase();
  return ["active", "pending", "provisioning", "creating", "scheduled", ""].includes(normalized);
};
const isActiveMailboxStatus = (status) => asString(status).toLowerCase() === "active";
const mapConnectedCloudflareDomain = (row) => ({
  uid: asString(row.uid),
  name: asString(row.name).toLowerCase(),
  status: asString(row.status),
  connectionMode: asString(row.connection_mode),
  credentialStatus: asString(row.credential_status),
  assignedMailboxes: row.assigned_mailboxes,
  availableMailboxes: row.available_mailboxes,
  nameservers: Array.isArray(row.nameservers) ? row.nameservers.map(asString).filter(Boolean) : [],
});
const mapInboxKitDomain = (row) => ({
  uid: asString(row.uid),
  name: asString(row.name).toLowerCase(),
  status: asString(row.status),
  cfZoneId: asString(row.cf_zone_id),
  connectionType: asString(row.connection_type),
  nameserverMatchStatus: asString(row.nameserver_match_status),
  assignedMailboxes: row.assigned_mailboxes,
  availableMailboxes: row.available_mailboxes,
  nameservers: Array.isArray(row.nameservers) ? row.nameservers.map(asString).filter(Boolean) : [],
});
const recordStatusByLabel = (records, label) => {
  const row = (Array.isArray(records) ? records : []).find(
    (item) => asString(item.label).toUpperCase() === asString(label).toUpperCase(),
  );
  return asString(row && row.status).toLowerCase();
};
const isRetryableDnsRecordStatus = (status) => ["pending", "not_applicable"].includes(asString(status).toLowerCase());
const isOkDnsRecordStatus = (status) => asString(status).toLowerCase() === "ok";
const classifyVerifyResults = (requestedDomains, verify) => {
  const results = Array.isArray(verify.results) ? verify.results : [];
  const byDomain = new Map(results.map((row) => [asString(row.domain).toLowerCase(), row]));
  const healthy = [];
  const retrying = [];
  const failed = [];
  for (const name of requestedDomains) {
    const row = byDomain.get(name);
    if (!row) {
      failed.push({ domain: name, reason: "missing_verify_result" });
      continue;
    }
    if (asString(row.status).toLowerCase() === "error") {
      failed.push({ domain: name, reason: asString(row.error_message) || "verify error" });
      continue;
    }
    const platform = asString(row.platform).toUpperCase();
    const mx = recordStatusByLabel(row.records, "MX");
    const spf = recordStatusByLabel(row.records, "SPF");
    const dkim = recordStatusByLabel(row.records, "DKIM");
    const dmarc = recordStatusByLabel(row.records, "DMARC");
    const cloudflareChecked = row.cloudflare_checked === true;
    const overall = asString(row.overall_health).toLowerCase();
    const needsRepair = row.needs_repair === true;
    const detail = { domain: name, platform, cloudflareChecked, overall, mx, spf, dkim, dmarc, needsRepair };
    if (
      platform === "GOOGLE"
      && cloudflareChecked
      && overall === "healthy"
      && !needsRepair
      && isOkDnsRecordStatus(mx)
      && isOkDnsRecordStatus(spf)
      && isOkDnsRecordStatus(dkim)
      && isOkDnsRecordStatus(dmarc)
    ) {
      healthy.push(detail);
      continue;
    }
    if (
      isRetryableDnsRecordStatus(dkim)
      || isRetryableDnsRecordStatus(mx)
      || isRetryableDnsRecordStatus(spf)
      || isRetryableDnsRecordStatus(dmarc)
      || asString(row.overall_health).toLowerCase() === "unknown"
      || !cloudflareChecked
      || needsRepair
      || platform === ""
      || platform === "NULL"
    ) {
      retrying.push({
        ...detail,
        reason: isRetryableDnsRecordStatus(dkim)
          ? `dkim_${dkim || "pending"}`
          : (needsRepair ? "needs_repair" : (platform ? `health_${overall || "unknown"}` : "platform_pending")),
      });
      continue;
    }
    failed.push({
      ...detail,
      reason: platform && platform !== "GOOGLE"
        ? `platform_${platform}`
        : `health_${overall || "failed"}`,
    });
  }
  return { healthy, retrying, failed };
};
