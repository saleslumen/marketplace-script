import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { createContext, runInContext } from "node:vm";

const root = dirname(fileURLToPath(import.meta.url));
const loadScript = ({ handler } = {}) => {
  const calls = [];
  const context = createContext({
    ConnectionApp: {
      getApiKey: async () => "test-key",
    },
    UrlFetchApp: {
      fetch: async (url, options = {}) => {
        const payload = options.payload ? JSON.parse(options.payload) : undefined;
        calls.push({
          url,
          method: String(options.method || "GET").toUpperCase(),
          payload,
          hasApiKey: Boolean(options.headers && options.headers["X-Api-Key"]),
        });
        const result = handler ? await handler({ url, method: String(options.method || "GET").toUpperCase(), payload }) : {};
        const status = Number(result.status) || 200;
        const body = result.body === undefined ? {} : result.body;
        const headers = result.headers || {
          "X-RateLimit-Limit": "20",
          "X-RateLimit-Remaining": "19",
          "X-RateLimit-Reset": "1700000000",
        };
        return {
          getResponseCode: () => status,
          getContentText: () => (typeof body === "string" ? body : JSON.stringify(body)),
          getHeaders: () => headers,
        };
      },
    },
  });
  runInContext(readFileSync(join(root, "http.js"), "utf8"), context);
  for (const fileName of readdirSync(root).filter((name) => name.endsWith(".js") && name !== "http.js").sort()) {
    runInContext(readFileSync(join(root, fileName), "utf8"), context);
  }
  return { api: context, calls };
};
const lastCall = (calls) => calls[calls.length - 1];
const pathOf = (url) => String(url).replace("https://lupus-edge.trulyinbox.com/v1", "");

