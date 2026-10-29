import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { createContext, runInContext } from "node:vm";

const root = dirname(fileURLToPath(import.meta.url));
const API_KEY = "test-key";
const loadScript = ({ handler } = {}) => {
  const calls = [];
  let apiKeyReads = 0;
  const context = createContext({
    ConnectionApp: {
      getApiKey: async (key) => {
        apiKeyReads += 1;
        if (key !== "trulyinbox") throw new Error(`AUTH_NOT_CONNECTED: ${key}`);
        return API_KEY;
      },
    },
    UrlFetchApp: {
      fetch: async (url, options = {}) => {
        const payload = options.payload === undefined ? undefined : JSON.parse(options.payload);
        calls.push({
          url,
          method: String(options.method || "GET").toUpperCase(),
          payload,
          headers: options.headers || {},
          muteHttpExceptions: options.muteHttpExceptions === true,
        });
        const result = handler
          ? await handler({
            url,
            method: String(options.method || "GET").toUpperCase(),
            payload,
            headers: options.headers || {},
          })
          : { status: 200, body: { marker: "vendor" } };
        const status = Number(result.status) || 200;
        const body = result.body === undefined ? {} : result.body;
        return {
          getResponseCode: () => status,
          getContentText: () => (typeof body === "string" ? body : JSON.stringify(body)),
          getHeaders: () => result.headers || {},
        };
      },
    },
  });
  runInContext(readFileSync(join(root, "http.js"), "utf8"), context);
  for (const name of readdirSync(root).filter((file) => file.endsWith(".js") && file !== "http.js").sort()) {
    runInContext(readFileSync(join(root, name), "utf8"), context);
  }
  return { api: context, calls, apiKeyReads: () => apiKeyReads };
};
const lastCall = (calls) => calls[calls.length - 1];
const asHost = (value) => JSON.parse(JSON.stringify(value));
const parseUrl = (url) => {
  const parsed = new URL(url);
  const params = {};
  parsed.searchParams.forEach((value, key) => {
    if (params[key] === undefined) params[key] = value;
    else if (Array.isArray(params[key])) params[key].push(value);
    else params[key] = [params[key], value];
  });
  return { origin: parsed.origin, pathname: parsed.pathname, params };
};
const ws = { workspaceId: 7 };
const account = { workspaceId: 7, id: 9 };

