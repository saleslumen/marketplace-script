const TRULYINBOX_API_BASE = "https://lupus-edge.trulyinbox.com/v1";
const CONNECTION_KEY = "trulyinbox";
const TRULYINBOX_GOOGLE_DWD_SERVICE_ACCOUNT_ID = "109542662799681888263";
const TRULYINBOX_GOOGLE_DWD_SCOPES = [
  "https://www.googleapis.com/auth/admin.directory.user.readonly",
  "https://www.googleapis.com/auth/admin.directory.domain.readonly",
  "https://www.googleapis.com/auth/gmail.modify",
  "https://www.googleapis.com/auth/gmail.send",
];
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
const uniqueLower = (values) => {
  const seen = new Set();
  const items = [];
  asCsvList(values).forEach((value) => {
    const key = value.toLowerCase();
    if (!key || seen.has(key)) return;
    seen.add(key);
    items.push(key);
  });
  return items;
};
const asIdList = (value) => asCsvList(value).map((item) => {
  const number = Number(item);
  return Number.isFinite(number) ? number : item;
});
const headerValue = (headers, name) => {
  const wanted = asString(name).toLowerCase();
  const source = headers && typeof headers === "object" ? headers : {};
  const key = Object.keys(source).find((item) => asString(item).toLowerCase() === wanted);
  if (!key) return "";
  const value = source[key];
  return Array.isArray(value) ? asString(value[0]) : asString(value);
};
const hasOwnField = (row, key) => {
  if (!row || typeof row !== "object" || !Object.prototype.hasOwnProperty.call(row, key)) return false;
  return row[key] !== undefined && row[key] !== null && row[key] !== "";
};
const isRetryableStatus = (status) => {
  const code = Number(status) || 0;
  return code === 429 || code >= 500 || code === 0;
};
const getTrulyInboxApiKey = async () => ConnectionApp.getApiKey(CONNECTION_KEY);
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
const classifyHttp = (raw) => {
  const status = Number(raw && raw.status) || 0;
  const body = (raw && raw.body && typeof raw.body === "object") ? raw.body : {};
  const text = asString(raw && raw.text);
  const message = asString(body.message || body.error || text);
  const errorCode = asString(body.error_code || body.errorCode || body.code);
  const headers = (raw && raw.headers && typeof raw.headers === "object") ? raw.headers : {};
  return {
    status,
    body,
    text,
    message,
    errorCode,
    headers,
    rateLimitLimit: headerValue(headers, "X-RateLimit-Limit"),
    rateLimitRemaining: headerValue(headers, "X-RateLimit-Remaining"),
    rateLimitReset: headerValue(headers, "X-RateLimit-Reset"),
    retryable: isRetryableStatus(status),
  };
};
const isDelegationFailure = (classified) => {
  if (!classified || Number(classified.status) !== 422) return false;
  const haystack = `${asString(classified.errorCode)} ${asString(classified.message)}`.toLowerCase();
  return /delegat|domain-wide|dwd|not.?authoriz|access_denied|insufficient.?permission|consent/.test(haystack);
};
const googleDelegation = () => ({
  serviceAccountId: TRULYINBOX_GOOGLE_DWD_SERVICE_ACCOUNT_ID,
  scopes: TRULYINBOX_GOOGLE_DWD_SCOPES.slice(),
});
const trulyinboxRequestRaw = async (path, method = "GET", body) => {
  const apiKey = await getTrulyInboxApiKey();
  const headers = {
    "X-Api-Key": apiKey,
    Accept: "application/json",
  };
  const options = { method, headers, muteHttpExceptions: true };
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    options.payload = JSON.stringify(body);
  }
  const response = await UrlFetchApp.fetch(`${TRULYINBOX_API_BASE}${path}`, options);
  const status = response.getResponseCode();
  const text = response.getContentText();
  const headersOut = typeof response.getHeaders === "function" ? response.getHeaders() : {};
  let parsed = {};
  if (text.trim()) {
    try {
      parsed = JSON.parse(text);
    } catch (_error) {
      parsed = { error: true, message: text };
    }
  }
  return { status, body: parsed, text, headers: headersOut };
};
const emailDomain = (email) => {
  const parts = asString(email).toLowerCase().split("@");
  return parts.length === 2 ? parts[1] : "";
};
const mapEmailAccount = (row) => ({
  emailAccountId: asString(row.id || row.emailAccountId),
  fromEmail: asString(row.fromEmail).toLowerCase(),
  fromName: asString(row.fromName),
  type: asString(row.type),
  status: asString(row.status).toLowerCase(),
  createdAt: asString(row.createdAt),
  workspaceId: asString(row.workspaceId),
  tags: Array.isArray(row.tags) ? row.tags.map(asString).filter(Boolean) : [],
  warmupScore: row.warmupScore,
  outreachReadinessStatus: asString(row.outreachReadinessStatus),
});
const mapAccountStatus = (row) => ({
  emailAccountId: asString(row.emailAccountId),
  fromEmail: asString(row.fromEmail).toLowerCase(),
  type: asString(row.type),
  authStatus: asString(row.authStatus).toLowerCase(),
  warmupStatus: asString(row.warmupStatus).toLowerCase(),
  healthScore: row.healthScore,
  warmupScore: row.warmupScore,
  outreachReadinessStatus: asString(row.outreachReadinessStatus),
  connectionError: asString(row.connectionError),
  lastConnectedAt: asString(row.lastConnectedAt),
  workspaceId: asString(row.workspaceId),
});
const mapWarmupSettings = (row) => ({
  emailAccountId: asString(row.emailAccountId),
  strategy: asString(row.strategy),
  timeZone: asString(row.timeZone),
  warmupStatus: asString(row.warmupStatus).toLowerCase(),
  warmupLanguage: asString(row.warmupLanguage),
  upcomingContentConfig: row.upcomingContentConfig && typeof row.upcomingContentConfig === "object" ? row.upcomingContentConfig : {},
  googleVolumePercentage: row.googleVolumePercentage,
  microsoftVolumePercentage: row.microsoftVolumePercentage,
  othersVolumePercentage: row.othersVolumePercentage,
  maxSendingLimit: row.maxSendingLimit,
  warmUpInitialSendingLimit: row.warmUpInitialSendingLimit,
  increaseEmailsByNumber: row.increaseEmailsByNumber,
  replyRate: row.replyRate,
  dailySendingLimit: row.dailySendingLimit,
  dailyReceivingLimit: row.dailyReceivingLimit,
});
const mapWarmupStatus = (row) => ({
  emailAccountId: asString(row.emailAccountId),
  date: asString(row.date),
  current: asString(row.current).toLowerCase(),
  strategy: asString(row.strategy),
  dailySendingLimit: row.dailySendingLimit,
  sent: row.sent,
  received: row.received,
  replied: row.replied,
  spam: row.spam,
  undelivered: row.undelivered,
  warmupScore: row.warmupScore,
  outreachReadinessStatus: asString(row.outreachReadinessStatus),
  workspaceId: asString(row.workspaceId),
});
const SMTP_IMAP_PROVIDERS = [
  "gmail", "gsuite", "other", "yahoo", "zoho", "godaddy", "yandex",
  "sendgrid", "mailgun", "amazonses", "azure", "elasticemail", "mailjet",
];
const DELIVERABILITY_ESPS = ["gmail", "outlook", "other"];
const WARMUP_BULK_ACTIONS = ["start", "stop"];
const rateLimitedResult = (classified, extra = {}) => ({
  ok: false,
  outcome: "RATE_LIMITED",
  retryable: true,
  failure: classified.message || "TrulyInbox rate limited (20 req/min)",
  ...extra,
});
const accountIdFrom = (input) => asString(input && (input.emailAccountId || input.id));
const mapBlacklist = (row) => {
  if (!row || typeof row !== "object") return undefined;
  return { listed: row.listed, notListed: row.notListed };
};
const mapSetupScore = (row) => {
  const mapped = {
    emailAccountId: asString(row.emailAccountId),
    emailAccountScore: row.emailAccountScore,
    updatedAt: asString(row.updatedAt),
    manualLastRefreshedAt: asString(row.manualLastRefreshedAt),
  };
  if (row.spf !== undefined) mapped.spf = row.spf === true;
  if (row.dkim !== undefined) mapped.dkim = row.dkim === true;
  if (row.dmarc !== undefined) mapped.dmarc = row.dmarc === true;
  if (row.mx !== undefined) mapped.mx = row.mx === true;
  if (row.ipBlacklist) mapped.ipBlacklist = mapBlacklist(row.ipBlacklist);
  if (row.domainBlacklist) mapped.domainBlacklist = mapBlacklist(row.domainBlacklist);
  return mapped;
};
const mapDnsHealth = (row) => ({
  emailAccountId: asString(row.emailAccountId),
  spf: asString(row.spf).toLowerCase(),
  dkim: asString(row.dkim).toLowerCase(),
  dmarc: asString(row.dmarc).toLowerCase(),
  mx: asString(row.mx).toLowerCase(),
  cachedAt: asString(row.cachedAt),
});
const mapEspDeliverability = (row) => {
  if (!row || typeof row !== "object") return undefined;
  return {
    deliverabilityRate: row.deliverabilityRate,
    sentCount: row.sentCount,
    inboxCount: row.inboxCount,
    spamCount: row.spamCount,
  };
};
const mapDeliverabilityScore = (row) => {
  const mapped = {
    emailAccountId: asString(row.emailAccountId),
    totalDeliverabilityRate: row.totalDeliverabilityRate,
    totalSentCount: row.totalSentCount,
    totalInboxCount: row.totalInboxCount,
    totalSpamInboxCount: row.totalSpamInboxCount,
  };
  if (row.gmail) mapped.gmail = mapEspDeliverability(row.gmail);
  if (row.outlook) mapped.outlook = mapEspDeliverability(row.outlook);
  if (row.other) mapped.other = mapEspDeliverability(row.other);
  return mapped;
};
const mapReportDay = (row) => ({
  date: asString(row.date),
  sent: row.sent,
  inbox: row.inbox,
  received: row.received,
  spam: row.spam,
  other: row.other,
  undelivered: row.undelivered,
  replied: row.replied,
  deliverabilityRate: row.deliverabilityRate,
});
const mapAccountReport = (row) => ({
  emailAccountId: asString(row.emailAccountId),
  from: asString(row.from),
  to: asString(row.to),
  days: (Array.isArray(row.days) ? row.days : []).map(mapReportDay),
});
const mapBulkDeleteResult = (row) => ({
  emailAccountId: asString(row.emailAccountId),
  deleted: row.deleted === true,
  errorCode: asString(row.errorCode),
});
const mapBulkWarmupResult = (row) => ({
  emailAccountId: asString(row.emailAccountId),
  status: asString(row.status).toLowerCase(),
  errorCode: asString(row.error_code || row.errorCode),
  message: asString(row.message),
});
const isConnectedListStatus = (status) => ["active", "warming", "paused"].includes(asString(status).toLowerCase());
const isListWarmupActive = (status) => asString(status).toLowerCase() === "warming";
const isTerminalListStatus = (status) => ["error", "auth-expired"].includes(asString(status).toLowerCase());
const isSettingsWarmupActive = (status) => asString(status).toLowerCase() === "active";
const workspaceMatches = (rowWorkspaceId, expectedWorkspaceId) => {
  const expected = asString(expectedWorkspaceId);
  const actual = asString(rowWorkspaceId);
  if (!expected || !actual) return true;
  return actual === expected;
};
const ensureFailure = (outcome, failure, extra = {}) => ({
  ok: false,
  outcome,
  retryable: extra.retryable === true,
  human: extra.human === true,
  failure,
  workspaceId: asString(extra.workspaceId),
  adminEmail: asString(extra.adminEmail),
  jobId: asString(extra.jobId),
  expectedEmails: extra.expectedEmails || [],
  missingEmails: extra.missingEmails || [],
  pendingWarmupEmails: extra.pendingWarmupEmails || [],
  connectedEmails: extra.connectedEmails || [],
  warmedEmails: extra.warmedEmails || [],
  googleDelegation: extra.human === true ? googleDelegation() : undefined,
});
const resolveWorkspace = async (workspaceId, adminEmail) => {
  const persisted = asString(workspaceId);
  const email = asString(adminEmail).toLowerCase();
  if (persisted) {
    const previewed = await previewWorkspaceMailboxes({ workspaceId: persisted });
    if (previewed.ok || asString(previewed.outcome) === "PREVIEW_TRUNCATED") {
      return { ok: true, workspaceId: persisted, preview: previewed, reused: true, failure: "" };
    }
    if (asString(previewed.outcome) === "RATE_LIMITED") return { ok: false, ...previewed, workspaceId: persisted };
    if (asString(previewed.outcome) === "DELEGATION_MISSING") return { ok: false, ...previewed, workspaceId: persisted };
    if (asString(previewed.outcome) !== "WORKSPACE_INVALID") return { ok: false, ...previewed, workspaceId: persisted };
  }
  if (!email) {
    return { ok: false, outcome: "MISSING_ADMIN_EMAIL", retryable: false, workspaceId: persisted, failure: "adminEmail is required to register a workspace" };
  }
  const registered = await registerGoogleWorkspace({ adminEmail: email });
  if (!registered.ok) return registered;
  const previewed = await previewWorkspaceMailboxes({ workspaceId: registered.workspaceId });
  if (!previewed.ok && asString(previewed.outcome) !== "PREVIEW_TRUNCATED") {
    return { ...previewed, workspaceId: registered.workspaceId, adminEmail: email };
  }
  return { ok: true, workspaceId: registered.workspaceId, preview: previewed, reused: asString(registered.outcome) === "WORKSPACE_REUSED", failure: "" };
};
const indexAccountsByEmail = async (workspaceId, tagName, expectedEmails) => {
  const byEmail = new Map();
  if (asString(tagName)) {
    const tagged = await listEmailAccounts({ tags: tagName, workspaceId });
    if (!tagged.ok) return tagged;
    (tagged.items || []).forEach((row) => {
      if (row.fromEmail) byEmail.set(row.fromEmail, row);
    });
    if (tagged.truncated && !expectedEmails.length) return { ...tagged, byEmail };
  }
  for (const email of expectedEmails) {
    if (byEmail.has(email)) continue;
    const listed = await listEmailAccounts({ search: email, workspaceId });
    if (!listed.ok) return listed;
    const match = (listed.items || []).find((row) => row.fromEmail === email);
    if (match) byEmail.set(email, match);
  }
  return { ok: true, outcome: "INDEXED", retryable: false, byEmail, failure: "" };
};
const proveMailboxWarmup = async (account, enableWarmup) => {
  if (!account || !account.emailAccountId) {
    return { kind: "missing", retryable: false };
  }
  if (isTerminalListStatus(account.status)) {
    return { kind: "failed", retryable: false, failure: `Account status ${account.status}` };
  }
  if (!isConnectedListStatus(account.status) && asString(account.status)) {
    return { kind: "unknown", retryable: false, failure: `Undocumented or unproven account status ${account.status}` };
  }
  if (!enableWarmup) {
    return isConnectedListStatus(account.status) ? { kind: "warmed" } : { kind: "unknown", retryable: false, failure: "Account is not active, warming, or paused" };
  }
  if (isListWarmupActive(account.status)) return { kind: "warmed" };
  const settings = await getWarmupSettings({ emailAccountId: account.emailAccountId });
  if (asString(settings.outcome) === "RATE_LIMITED") return { kind: "rate", retryable: true, failure: settings.failure };
  if (settings.ok && isSettingsWarmupActive(settings.warmupStatus)) return { kind: "warmed" };
  if (asString(settings.outcome) === "WARMUP_SETTINGS_MISSING") {
    return { kind: "start", retryable: true, emailAccountId: account.emailAccountId };
  }
  if (settings.ok && !isSettingsWarmupActive(settings.warmupStatus)) {
    return { kind: "start", retryable: true, emailAccountId: account.emailAccountId, failure: `warmupStatus=${settings.warmupStatus || "empty"}` };
  }
  const status = await getEmailAccount({ emailAccountId: account.emailAccountId });
  if (asString(status.outcome) === "RATE_LIMITED") return { kind: "rate", retryable: true, failure: status.failure };
  if (status.ok && isSettingsWarmupActive(status.warmupStatus)) return { kind: "warmed" };
  if (status.ok && asString(status.authStatus) && status.authStatus !== "connected") {
    return { kind: "failed", retryable: false, failure: `authStatus=${status.authStatus}` };
  }
  if (status.ok) {
    return { kind: "start", retryable: true, emailAccountId: account.emailAccountId, failure: `warmupStatus=${status.warmupStatus || "empty"}` };
  }
  return { kind: "unknown", retryable: false, failure: status.failure || settings.failure || "Warmup not proven" };
};
const proveExpectedWarmup = async ({ workspaceId, expectedEmails, selectedDomains, tagName, enableWarmup, preview }) => {
  const indexed = await indexAccountsByEmail(workspaceId, tagName, expectedEmails);
  if (!indexed.ok) return indexed;
  const missingEmails = [];
  const pendingWarmupEmails = [];
  const connectedEmails = [];
  const warmedEmails = [];
  const emailAccountIdsToStart = [];
  const failedEmails = [];
  if (expectedEmails.length) {
    for (const email of expectedEmails) {
      const account = indexed.byEmail.get(email);
      if (!account) {
        missingEmails.push(email);
        continue;
      }
      if (!isConnectedListStatus(account.status) && !asString(account.status)) {
        missingEmails.push(email);
        continue;
      }
      connectedEmails.push(email);
      const proved = await proveMailboxWarmup(account, enableWarmup);
      if (proved.kind === "rate") {
        return ensureFailure("RATE_LIMITED", proved.failure || "TrulyInbox rate limited (20 req/min)", {
          retryable: true,
          workspaceId,
          expectedEmails,
          missingEmails,
          pendingWarmupEmails,
          connectedEmails,
          warmedEmails,
        });
      }
      if (proved.kind === "warmed") {
        warmedEmails.push(email);
        continue;
      }
      if (proved.kind === "start") {
        pendingWarmupEmails.push(email);
        if (proved.emailAccountId) emailAccountIdsToStart.push(proved.emailAccountId);
        continue;
      }
      failedEmails.push(`${email}:${proved.failure || proved.kind}`);
    }
  } else {
    const domainSet = new Set(selectedDomains);
    const previewEmails = ((preview && preview.newEmails) || []).filter((row) => !domainSet.size || domainSet.has(row.domain));
    if (preview && preview.truncated) {
      return ensureFailure("PREVIEW_TRUNCATED", preview.failure || "Cannot prove a domain-only expected set from a truncated preview", {
        retryable: false,
        workspaceId,
        expectedEmails,
      });
    }
    if (previewEmails.length) {
      previewEmails.forEach((row) => missingEmails.push(row.email));
    }
    const domainAccounts = [];
    indexed.byEmail.forEach((row) => {
      if (domainSet.has(emailDomain(row.fromEmail))) domainAccounts.push(row);
    });
    if (!domainAccounts.length && !missingEmails.length) {
      return {
        ok: false,
        outcome: "ACCOUNT_UNPROVEN",
        retryable: false,
        needsSync: false,
        needsWarmupStart: false,
        workspaceId,
        expectedEmails,
        missingEmails,
        pendingWarmupEmails,
        connectedEmails,
        warmedEmails,
        emailAccountIdsToStart,
        failure: "Domain-only proof found no tagged/listed accounts and no preview leftovers",
      };
    }
    for (const account of domainAccounts) {
      connectedEmails.push(account.fromEmail);
      const proved = await proveMailboxWarmup(account, enableWarmup);
      if (proved.kind === "rate") {
        return ensureFailure("RATE_LIMITED", proved.failure || "TrulyInbox rate limited (20 req/min)", { retryable: true, workspaceId });
      }
      if (proved.kind === "warmed") {
        warmedEmails.push(account.fromEmail);
        continue;
      }
      if (proved.kind === "start") {
        pendingWarmupEmails.push(account.fromEmail);
        if (proved.emailAccountId) emailAccountIdsToStart.push(proved.emailAccountId);
        continue;
      }
      failedEmails.push(`${account.fromEmail}:${proved.failure || proved.kind}`);
    }
  }
  if (failedEmails.length) {
    return {
      ok: false,
      outcome: "ACCOUNT_UNPROVEN",
      retryable: false,
      needsSync: false,
      needsWarmupStart: false,
      workspaceId,
      expectedEmails,
      missingEmails,
      pendingWarmupEmails,
      connectedEmails,
      warmedEmails,
      emailAccountIdsToStart,
      failure: failedEmails.join("; "),
    };
  }
  if (missingEmails.length) {
    return {
      ok: false,
      outcome: "MAILBOXES_MISSING",
      retryable: false,
      needsSync: true,
      needsWarmupStart: false,
      workspaceId,
      expectedEmails,
      missingEmails,
      pendingWarmupEmails,
      connectedEmails,
      warmedEmails,
      emailAccountIdsToStart,
      failure: `Not connected: ${missingEmails.join(", ")}`,
    };
  }
  if (enableWarmup && pendingWarmupEmails.length) {
    return {
      ok: false,
      outcome: "WARMUP_PENDING",
      retryable: true,
      needsSync: false,
      needsWarmupStart: emailAccountIdsToStart.length > 0,
      workspaceId,
      expectedEmails,
      missingEmails,
      pendingWarmupEmails,
      connectedEmails,
      warmedEmails,
      emailAccountIdsToStart,
      failure: `Warmup not active: ${pendingWarmupEmails.join(", ")}`,
    };
  }
  if (enableWarmup && expectedEmails.length && warmedEmails.length !== expectedEmails.length) {
    return {
      ok: false,
      outcome: "WARMUP_PENDING",
      retryable: true,
      needsSync: false,
      needsWarmupStart: false,
      workspaceId,
      expectedEmails,
      missingEmails,
      pendingWarmupEmails,
      connectedEmails,
      warmedEmails,
      emailAccountIdsToStart,
      failure: "Expected mailboxes are connected but warmup is not proven active for the full set",
    };
  }
  return {
    ok: true,
    outcome: "WARMUP_ACTIVE",
    retryable: false,
    needsSync: false,
    needsWarmupStart: false,
    workspaceId,
    expectedEmails,
    missingEmails: [],
    pendingWarmupEmails: [],
    connectedEmails,
    warmedEmails,
    emailAccountIdsToStart: [],
    failure: "",
  };
};