test("new functions use documented methods and paths without live network", async () => {
  const { api, calls } = loadScript({
    handler: ({ url }) => {
      if (url.endsWith("/health")) return { status: 200, body: {} };
      if (url.endsWith("/rate-limit")) return { status: 200, body: {} };
      if (url.includes("/workspaces/microsoft/consent-url")) return { status: 200, body: { url: "https://login.microsoftonline.com/consent", tenantId: "tenant-1" } };
      if (url.includes("/email-accounts/microsoft/consent-url")) return { status: 200, body: { url: "https://login.microsoftonline.com/mailbox", expiresAt: "2026-08-13T12:30:00.000Z" } };
      if (url.endsWith("/workspaces") ) return { status: 201, body: { workspaceId: "ws-1", provider: "microsoft", tenantId: "tenant-1", status: "created" } };
      if (url.endsWith("/email-accounts/oauth")) return { status: 501, body: { error_code: "not_implemented", message: "not_implemented" } };
      if (url.endsWith("/email-accounts") && !url.includes("?")) return { status: 201, body: { emailAccountId: 9, fromEmail: "user@example.com", fromName: "User", type: "smtp-imap", status: "active" } };
      if (url.endsWith("/disconnect")) return { status: 200, body: { emailAccountId: 9, status: "disconnected" } };
      if (url.includes("/email-accounts/9") && !url.includes("disconnect")) return { status: 204, body: "" };
      if (url.endsWith("/bulk-status")) return { status: 200, body: { results: [{ emailAccountId: 9, fromEmail: "user@example.com", type: "smtp-imap", authStatus: "connected", warmupStatus: "paused" }] } };
      if (url.endsWith("/bulk-delete")) return { status: 200, body: { results: [{ emailAccountId: 9, deleted: true }] } };
      if (url.endsWith("/tags/assign") || url.endsWith("/tags/unassign")) return { status: 200, body: [{ id: 9, fromEmail: "user@example.com", fromName: "User", type: "smtp-imap", status: "active", createdAt: "2026-01-01T00:00:00.000Z", tags: ["ns-1"] }] };
      if (url.endsWith("/stop")) return { status: 200, body: {} };
      if (url.endsWith("/bulk-action")) return { status: 200, body: { results: [{ emailAccountId: 9, status: "ok" }] } };
      if (url.includes("/setup-score/9/refresh")) return { status: 200, body: { emailAccountId: 9, emailAccountScore: 80 } };
      if (url.endsWith("/setup-score/9")) return { status: 200, body: { emailAccountId: 9, emailAccountScore: 80, spf: true } };
      if (url.endsWith("/dns-health/9")) return { status: 200, body: { emailAccountId: 9, spf: "pass", dkim: "pass", dmarc: "fail", mx: "pass" } };
      if (url.includes("/deliverability-score/9")) return { status: 200, body: { emailAccountId: 9, totalDeliverabilityRate: 88, totalSentCount: 10, totalInboxCount: 8, totalSpamInboxCount: 2 } };
      if (url.endsWith("/reports/bulk")) return { status: 200, body: { reports: [{ emailAccountId: 9, from: "2026-03-01", to: "2026-03-31", days: [] }] } };
      if (url.endsWith("/reports/export")) return { status: 202, body: { jobId: "exp-1", status: "queued" } };
      if (url.endsWith("/reports")) return { status: 200, body: { emailAccountId: 9, from: "2026-03-01", to: "2026-03-31", days: [] } };
      if (url.endsWith("/dashboard")) return { status: 200, body: { totalAccounts: 1, activeWarmups: 0, pausedWarmups: 1, accountsWithErrors: 0, avgSetupScore: 80 } };
      return { status: 200, body: {} };
    },
  });
  const health = await api.getHealth();
  assert.equal(health.ok, true);
  assert.equal(health.outcome, "HEALTH");
  assert.equal(lastCall(calls).method, "GET");
  assert.equal(pathOf(lastCall(calls).url), "/health");
  const rate = await api.getRateLimit();
  assert.equal(rate.ok, true);
  assert.equal(rate.outcome, "RATE_LIMIT");
  assert.equal(rate.limit, "20");
  assert.equal(pathOf(lastCall(calls).url), "/rate-limit");
  const tenantConsent = await api.getMicrosoftWorkspaceConsentUrl({ domain: "customer.com" });
  assert.equal(tenantConsent.ok, true);
  assert.equal(tenantConsent.tenantId, "tenant-1");
  assert.match(lastCall(calls).url, /\/workspaces\/microsoft\/consent-url\?domain=customer\.com$/);
  const registered = await api.registerMicrosoftWorkspace({ tenantId: "tenant-1" });
  assert.equal(registered.ok, true);
  assert.deepEqual(lastCall(calls).payload, { provider: "microsoft", tenantId: "tenant-1" });
  const mailboxConsent = await api.getMicrosoftMailboxConsentUrl({ email: "alice@company.com" });
  assert.equal(mailboxConsent.ok, true);
  assert.match(lastCall(calls).url, /\/email-accounts\/microsoft\/consent-url\?email=alice%40company\.com$/);
  const connected = await api.connectSmtpImapAccount({
    emailServiceProvider: "other",
    fromName: "User",
    smtp: { emailAddress: "user@example.com", host: "smtp.example.com", port: 587, password: "secret-smtp", encryption: true, userName: "smtp-user" },
    imap: { host: "imap.example.com", port: 993, password: "secret-imap", encryption: true },
  });
  assert.equal(connected.ok, true);
  assert.equal(connected.emailAccountId, "9");
  assert.equal(JSON.stringify(connected).includes("secret-smtp"), false);
  assert.equal(JSON.stringify(connected).includes("secret-imap"), false);
  assert.deepEqual(lastCall(calls).payload, {
    emailServiceProvider: "other",
    smtp: { emailAddress: "user@example.com", host: "smtp.example.com", port: 587, password: "secret-smtp", encryption: true, userName: "smtp-user" },
    imap: { host: "imap.example.com", port: 993, password: "secret-imap", encryption: true },
    fromName: "User",
  });
  const disconnected = await api.disconnectEmailAccount({ emailAccountId: "9" });
  assert.equal(disconnected.outcome, "DISCONNECTED");
  assert.equal(lastCall(calls).method, "POST");
  assert.equal(pathOf(lastCall(calls).url), "/email-accounts/9/disconnect");
  const deleted = await api.deleteEmailAccount({ emailAccountId: "9" });
  assert.equal(deleted.outcome, "DELETED");
  assert.equal(lastCall(calls).method, "DELETE");
  assert.equal(pathOf(lastCall(calls).url), "/email-accounts/9");
  const bulkStatus = await api.getEmailAccountsBulkStatus({ emailAccountIds: [9] });
  assert.equal(bulkStatus.ok, true);
  assert.deepEqual(lastCall(calls).payload, { emailAccountIds: [9] });
  const bulkDelete = await api.deleteEmailAccountsBulk({ emailAccountIds: ["9"] });
  assert.equal(bulkDelete.ok, true);
  assert.deepEqual(lastCall(calls).payload, { emailAccountIds: [9] });
  const tagged = await api.assignEmailAccountTags({ emailAccountIds: [9], tags: ["ns-1"] });
  assert.equal(tagged.outcome, "TAGS_ASSIGNED");
  assert.deepEqual(lastCall(calls).payload, { emailAccountIds: [9], tags: ["ns-1"] });
  const untagged = await api.unassignEmailAccountTags({ emailAccountIds: [9], tags: ["ns-1"] });
  assert.equal(untagged.outcome, "TAGS_UNASSIGNED");
  assert.equal(pathOf(lastCall(calls).url), "/email-accounts/tags/unassign");
  const stopped = await api.stopWarmup({ emailAccountId: "9" });
  assert.equal(stopped.outcome, "WARMUP_STOPPED");
  assert.equal(lastCall(calls).method, "POST");
  assert.equal(pathOf(lastCall(calls).url), "/warmup-settings/9/stop");
  const bulkWarmup = await api.bulkWarmupAction({ action: "stop", emailAccountIds: [9], tags: ["ns-1"] });
  assert.equal(bulkWarmup.ok, true);
  assert.deepEqual(lastCall(calls).payload, { action: "stop", emailAccountIds: [9], tags: ["ns-1"] });
  const setup = await api.getSetupScore({ emailAccountId: "9" });
  assert.equal(setup.spf, true);
  assert.equal(pathOf(lastCall(calls).url), "/setup-score/9");
  await api.refreshSetupScore({ emailAccountId: "9" });
  assert.equal(lastCall(calls).method, "POST");
  assert.equal(pathOf(lastCall(calls).url), "/setup-score/9/refresh");
  await api.getDnsHealth({ emailAccountId: "9" });
  assert.equal(pathOf(lastCall(calls).url), "/dns-health/9");
  await api.getDeliverabilityScore({ emailAccountId: "9", startDate: "2026-03-01", endDate: "2026-03-31", esps: ["gmail"] });
  assert.deepEqual(lastCall(calls).payload, { startDate: "2026-03-01", endDate: "2026-03-31", esps: ["gmail"] });
  await api.getAccountReport({ emailAccountId: "9", from: "2026-03-01", to: "2026-03-31" });
  assert.deepEqual(lastCall(calls).payload, { emailAccountId: 9, from: "2026-03-01", to: "2026-03-31" });
  await api.getBulkReport({ emailAccountIds: [9], from: "2026-03-01", to: "2026-03-31" });
  assert.equal(pathOf(lastCall(calls).url), "/reports/bulk");
  const exported = await api.exportReport({ from: "2026-03-01", to: "2026-03-31" });
  assert.equal(exported.jobId, "exp-1");
  assert.deepEqual(lastCall(calls).payload, { from: "2026-03-01", to: "2026-03-31" });
  const dashboard = await api.getDashboard();
  assert.equal(dashboard.totalAccounts, 1);
  assert.equal(pathOf(lastCall(calls).url), "/dashboard");
  const oauth = await api.connectEmailAccountOAuth();
  assert.equal(oauth.ok, false);
  assert.equal(oauth.outcome, "NOT_IMPLEMENTED");
  assert.equal(oauth.retryable, false);
  assert.equal(lastCall(calls).method, "POST");
  assert.equal(pathOf(lastCall(calls).url), "/email-accounts/oauth");
  assert.equal(lastCall(calls).payload, undefined);
  assert.equal(typeof api.microsoftOAuthCallback, "undefined");
});
test("health and rate-limit keep the script envelope over a colliding vendor body", async () => {
  const { api } = loadScript({
    handler: ({ url }) => {
      if (url.endsWith("/health")) {
        return { status: 200, body: { ok: false, outcome: "nope", retryable: true, failure: "x" } };
      }
      if (url.endsWith("/rate-limit")) {
        return {
          status: 200,
          body: { ok: false, outcome: "nope", retryable: true, failure: "x", limit: "1", remaining: "0", reset: "9" },
          headers: {
            "X-RateLimit-Limit": "20",
            "X-RateLimit-Remaining": "19",
            "X-RateLimit-Reset": "1700000000",
          },
        };
      }
      return { status: 200, body: {} };
    },
  });
  const health = await api.getHealth();
  assert.equal(health.ok, true);
  assert.equal(health.outcome, "HEALTH");
  assert.equal(health.retryable, false);
  assert.equal(health.failure, "");
  assert.deepEqual(Object.keys(health).sort(), ["failure", "ok", "outcome", "retryable"]);
  const rate = await api.getRateLimit();
  assert.equal(rate.ok, true);
  assert.equal(rate.outcome, "RATE_LIMIT");
  assert.equal(rate.retryable, false);
  assert.equal(rate.failure, "");
  assert.equal(rate.limit, "20");
  assert.equal(rate.remaining, "19");
  assert.equal(rate.reset, "1700000000");
});