test("every operation returns the vendor body on the documented route", async () => {
  const vendor = { data: { marker: "vendor" }, meta: { request_id: "req_1" } };
  const { api, calls, apiKeyReads } = loadScript({ handler: () => ({ status: 200, body: vendor }) });
  const operations = [
    ["health", "GET", "/v2/health"],
    ["getRateLimitStatus", "GET", "/v2/workspaces/7/rate-limit", ws],
    ["getBulkEmailAccountStatus", "POST", "/v2/workspaces/7/accounts/bulk-status", { ...ws, accountIds: [9] }],
    ["bulkUpdateAccountTags", "POST", "/v2/workspaces/7/accounts/bulk/tags", { ...ws, ids: [9] }],
    ["listEmailAccounts", "GET", "/v2/workspaces/7/accounts", ws],
    ["connectEmailAccount", "POST", "/v2/workspaces/7/accounts", {
      ...ws,
      emailAddress: "user@example.com",
      smtpHost: "smtp.example.com",
      smtpPort: 587,
      smtpEncryption: "TLS",
      imapHost: "imap.example.com",
      imapPort: 993,
      imapEncryption: "SSL",
      smtpUsername: "user@example.com",
      password: "secret",
    }],
    ["getEmailAccountOauthUrl", "POST", "/v2/workspaces/7/accounts/oauth-url", { ...ws, provider: "gmail" }],
    ["connectPartnerOauthAccount", "POST", "/v2/workspaces/7/accounts/oauth", {
      ...ws,
      provider: "gmail",
      emailAddress: "user@example.com",
      accessToken: "token",
      expiresAt: "2026-10-25T00:00:00Z",
    }],
    ["getMicrosoftMailboxConsentUrl", "GET", "/v2/workspaces/7/accounts/microsoft/consent-url", { ...ws, email: "a@b.com" }],
    ["getEmailAccount", "GET", "/v2/workspaces/7/accounts/9", account],
    ["deleteEmailAccount", "DELETE", "/v2/workspaces/7/accounts/9", account],
    ["getEmailAccountOverview", "GET", "/v2/workspaces/7/accounts/9/overview", account],
    ["disconnectEmailAccount", "POST", "/v2/workspaces/7/accounts/9/disconnect", account],
    ["listTags", "GET", "/v2/workspaces/7/tags", ws],
    ["createTag", "POST", "/v2/workspaces/7/tags", { ...ws, name: "US" }],
    ["setAccountTags", "PUT", "/v2/workspaces/7/accounts/9/tags", { ...account, tags: ["US"] }],
    ["getMicrosoftConsentUrl", "GET", "/v2/workspaces/7/provider-workspaces/microsoft/consent-url", ws],
    ["listProviderWorkspaces", "GET", "/v2/workspaces/7/provider-workspaces", ws],
    ["registerProviderWorkspace", "POST", "/v2/workspaces/7/provider-workspaces", { ...ws, provider: "google", adminEmail: "admin@b.com" }],
    ["previewProviderWorkspace", "GET", "/v2/workspaces/7/provider-workspaces/4/preview", { ...ws, providerWorkspaceId: 4 }],
    ["syncProviderWorkspace", "POST", "/v2/workspaces/7/provider-workspaces/4/sync", { ...ws, providerWorkspaceId: 4, selectAll: true, enableWarmup: false }],
    ["getProviderWorkspaceSyncStatus", "GET", "/v2/workspaces/7/provider-workspaces/4/sync-status", { ...ws, providerWorkspaceId: 4, jobId: "job 1" }],
    ["listWorkspaces", "GET", "/v2/workspaces"],
    ["createWorkspace", "POST", "/v2/workspaces", { name: "Acme" }],
    ["listWorkspaceQuotas", "GET", "/v2/workspaces/quotas"],
    ["updateWorkspaceQuotas", "PATCH", "/v2/workspaces/quotas", { quotas: [{ workspaceId: 7, dailyWarmupBudget: 20 }] }],
    ["getWorkspace", "GET", "/v2/workspaces/7", ws],
    ["updateWorkspace", "PATCH", "/v2/workspaces/7", { ...ws, name: "Acme" }],
    ["listMembers", "GET", "/v2/workspaces/7/members", ws],
    ["inviteMember", "POST", "/v2/workspaces/7/members/invite", { ...ws, email: "a@b.com", role: "member" }],
    ["updateMemberRole", "PATCH", "/v2/workspaces/7/members/3", { ...ws, userId: 3, role: "admin" }],
    ["removeMember", "DELETE", "/v2/workspaces/7/members/3", { ...ws, userId: 3 }],
    ["getBillingSummary", "GET", "/v2/workspaces/7/billing/summary", ws],
    ["getBillingCapabilities", "GET", "/v2/workspaces/7/billing/capabilities", ws],
    ["bulkEnableWarmup", "POST", "/v2/workspaces/7/accounts/bulk/warmup/enable", { ...ws, ids: [9] }],
    ["bulkPauseWarmup", "POST", "/v2/workspaces/7/accounts/bulk/warmup/pause", { ...ws, ids: [9] }],
    ["getWarmupStatus", "GET", "/v2/workspaces/7/accounts/9/warmup", account],
    ["getWarmupActivity", "GET", "/v2/workspaces/7/accounts/9/warmup/activity", account],
    ["getWarmupSettings", "GET", "/v2/workspaces/7/accounts/9/warmup/settings", account],
    ["updateWarmupSettings", "PATCH", "/v2/workspaces/7/accounts/9/warmup/settings", account],
    ["enableWarmup", "POST", "/v2/workspaces/7/accounts/9/warmup/enable", account],
    ["pauseWarmup", "POST", "/v2/workspaces/7/accounts/9/warmup/pause", account],
    ["resumeWarmup", "POST", "/v2/workspaces/7/accounts/9/warmup/resume", account],
    ["getDnsHealth", "GET", "/v2/workspaces/7/accounts/9/dns", account],
    ["getSetupScore", "GET", "/v2/workspaces/7/accounts/9/setup-score", account],
    ["refreshSetupScore", "POST", "/v2/workspaces/7/accounts/9/setup-score/refresh", account],
    ["getAccountDeliverability", "GET", "/v2/workspaces/7/accounts/9/deliverability", account],
    ["getAccountStats", "GET", "/v2/workspaces/7/accounts/9/analytics/stats", account],
  ];
  assert.equal(operations.length, 48);
  for (const [name, method, pathname, input] of operations) {
    const before = calls.length;
    assert.deepEqual(asHost(await api[name](input)), vendor);
    const call = calls[before];
    assert.equal(call.method, method, name);
    assert.equal(call.muteHttpExceptions, true, name);
    assert.equal(parseUrl(call.url).origin, "https://lynx-api.trulyinbox.com", name);
    assert.equal(parseUrl(call.url).pathname, pathname, name);
    assert.equal(call.headers["X-Api-Key"], undefined, name);
    if (name === "health") {
      assert.equal(call.headers.Authorization, undefined, name);
    } else {
      assert.equal(call.headers.Authorization, `Bearer ${API_KEY}`, name);
    }
  }
  assert.equal(apiKeyReads(), 47);
  assert.equal(JSON.stringify(vendor).includes(API_KEY), false);
});

