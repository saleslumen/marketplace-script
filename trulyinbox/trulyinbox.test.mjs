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
  const context = createContext({
    ConnectionApp: {
      getApiKey: async (key) => {
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
  return { api: context, calls };
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
const smtpInput = () => ({
  fromName: "User",
  emailServiceProvider: "other",
  smtp: {
    emailAddress: "user@example.com",
    host: "smtp.example.com",
    port: 587,
    password: "secret-smtp",
    encryption: true,
    userName: "smtp-user",
  },
  imap: {
    emailAddress: "imap-user@example.com",
    host: "imap.example.com",
    port: 993,
    password: "secret-imap",
    encryption: true,
  },
});

test("system calls use documented methods and return the vendor body", async () => {
  const vendor = { ok: false, outcome: "nope", status: "up" };
  const { api, calls } = loadScript({ handler: () => ({ status: 200, body: vendor }) });
  assert.deepEqual(asHost(await api.health()), vendor);
  const healthCall = calls[0];
  assert.equal(healthCall.method, "GET");
  assert.equal(healthCall.muteHttpExceptions, true);
  assert.equal(healthCall.payload, undefined);
  assert.equal(healthCall.headers["X-Api-Key"], API_KEY);
  assert.equal(healthCall.headers["Content-Type"], undefined);
  assert.equal(parseUrl(healthCall.url).origin, "https://lupus-edge.trulyinbox.com");
  assert.equal(parseUrl(healthCall.url).pathname, "/v1/health");
  assert.deepEqual(asHost(await api.getRateLimitStatus()), vendor);
  assert.equal(lastCall(calls).method, "GET");
  assert.equal(parseUrl(lastCall(calls).url).pathname, "/v1/rate-limit");
  assert.deepEqual(asHost(await api.getDashboard()), vendor);
  assert.equal(parseUrl(lastCall(calls).url).pathname, "/v1/dashboard");
  assert.equal(JSON.stringify(vendor).includes(API_KEY), false);
});

test("email account calls send documented paths, query, and body", async () => {
  const vendor = [{ id: 9, tags: ["US"] }];
  const { api, calls } = loadScript({ handler: () => ({ status: 200, body: vendor }) });
  assert.deepEqual(asHost(await api.listEmailAccounts()), vendor);
  assert.equal(parseUrl(lastCall(calls).url).pathname, "/v1/email-accounts");
  assert.deepEqual(parseUrl(lastCall(calls).url).params, {});
  assert.deepEqual(asHost(await api.listEmailAccounts({
    search: "ada",
    sort: "fromEmail",
    sortBy: "ASC",
    status: "active",
    tags: ["US", "Q3"],
  })), vendor);
  const listed = parseUrl(lastCall(calls).url);
  assert.equal(listed.pathname, "/v1/email-accounts");
  assert.equal(listed.params.search, "ada");
  assert.equal(listed.params.sort, "fromEmail");
  assert.equal(listed.params.sortBy, "ASC");
  assert.equal(listed.params.status, "active");
  assert.deepEqual(listed.params.tags, ["US", "Q3"]);
  const connected = asHost(await api.connectSmtpImapAccount(smtpInput()));
  assert.deepEqual(connected, vendor);
  assert.equal(lastCall(calls).method, "POST");
  assert.equal(parseUrl(lastCall(calls).url).pathname, "/v1/email-accounts");
  assert.equal(lastCall(calls).headers["Content-Type"], "application/json");
  assert.deepEqual(lastCall(calls).payload, {
    emailServiceProvider: "other",
    smtp: {
      emailAddress: "user@example.com",
      host: "smtp.example.com",
      port: 587,
      password: "secret-smtp",
      encryption: true,
      userName: "smtp-user",
    },
    imap: {
      host: "imap.example.com",
      port: 993,
      password: "secret-imap",
      encryption: true,
      emailAddress: "imap-user@example.com",
    },
    fromName: "User",
  });
  assert.equal(JSON.stringify(connected).includes("secret-smtp"), false);
  await api.getMicrosoftSingleConsentUrl({ email: "alice@company.com" });
  assert.equal(parseUrl(lastCall(calls).url).pathname, "/v1/email-accounts/microsoft/consent-url");
  assert.equal(parseUrl(lastCall(calls).url).params.email, "alice@company.com");
  await api.disconnectEmailAccount({ emailAccountId: 9 });
  assert.equal(lastCall(calls).method, "POST");
  assert.equal(parseUrl(lastCall(calls).url).pathname, "/v1/email-accounts/9/disconnect");
  assert.equal(lastCall(calls).payload, undefined);
  await api.getEmailAccountStatus({ emailAccountId: 9 });
  assert.equal(lastCall(calls).method, "GET");
  assert.equal(parseUrl(lastCall(calls).url).pathname, "/v1/email-accounts/9/status");
  await api.getBulkEmailAccountStatus({ emailAccountIds: [9, 10] });
  assert.deepEqual(lastCall(calls).payload, { emailAccountIds: [9, 10] });
  assert.equal(parseUrl(lastCall(calls).url).pathname, "/v1/email-accounts/bulk-status");
  await api.assignEmailAccountTags({ emailAccountIds: [9], tags: ["US"] });
  assert.deepEqual(lastCall(calls).payload, { emailAccountIds: [9], tags: ["US"] });
  assert.equal(parseUrl(lastCall(calls).url).pathname, "/v1/email-accounts/tags/assign");
  await api.unassignEmailAccountTags({ emailAccountIds: [9], tags: ["US"] });
  assert.equal(parseUrl(lastCall(calls).url).pathname, "/v1/email-accounts/tags/unassign");
  await api.deleteEmailAccountsBulk({ emailAccountIds: [9] });
  assert.deepEqual(lastCall(calls).payload, { emailAccountIds: [9] });
  assert.equal(parseUrl(lastCall(calls).url).pathname, "/v1/email-accounts/bulk-delete");
});

test("workspace calls keep provider fields and do not invent sync defaults", async () => {
  const vendor = { workspaceId: "ws-1", provider: "microsoft", status: "created" };
  const { api, calls } = loadScript({ handler: () => ({ status: 201, body: vendor }) });
  assert.deepEqual(asHost(await api.getMicrosoftConsentUrl()), vendor);
  assert.equal(parseUrl(lastCall(calls).url).pathname, "/v1/workspaces/microsoft/consent-url");
  assert.deepEqual(parseUrl(lastCall(calls).url).params, {});
  await api.getMicrosoftConsentUrl({ domain: "customer.com" });
  assert.equal(parseUrl(lastCall(calls).url).params.domain, "customer.com");
  assert.deepEqual(asHost(await api.connectWorkspace({ provider: "microsoft", tenantId: "tenant-1" })), vendor);
  assert.equal(lastCall(calls).method, "POST");
  assert.equal(parseUrl(lastCall(calls).url).pathname, "/v1/workspaces");
  assert.deepEqual(lastCall(calls).payload, { provider: "microsoft", tenantId: "tenant-1" });
  await api.connectWorkspace({
    provider: "google",
    adminEmail: "admin@customer.com",
    adminMailboxEmail: "alias@customer.com",
  });
  assert.deepEqual(lastCall(calls).payload, { provider: "google", adminEmail: "admin@customer.com" });
  await api.getWorkspaceSyncPreview({ workspaceId: "ws 1", search: "jane", domain: "a.com,b.com" });
  const preview = parseUrl(lastCall(calls).url);
  assert.equal(preview.pathname, "/v1/workspaces/ws%201/preview");
  assert.equal(preview.params.search, "jane");
  assert.equal(preview.params.domain, "a.com,b.com");
  await api.confirmWorkspaceSync({
    workspaceId: "ws-1",
    selectAll: false,
    emailsToConnect: ["a@b.com"],
    enableWarmup: true,
    tagName: "partner-import",
  });
  assert.equal(lastCall(calls).method, "POST");
  assert.equal(parseUrl(lastCall(calls).url).pathname, "/v1/workspaces/ws-1/sync");
  assert.deepEqual(lastCall(calls).payload, {
    selectAll: false,
    emailsToConnect: ["a@b.com"],
    enableWarmup: true,
    tagName: "partner-import",
  });
  await api.getWorkspaceSyncStatus({ workspaceId: "ws-1", jobId: "job-1" });
  assert.equal(parseUrl(lastCall(calls).url).pathname, "/v1/workspaces/ws-1/sync-status");
  assert.equal(parseUrl(lastCall(calls).url).params.jobId, "job-1");
});

test("warmup deliverability and report calls use documented bodies", async () => {
  const vendor = { marker: "vendor", ok: false, outcome: "nope" };
  const { api, calls } = loadScript({ handler: () => ({ status: 200, body: vendor }) });
  assert.deepEqual(asHost(await api.getWarmupSettings({ emailAccountId: 9 })), vendor);
  assert.equal(parseUrl(lastCall(calls).url).pathname, "/v1/warmup-settings/9");
  assert.deepEqual(asHost(await api.getWarmupStatus({ emailAccountId: 9 })), vendor);
  assert.equal(parseUrl(lastCall(calls).url).pathname, "/v1/warmup-status/9");
  await api.updateWarmupSettings({ emailAccountId: 9, id: 8, strategy: "progressive", googleVolume: 60 });
  assert.equal(lastCall(calls).method, "PATCH");
  assert.equal(parseUrl(lastCall(calls).url).pathname, "/v1/warmup-settings/9");
  assert.deepEqual(lastCall(calls).payload, { strategy: "progressive", googleVolume: 60 });
  await api.startWarmup({ emailAccountId: 42 });
  assert.equal(lastCall(calls).method, "POST");
  assert.equal(parseUrl(lastCall(calls).url).pathname, "/v1/warmup-settings/42/start");
  assert.equal(lastCall(calls).payload, undefined);
  await api.stopWarmup({ emailAccountId: 42 });
  assert.equal(parseUrl(lastCall(calls).url).pathname, "/v1/warmup-settings/42/stop");
  await api.bulkWarmupAction({ action: "stop", emailAccountIds: [9], tags: ["US"] });
  assert.deepEqual(lastCall(calls).payload, { emailAccountIds: [9], tags: ["US"], action: "stop" });
  assert.equal(parseUrl(lastCall(calls).url).pathname, "/v1/warmup-settings/bulk-action");
  await api.getSetupScore({ emailAccountId: 9 });
  assert.equal(parseUrl(lastCall(calls).url).pathname, "/v1/setup-score/9");
  await api.refreshSetupScore({ emailAccountId: 9 });
  assert.equal(lastCall(calls).method, "POST");
  assert.equal(parseUrl(lastCall(calls).url).pathname, "/v1/setup-score/9/refresh");
  assert.equal(lastCall(calls).payload, undefined);
  await api.getDnsHealth({ emailAccountId: 9 });
  assert.equal(parseUrl(lastCall(calls).url).pathname, "/v1/dns-health/9");
  await api.getDeliverabilityScore({
    emailAccountId: 9,
    startDate: "2026-03-01",
    endDate: "2026-03-31",
    esps: ["gmail"],
  });
  assert.equal(parseUrl(lastCall(calls).url).pathname, "/v1/deliverability-score/9");
  assert.deepEqual(lastCall(calls).payload, { startDate: "2026-03-01", endDate: "2026-03-31", esps: ["gmail"] });
  await api.getSingleReport({ emailAccountId: 9, from: "2026-03-01", to: "2026-03-31" });
  assert.equal(parseUrl(lastCall(calls).url).pathname, "/v1/reports");
  assert.deepEqual(lastCall(calls).payload, { emailAccountId: 9, from: "2026-03-01", to: "2026-03-31" });
  await api.getBulkReport({ emailAccountIds: [9], from: "2026-03-01" });
  assert.equal(parseUrl(lastCall(calls).url).pathname, "/v1/reports/bulk");
  assert.deepEqual(lastCall(calls).payload, { emailAccountIds: [9], from: "2026-03-01" });
  await api.exportReport({ from: "2026-03-01", to: "2026-03-31", emailAccountIds: [1, 2] });
  assert.equal(parseUrl(lastCall(calls).url).pathname, "/v1/reports/export");
  assert.deepEqual(lastCall(calls).payload, { emailAccountIds: [1, 2], from: "2026-03-01", to: "2026-03-31" });
});

test("empty success bodies stay empty objects", async () => {
  const { api, calls } = loadScript({
    handler: ({ url, method }) => {
      if (method === "DELETE") return { status: 204, body: "" };
      if (url.endsWith("/start")) return { status: 200, body: "" };
      return { status: 200, body: { marker: "vendor" } };
    },
  });
  assert.deepEqual(asHost(await api.deleteEmailAccount({ emailAccountId: 9 })), {});
  assert.equal(lastCall(calls).method, "DELETE");
  assert.equal(parseUrl(lastCall(calls).url).pathname, "/v1/email-accounts/9");
  assert.deepEqual(asHost(await api.startWarmup({ emailAccountId: 9 })), {});
});

test("required inputs throw before a request and ignore aliases", async () => {
  const { api, calls } = loadScript();
  await assert.rejects(() => api.startWarmup(), /TRULYINBOX_INVALID_INPUT: input must be an object/);
  await assert.rejects(() => api.startWarmup({ id: 9 }), /TRULYINBOX_INVALID_INPUT: emailAccountId is required/);
  await assert.rejects(() => api.startWarmup({ emailAccountId: "9" }), /TRULYINBOX_INVALID_INPUT: emailAccountId is required/);
  await assert.rejects(() => api.connectWorkspace({}), /TRULYINBOX_INVALID_INPUT: provider is required/);
  await assert.rejects(() => api.connectWorkspace({ provider: "google" }), /TRULYINBOX_INVALID_INPUT: adminEmail is required/);
  await assert.rejects(() => api.connectWorkspace({ provider: "microsoft" }), /TRULYINBOX_INVALID_INPUT: tenantId is required/);
  await assert.rejects(() => api.connectWorkspace({ provider: "google", adminEmail: "" }), /TRULYINBOX_INVALID_INPUT: adminEmail is required/);
  await assert.rejects(() => api.confirmWorkspaceSync({ workspaceId: "ws", selectAll: true }), /TRULYINBOX_INVALID_INPUT: enableWarmup is required/);
  await assert.rejects(() => api.confirmWorkspaceSync({ workspaceId: "ws", selectAll: "true", enableWarmup: true }), /TRULYINBOX_INVALID_INPUT: selectAll is required/);
  await assert.rejects(() => api.bulkWarmupAction({ emailAccountIds: [1] }), /TRULYINBOX_INVALID_INPUT: action is required/);
  await assert.rejects(() => api.connectSmtpImapAccount({ emailServiceProvider: "other" }), /TRULYINBOX_INVALID_INPUT: smtp is required/);
  await assert.rejects(() => api.getMicrosoftSingleConsentUrl({}), /TRULYINBOX_INVALID_INPUT: email is required/);
  await assert.rejects(() => api.getWorkspaceSyncStatus({ workspaceId: "ws" }), /TRULYINBOX_INVALID_INPUT: jobId is required/);
  await assert.rejects(() => api.exportReport({ from: "2026-03-01" }), /TRULYINBOX_INVALID_INPUT: to is required/);
  await assert.rejects(() => api.listEmailAccounts({ tags: "US" }), /TRULYINBOX_INVALID_INPUT: tags must be an array of strings/);
  await assert.rejects(() => api.getDeliverabilityScore({ emailAccountId: 1, startDate: "2026-03-01" }), /TRULYINBOX_INVALID_INPUT: endDate is required/);
  await assert.rejects(() => api.assignEmailAccountTags({ emailAccountIds: [1] }), /TRULYINBOX_INVALID_INPUT: tags is required/);
  assert.equal(calls.length, 0);
  assert.equal(api.ensureGoogleWorkspaceWarmup, undefined);
  assert.equal(api.registerGoogleWorkspace, undefined);
  assert.equal(api.registerMicrosoftWorkspace, undefined);
  assert.equal(api.connectEmailAccount, undefined);
  assert.equal(api.connectEmailAccountOAuth, undefined);
  assert.equal(api.getEmailAccount, undefined);
  assert.equal(api.syncWorkspace, undefined);
  assert.equal(api.previewWorkspaceMailboxes, undefined);
  assert.equal(api.getMicrosoftWorkspaceConsentUrl, undefined);
  assert.equal(api.getMicrosoftMailboxConsentUrl, undefined);
  assert.equal(api.getAccountReport, undefined);
  assert.equal(api.getHealth, undefined);
  assert.equal(api.getRateLimit, undefined);
  assert.equal(api.getEmailAccountsBulkStatus, undefined);
});

test("non-2xx errors use status and message and omit the api key", async () => {
  const { api } = loadScript({
    handler: ({ url }) => {
      if (url.endsWith("/start")) return { status: 422, body: { message: `rejected ${API_KEY}`, error_code: "warmup_already_active" } };
      if (url.endsWith("/stop")) return { status: 429, body: { error: "Too many requests" } };
      if (url.endsWith("/health")) return { status: 500, body: "upstream failed" };
      return { status: 400, body: { detail: API_KEY } };
    },
  });
  await assert.rejects(
    () => api.startWarmup({ emailAccountId: 9 }),
    (error) => {
      assert.equal(error.message, "TRULYINBOX_REQUEST_FAILED: 422 rejected [redacted]");
      assert.equal(error.message.includes(API_KEY), false);
      return true;
    },
  );
  await assert.rejects(() => api.stopWarmup({ emailAccountId: 9 }), /TRULYINBOX_REQUEST_FAILED: 429 Too many requests/);
  await assert.rejects(() => api.health(), /TRULYINBOX_REQUEST_FAILED: 500 upstream failed/);
  await assert.rejects(
    () => api.getDashboard(),
    (error) => {
      assert.match(error.message, /^TRULYINBOX_REQUEST_FAILED: 400 /);
      assert.equal(error.message.includes(API_KEY), false);
      return true;
    },
  );
});