test("429 is retryable and existing startWarmup path is unchanged", async () => {
  const { api, calls } = loadScript({
    handler: ({ url }) => {
      if (url.endsWith("/start")) return { status: 200, body: {} };
      return { status: 429, body: { message: "Too many requests" } };
    },
  });
  const limited = await api.stopWarmup({ emailAccountId: "9" });
  assert.equal(limited.ok, false);
  assert.equal(limited.outcome, "RATE_LIMITED");
  assert.equal(limited.retryable, true);
  const started = await api.startWarmup({ emailAccountId: "42" });
  assert.equal(started.ok, true);
  assert.equal(started.outcome, "WARMUP_STARTED");
  assert.equal(pathOf(lastCall(calls).url), "/warmup-settings/42/start");
  assert.equal(lastCall(calls).method, "POST");
});

test("connectSmtpImapAccount and bulkWarmupAction fail closed on missing documented fields", async () => {
  const { api, calls } = loadScript();
  const missingSmtp = await api.connectSmtpImapAccount({ emailServiceProvider: "other" });
  assert.equal(missingSmtp.outcome, "MISSING_SMTP_IMAP");
  assert.equal(calls.length, 0);
  const missingAction = await api.bulkWarmupAction({ emailAccountIds: [1] });
  assert.equal(missingAction.outcome, "MISSING_WARMUP_ACTION");
  assert.equal(calls.length, 0);
});