test("requests send documented query names and body fields", async () => {
  const vendor = { data: { id: 9 }, meta: { request_id: "req_1" } };
  const { api, calls } = loadScript({ handler: () => ({ status: 200, body: vendor }) });
  await api.listEmailAccounts({
    workspaceId: 7,
    page: 2,
    limit: 25,
    status: ["active", "paused"],
    provider: ["gmail"],
    q: "ada",
    sortBy: "email",
    sortDir: "asc",
    tags: ["US", "Q3"],
    esp: "custom",
    domain: "example.com",
    outreachReadiness: ["ready"],
  });
  const listed = parseUrl(lastCall(calls).url);
  assert.equal(listed.params.page, "2");
  assert.equal(listed.params.limit, "25");
  assert.deepEqual(listed.params.status, ["active", "paused"]);
  assert.equal(listed.params.provider, "gmail");
  assert.equal(listed.params.q, "ada");
  assert.equal(listed.params.sortBy, "email");
  assert.equal(listed.params.sortDir, "asc");
  assert.deepEqual(listed.params.tags, ["US", "Q3"]);
  assert.equal(listed.params.esp, "custom");
  assert.equal(listed.params.domain, "example.com");
  assert.equal(listed.params.outreachReadiness, "ready");
  assert.equal(lastCall(calls).payload, undefined);
  await api.connectEmailAccount({
    workspaceId: 7,
    emailAddress: "user@example.com",
    senderName: "User",
    smtpHost: "smtp.example.com",
    smtpPort: 587,
    smtpEncryption: "TLS",
    imapHost: "imap.example.com",
    imapPort: 993,
    imapEncryption: "SSL",
    smtpUsername: "smtp-user",
    password: "secret-smtp",
    espPresetId: "zoho",
  });
  assert.equal(lastCall(calls).headers["Content-Type"], "application/json");
  assert.deepEqual(lastCall(calls).payload, {
    emailAddress: "user@example.com",
    smtpHost: "smtp.example.com",
    smtpPort: 587,
    smtpEncryption: "TLS",
    imapHost: "imap.example.com",
    imapPort: 993,
    imapEncryption: "SSL",
    smtpUsername: "smtp-user",
    password: "secret-smtp",
    senderName: "User",
    espPresetId: "zoho",
  });
  await api.getMicrosoftMailboxConsentUrl({ workspaceId: 7, email: "alice@company.com" });
  assert.equal(parseUrl(lastCall(calls).url).params.email, "alice@company.com");
  await api.getMicrosoftConsentUrl({ workspaceId: 7, domain: "customer.com" });
  assert.equal(parseUrl(lastCall(calls).url).params.domain, "customer.com");
  await api.previewProviderWorkspace({ workspaceId: 7, providerWorkspaceId: 4, search: "jane", domain: ["a.com", "b.com"] });
  assert.equal(parseUrl(lastCall(calls).url).params.domain, "[\"a.com\",\"b.com\"]");
  assert.equal(parseUrl(lastCall(calls).url).params.search, "jane");
  await api.syncProviderWorkspace({
    workspaceId: 7,
    providerWorkspaceId: 4,
    selectAll: false,
    emailsToConnect: ["a@b.com"],
    enableWarmup: true,
  });
  assert.deepEqual(lastCall(calls).payload, { selectAll: false, enableWarmup: true, emailsToConnect: ["a@b.com"] });
  await api.getProviderWorkspaceSyncStatus({ workspaceId: 7, providerWorkspaceId: 4, jobId: "job 1" });
  assert.equal(parseUrl(lastCall(calls).url).pathname, "/v2/workspaces/7/provider-workspaces/4/sync-status");
  assert.equal(parseUrl(lastCall(calls).url).params.jobId, "job 1");
  await api.registerProviderWorkspace({ workspaceId: 7, provider: "microsoft", tenantId: "tenant-1", state: "state-1" });
  assert.deepEqual(lastCall(calls).payload, { provider: "microsoft", tenantId: "tenant-1", state: "state-1" });
  await api.updateWarmupSettings({
    workspaceId: 7,
    id: 9,
    strategy: "progressive",
    warmupMaxLimit: 30,
    timezone: "UTC",
    templateCollectionId: null,
    schedule: [{ dayOfWeek: 0, slotIndex: 0, weight: 100, enabled: true, startTime: "09:00", endTime: "17:00" }],
  });
  assert.deepEqual(lastCall(calls).payload, {
    warmupMaxLimit: 30,
    timezone: "UTC",
    templateCollectionId: null,
    schedule: [{ dayOfWeek: 0, slotIndex: 0, weight: 100, enabled: true, startTime: "09:00", endTime: "17:00" }],
  });
  await api.getAccountStats({ workspaceId: 7, id: 9, days: 30 });
  assert.equal(parseUrl(lastCall(calls).url).pathname, "/v2/workspaces/7/accounts/9/analytics/stats");
  assert.equal(parseUrl(lastCall(calls).url).params.days, "30");
  await api.bulkUpdateAccountTags({ workspaceId: 7, ids: [9], addTags: ["US"] });
  assert.deepEqual(lastCall(calls).payload, { ids: [9], addTags: ["US"] });
  await api.updateWorkspaceQuotas({ quotas: [{ workspaceId: 7, dailyWarmupBudget: 20, extra: true }] });
  assert.deepEqual(lastCall(calls).payload, { quotas: [{ workspaceId: 7, dailyWarmupBudget: 20 }] });
});

test("empty success bodies stay empty", async () => {
  const { api, calls } = loadScript({
    handler: ({ method }) => (method === "DELETE" ? { status: 204, body: "" } : { status: 200, body: "" }),
  });
  assert.equal(await api.deleteEmailAccount(account), undefined);
  assert.equal(lastCall(calls).method, "DELETE");
  assert.equal(lastCall(calls).payload, undefined);
  assert.equal(await api.enableWarmup(account), undefined);
  assert.equal(lastCall(calls).payload, undefined);
  assert.equal(lastCall(calls).headers["Content-Type"], undefined);
});

test("required inputs throw before a request", async () => {
  const { api, calls } = loadScript();
  await assert.rejects(() => api.enableWarmup(), /TRULYINBOX_INVALID_INPUT: input must be an object/);
  await assert.rejects(() => api.enableWarmup({ id: 9 }), /TRULYINBOX_INVALID_INPUT: workspaceId is required/);
  await assert.rejects(() => api.enableWarmup({ workspaceId: "7", id: 9 }), /TRULYINBOX_INVALID_INPUT: workspaceId is required/);
  await assert.rejects(() => api.enableWarmup({ workspaceId: 7 }), /TRULYINBOX_INVALID_INPUT: id is required/);
  await assert.rejects(() => api.connectEmailAccount({ workspaceId: 7 }), /TRULYINBOX_INVALID_INPUT: emailAddress is required/);
  await assert.rejects(() => api.registerProviderWorkspace({ workspaceId: 7, provider: "google" }), /TRULYINBOX_INVALID_INPUT: adminEmail is required/);
  await assert.rejects(() => api.registerProviderWorkspace({ workspaceId: 7, provider: "microsoft", tenantId: "t" }), /TRULYINBOX_INVALID_INPUT: state is required/);
  await assert.rejects(() => api.syncProviderWorkspace({ workspaceId: 7, providerWorkspaceId: 4, selectAll: true }), /TRULYINBOX_INVALID_INPUT: enableWarmup is required/);
  await assert.rejects(() => api.getAccountStats({ workspaceId: 7, id: 9, days: "30" }), /TRULYINBOX_INVALID_INPUT: days must be a number/);
  await assert.rejects(() => api.listEmailAccounts({ workspaceId: 7, tags: "US" }), /TRULYINBOX_INVALID_INPUT: tags must be an array of strings/);
  await assert.rejects(() => api.getBulkEmailAccountStatus({ workspaceId: 7, accountIds: ["9"] }), /TRULYINBOX_INVALID_INPUT: accountIds must be an array of numbers/);
  await assert.rejects(() => api.updateWorkspaceQuotas({ quotas: [{ workspaceId: 7 }] }), /TRULYINBOX_INVALID_INPUT: quotas.dailyWarmupBudget is required/);
  assert.equal(calls.length, 0);
  assert.equal(api.connectSmtpImapAccount, undefined);
  assert.equal(api.deleteEmailAccountsBulk, undefined);
  assert.equal(api.getDashboard, undefined);
  assert.equal(api.exportReport, undefined);
  assert.equal(api.startWarmup, undefined);
  assert.equal(api.stopWarmup, undefined);
  assert.equal(api.bulkWarmupAction, undefined);
  assert.equal(api.assignEmailAccountTags, undefined);
  assert.equal(api.unassignEmailAccountTags, undefined);
  assert.equal(api.getDeliverabilityInsights, undefined);
  assert.equal(api.getWarmupTrends, undefined);
  assert.equal(api.getBulkAccountStats, undefined);
  assert.equal(api.listNotifications, undefined);
  assert.equal(api.markAllNotificationsRead, undefined);
  assert.equal(api.markNotificationRead, undefined);
});

test("non-2xx errors use the v2 error message and omit the api key", async () => {
  const { api } = loadScript({
    handler: ({ url }) => {
      if (url.endsWith("/warmup/enable")) return { status: 422, body: { error: { code: "invalid_request", message: `rejected ${API_KEY}` }, meta: { request_id: "req_1" } } };
      if (url.endsWith("/warmup/pause")) return { status: 429, body: { success: false, data: null, errorCode: "150005", errorMessage: `Read limit ${API_KEY}` } };
      if (url.endsWith("/warmup/resume")) return { status: 429, body: { success: false, data: null, errorCode: "150005", errorMessage: null } };
      if (url.endsWith("/health")) return { status: 500, body: "upstream failed" };
      return { status: 400, body: { detail: API_KEY } };
    },
  });
  await assert.rejects(
    () => api.enableWarmup(account),
    (error) => {
      assert.equal(error.message, "TRULYINBOX_REQUEST_FAILED: 422 rejected [redacted]");
      assert.equal(error.message.includes(API_KEY), false);
      return true;
    },
  );
  await assert.rejects(() => api.pauseWarmup(account), /TRULYINBOX_REQUEST_FAILED: 429 Read limit \[redacted\]/);
  await assert.rejects(() => api.resumeWarmup(account), /TRULYINBOX_REQUEST_FAILED: 429 150005/);
  await assert.rejects(() => api.health(), /TRULYINBOX_REQUEST_FAILED: 500 upstream failed/);
  await assert.rejects(
    () => api.getRateLimitStatus(ws),
    (error) => {
      assert.match(error.message, /^TRULYINBOX_REQUEST_FAILED: 400 /);
      assert.equal(error.message.includes(API_KEY), false);
      return true;
    },
  );
});
