import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { createContext, runInContext } from "node:vm";

const root = dirname(fileURLToPath(import.meta.url));
const base = "https://api.zapmail.ai/api";
const okBody = { status: 200, message: "ok", data: { id: "ws-1" } };
const loadScript = (handler) => {
  const calls = [];
  const context = createContext({
    ConnectionApp: { getApiKey: async (key) => (key === "zapmail" ? "vault-zapmail-key" : "") },
    UrlFetchApp: {
      fetch: async (url, options = {}) => {
        calls.push({
          url,
          method: String(options.method || "GET").toUpperCase(),
          payload: options.payload,
          headers: options.headers || {},
          muteHttpExceptions: options.muteHttpExceptions === true,
        });
        const result = await handler({ url, method: String(options.method || "GET").toUpperCase(), calls });
        const body = result.body === undefined ? okBody : result.body;
        return {
          getResponseCode: () => Number(result.status) || 200,
          getContentText: () => (typeof body === "string" ? body : JSON.stringify(body)),
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
const ok = () => loadScript(() => ({ body: okBody }));
const billing = {
  firstName: "Ada",
  lastName: "Lovelace",
  company: "Analytical",
  addressLineOne: "1 Street",
  addressLineTwo: "Suite 2",
  addressLineThree: null,
  city: "London",
  state: "London",
  country: "UK",
  postalCode: "EC1",
  phoneCc: "44",
  phone: "2012345678",
  workspaceId: "ws-body",
};

test("workspace, user, billing, and wallet operations encode method, path, headers, and body", async () => {
  const script = ok();
  const listed = await script.api.listWorkspaces({ page: "1", limit: "10", contains: "Acme", "x-workspace-key": "ws-1", serviceProvider: "GOOGLE" });
  assert.equal(JSON.stringify(listed), JSON.stringify(okBody));
  assert.equal(script.calls[0].method, "GET");
  assert.equal(script.calls[0].url, `${base}/v2/workspaces?page=1&limit=10&contains=Acme`);
  assert.equal(script.calls[0].payload, undefined);
  assert.equal(script.calls[0].muteHttpExceptions, true);
  assert.equal(script.calls[0].headers["x-auth-zapmail"], "vault-zapmail-key");
  assert.equal(script.calls[0].headers.Accept, "application/json");
  assert.equal(script.calls[0].headers["Content-Type"], undefined);
  assert.equal(script.calls[0].headers["x-workspace-key"], "ws-1");
  assert.equal(script.calls[0].headers["x-service-provider"], "GOOGLE");
  await script.api.createWorkspace({ name: "  Acme  ", billingDetails: { company: "Acme" }, extra: true, serviceProvider: "MICROSOFT" });
  assert.equal(script.calls[1].method, "POST");
  assert.equal(script.calls[1].url, `${base}/v2/workspaces`);
  assert.equal(script.calls[1].headers["x-service-provider"], "MICROSOFT");
  assert.equal(script.calls[1].headers["x-workspace-key"], undefined);
  assert.deepEqual(JSON.parse(script.calls[1].payload), { name: "Acme", billingDetails: { company: "Acme" }, extra: true });
  await script.api.getUser({ serviceProvider: "GOOGLE" });
  assert.equal(script.calls[2].method, "GET");
  assert.equal(script.calls[2].url, `${base}/v2/users`);
  assert.equal(script.calls[2].headers["x-service-provider"], "GOOGLE");
  await script.api.createBillingDetails({ ...billing, "x-workspace-key": "ws-1", serviceProvider: "GOOGLE" });
  assert.equal(script.calls[3].method, "POST");
  assert.equal(script.calls[3].url, `${base}/v2/billing`);
  assert.deepEqual(JSON.parse(script.calls[3].payload), billing);
  assert.equal(script.calls[3].headers["x-workspace-key"], "ws-1");
  await script.api.getWalletBalance({ "x-workspace-key": "ws-1" });
  assert.equal(script.calls[4].url, `${base}/v2/wallet/balance`);
  assert.equal(script.calls[4].headers["x-service-provider"], undefined);
  await script.api.addWalletBalance({ amount: 25, serviceProvider: "GOOGLE" });
  assert.equal(script.calls[5].method, "POST");
  assert.deepEqual(JSON.parse(script.calls[5].payload), { amount: 25 });
  await script.api.purchaseAddonMailboxes({ quantity: "2", serviceProvider: "MICROSOFT" });
  assert.equal(script.calls[6].method, "POST");
  assert.equal(script.calls[6].url, `${base}/v2/wallet/buy-addon-mailboxes?quantity=2`);
  assert.equal(script.calls[6].payload, undefined);
  assert.equal(script.calls[6].headers["x-service-provider"], "MICROSOFT");
  assert.equal(JSON.stringify(listed).includes("vault-zapmail-key"), false);
});

test("domain and dns operations encode method, path, query, and body", async () => {
  const script = ok();
  await script.api.listDomains({ contains: "example.com", page: "1", limit: "50", serviceProvider: "MICROSOFT", "x-workspace-key": "ws-1" });
  assert.equal(script.calls[0].method, "GET");
  assert.equal(script.calls[0].url, `${base}/v2/domains?contains=example.com&page=1&limit=50`);
  assert.equal(script.calls[0].headers["x-service-provider"], "MICROSOFT");
  await script.api.listDomainsWithFilters({ status: "ACTIVE", contains: "example.com", serviceProvider: "GOOGLE", "x-workspace-key": "ws-1" });
  assert.equal(script.calls[1].method, "POST");
  assert.equal(script.calls[1].url, `${base}/v2/domains`);
  assert.deepEqual(JSON.parse(script.calls[1].payload), { status: "ACTIVE", contains: "example.com" });
  assert.equal(script.calls[1].headers["x-service-provider"], undefined);
  assert.equal(script.calls[1].headers["x-workspace-key"], undefined);
  await script.api.connectDomains({ domainNames: ["company.com"], serviceProvider: "GOOGLE", "x-workspace-key": "ws-1", extra: true });
  assert.equal(script.calls[2].method, "POST");
  assert.equal(script.calls[2].url, `${base}/v2/domains/connect-domain`);
  assert.equal(script.calls[2].headers["x-service-provider"], "GOOGLE");
  assert.deepEqual(JSON.parse(script.calls[2].payload), { domainNames: ["company.com"], extra: true });
  await script.api.checkDns({ domainIds: ["dom-1"], serviceProvider: "GOOGLE", "x-workspace-key": "ws-1", note: "keep" });
  assert.equal(script.calls[3].method, "POST");
  assert.equal(script.calls[3].url, `${base}/v2/domains/dns/check`);
  assert.equal(script.calls[3].headers["x-service-provider"], undefined);
  assert.equal(script.calls[3].headers["x-workspace-key"], undefined);
  assert.deepEqual(JSON.parse(script.calls[3].payload), { domainIds: ["dom-1"], note: "keep" });
  await script.api.listDnsRecords({ id: "dom-1", serviceProvider: "GOOGLE" });
  assert.equal(script.calls[4].method, "GET");
  assert.equal(script.calls[4].url, `${base}/v2/dns/?id=dom-1`);
  await script.api.addDnsRecords({
    assignedDomainId: "dom-1",
    records: [{ host: "@", value: "192.0.2.1", recordType: "A" }],
    serviceProvider: "MICROSOFT",
  });
  assert.equal(script.calls[5].method, "POST");
  assert.equal(script.calls[5].url, `${base}/v2/dns`);
  assert.deepEqual(JSON.parse(script.calls[5].payload), {
    assignedDomainId: "dom-1",
    records: [{ host: "@", value: "192.0.2.1", recordType: "A" }],
  });
  await script.api.deleteDnsRecords({ id: "rec-1", assignedDomainId: "dom-1", serviceProvider: "GOOGLE" });
  assert.equal(script.calls[6].method, "DELETE");
  assert.equal(script.calls[6].url, `${base}/v2/dns?id=rec-1&assignedDomainId=dom-1`);
  assert.equal(script.calls[6].payload, undefined);
  await script.api.moveDomains({
    "x-workspace-key": "ws-1",
    serviceProvider: "GOOGLE",
    domainIds: ["dom-1"],
    workspaceId: "ws-2",
  });
  assert.equal(script.calls[7].headers["x-service-provider"], "GOOGLE");
  assert.deepEqual(JSON.parse(script.calls[7].payload), { serviceProvider: "GOOGLE", domainIds: ["dom-1"], workspaceId: "ws-2" });
});

test("mailbox, oauth, export, and subscription operations pass documented fields through", async () => {
  const mailboxBody = {
    status: 200,
    message: "Mailboxes fetched successfully",
    data: { domains: [{ id: "dom-1", domain: "example.com", mailboxes: [{ id: "mb-1", password: "secret-password", secret: "totp" }] }] },
  };
  const script = loadScript(() => ({ body: mailboxBody }));
  const listed = await script.api.listMailboxes({
    page: "1",
    limit: "10",
    contains: "example.com",
    domainName: "ignored.example",
    serviceProvider: "GOOGLE",
    "x-workspace-key": "ws-1",
  });
  assert.equal(listed.data.domains[0].mailboxes[0].password, "secret-password");
  assert.equal(listed.data.domains[0].mailboxes[0].secret, "totp");
  assert.equal(script.calls[0].method, "GET");
  assert.equal(script.calls[0].url, `${base}/v2/mailboxes/list?page=1&limit=10&contains=example.com`);
  assert.equal(script.calls[0].url.includes("domainName"), false);
  assert.equal(script.calls[0].url.includes("ignored.example"), false);
  assert.equal(script.calls[0].headers["x-service-provider"], "GOOGLE");
  await script.api.listMailboxes({ page: "1", serviceProvider: "MICROSOFT" });
  assert.equal(script.calls[1].headers["x-service-provider"], "MICROSOFT");
  await script.api.listMailboxes({ page: "1" });
  assert.equal(script.calls[2].headers["x-service-provider"], undefined);
  await script.api.getMailbox({ id: "mb-1", serviceProvider: "GOOGLE" });
  assert.equal(script.calls[3].url, `${base}/v2/mailboxes?id=mb-1`);
  await script.api.assignMailboxes({
    "x-workspace-key": "ws-1",
    serviceProvider: "GOOGLE",
    "dom-1": [{ firstName: "Ada", lastName: "Lovelace", mailboxUsername: "ada", domainName: "example.com", password: "secret-password" }],
    extra: true,
  });
  assert.equal(script.calls[4].method, "POST");
  assert.equal(script.calls[4].url, `${base}/v2/mailboxes`);
  assert.equal(script.calls[4].headers["x-service-provider"], "GOOGLE");
  assert.deepEqual(JSON.parse(script.calls[4].payload), {
    "dom-1": [{ firstName: "Ada", lastName: "Lovelace", mailboxUsername: "ada", domainName: "example.com", password: "secret-password" }],
    extra: true,
  });
  const oauth = {
    google: { appName: "App", clientId: "client", mailboxesPerDomain: { "dom-1": [{ mailboxId: "mb-1", oauthLink: "https://example.com/oauth" }] } },
    microsoft: { mailboxesPerDomain: { "dom-1": [{ mailboxId: "mb-2", oauthLink: "https://example.com/ms" }] } },
    extra: 1,
  };
  await script.api.createCustomOAuth({ ...oauth, serviceProvider: "GOOGLE", "x-workspace-key": "ws-1" });
  assert.equal(script.calls[5].url, `${base}/v2/mailboxes/custom-oauth`);
  assert.deepEqual(JSON.parse(script.calls[5].payload), oauth);
  await script.api.addGoogleClientId({ domainIds: ["dom-1"], clientId: "client", app: "App", serviceProvider: "MICROSOFT" });
  assert.equal(script.calls[6].url, `${base}/v2/domains/add-client-id`);
  assert.equal(script.calls[6].headers["x-service-provider"], "MICROSOFT");
  assert.deepEqual(JSON.parse(script.calls[6].payload), { domainIds: ["dom-1"], clientId: "client", app: "App" });
  await script.api.exportMailboxes({
    apps: ["SMARTLEAD"],
    ids: ["mb-1"],
    excludeIds: [],
    tagIds: [],
    status: "ACTIVE",
    contains: "example.com",
    serviceProvider: "GOOGLE",
    "x-workspace-key": "ws-1",
  });
  assert.equal(script.calls[7].url, `${base}/v2/exports/mailboxes`);
  assert.deepEqual(JSON.parse(script.calls[7].payload).apps, ["SMARTLEAD"]);
  await script.api.listThirdPartyAccounts({ app: "SMARTLEAD", serviceProvider: "GOOGLE", "x-workspace-key": "ws-1" });
  assert.equal(script.calls[8].url, `${base}/v2/exports/accounts/third-party?app=SMARTLEAD`);
  assert.equal(script.calls[8].url.includes("vault-zapmail-key"), false);
  assert.equal(script.calls[8].headers["x-auth-zapmail"], "vault-zapmail-key");
  assert.equal(script.calls[8].headers["x-service-provider"], "GOOGLE");
  await script.api.createThirdPartyAccount({ email: "ada@example.com", password: "secret-password", app: "SMARTLEAD" });
  assert.equal(JSON.parse(script.calls[9].payload).password, "secret-password");
  await script.api.getExportStatus({ exportId: 42, "x-workspace-key": "ws-1" });
  assert.equal(script.calls[10].url, `${base}/v2/exports/status?exportId=42`);
  assert.equal(script.calls[10].headers["x-service-provider"], undefined);
  await script.api.listSubscriptions({ status: "ACTIVE", serviceProvider: "GOOGLE" });
  assert.equal(script.calls[11].url, `${base}/v2/subscriptions?status=ACTIVE`);
  const tags = [{ name: "Production", tagColor: "#FF5733" }];
  tags["x-workspace-key"] = "ws-1";
  await script.api.createDomainTags(tags);
  assert.equal(script.calls[12].headers["x-workspace-key"], "ws-1");
  assert.deepEqual(JSON.parse(script.calls[12].payload), [{ name: "Production", tagColor: "#FF5733" }]);
  assert.equal(script.calls[12].payload.includes("ws-1"), false);
});

test("remaining resource groups encode method, path, and headers", async () => {
  const script = ok();
  await script.api.quickSetup({
    domains: [{ domainName: "example.com" }],
    mailboxes: { "example.com": [{ mailboxUsername: "ada", domainName: "example.com" }] },
    enableDnsShield: false,
    extra: true,
    serviceProvider: "MICROSOFT",
  });
  assert.equal(script.calls[0].method, "POST");
  assert.equal(script.calls[0].url, `${base}/v2/quick-setup`);
  assert.equal(JSON.parse(script.calls[0].payload).enableDnsShield, false);
  assert.equal(JSON.parse(script.calls[0].payload).extra, true);
  assert.equal(JSON.parse(script.calls[0].payload).serviceProvider, undefined);
  await script.api.listAgedDomains({ page: "1", serviceProvider: "GOOGLE" });
  assert.equal(script.calls[1].url, `${base}/v2/aged-domains/available-domains?page=1`);
  await script.api.getPrewarmedDomainCount({});
  assert.equal(script.calls[2].method, "GET");
  assert.equal(script.calls[2].url, `${base}/v2/prewarmed-domains/count`);
  assert.equal(script.calls[2].headers["x-service-provider"], undefined);
  await script.api.listPlacementTestSubscriptions({ "x-workspace-key": "ws-1", serviceProvider: "GOOGLE" });
  assert.equal(script.calls[3].url, `${base}/v2/placement-tests/subscriptions`);
  assert.equal(script.calls[3].headers["x-workspace-key"], "ws-1");
  assert.equal(script.calls[3].headers["x-service-provider"], undefined);
  await script.api.getDnsShieldSlots({ serviceProvider: "GOOGLE", "x-workspace-key": "ws-1" });
  assert.equal(script.calls[4].url, `${base}/v2/dns-shield/available-slots`);
  assert.equal(script.calls[4].headers["x-service-provider"], "GOOGLE");
  await script.api.searchMailboxesAndDomains({ contains: "ada@example.com", page: 1, limit: 10 });
  assert.equal(script.calls[5].url, `${base}/v2/global/mailbox-domain-search?contains=ada%40example.com&page=1&limit=10`);
  await script.api.getZapSite({ id: "site/1", "x-workspace-key": "ws-1", serviceProvider: "GOOGLE" });
  assert.equal(script.calls[6].method, "GET");
  assert.equal(script.calls[6].url, `${base}/v2/zap-sites/site%2F1`);
  await script.api.scanZapSite({ url: "https://example.com", serviceProvider: "GOOGLE" });
  assert.equal(script.calls[7].method, "GET");
  assert.equal(script.calls[7].url, `${base}/v2/zap-sites/scan`);
  assert.equal(script.calls[7].headers["x-service-provider"], undefined);
  assert.deepEqual(JSON.parse(script.calls[7].payload), { url: "https://example.com" });
  await script.api.listConnectedAccounts({ "x-workspace-id": "ws-id", serviceProvider: "MICROSOFT" });
  assert.equal(script.calls[8].url, `${base}/v2/onebox/connected-accounts`);
  assert.equal(script.calls[8].headers["x-workspace-id"], "ws-id");
  assert.equal(script.calls[8].headers["x-workspace-key"], undefined);
  assert.equal(script.calls[8].headers["x-service-provider"], "MICROSOFT");
  await script.api.listEmails({ account: "ada@example.com", "x-workspace-id": "ws-id", "x-workspace-key": "ignored", serviceProvider: "GOOGLE" });
  assert.equal(script.calls[9].url, `${base}/v2/onebox/top-emails?account=ada%40example.com`);
  assert.equal(script.calls[9].headers["x-workspace-id"], "ws-id");
  assert.equal(script.calls[9].headers["x-workspace-key"], undefined);
  await script.api.listWebhookEventTypes({});
  assert.equal(script.calls[10].url, `${base}/v2/webhook/events`);
  await script.api.createWebhookEndpoint({ url: "https://example.com/hook", enabled_events: ["mailbox.created"], extra: true });
  assert.equal(script.calls[11].method, "POST");
  assert.equal(script.calls[11].url, `${base}/v2/webhooks/endpoints`);
  assert.deepEqual(JSON.parse(script.calls[11].payload), { url: "https://example.com/hook", enabled_events: ["mailbox.created"], extra: true });
  assert.equal(script.api.ensureMailboxesOwned, undefined);
  assert.equal(script.api.ensureDomainsConnected, undefined);
  assert.equal(script.api.initiateConsentsForMailboxes, undefined);
  assert.equal(script.api.initiateCustomOAuth, undefined);
  assert.equal(script.api.listMailboxesNeedingConsent, undefined);
  assert.equal(script.api.listActiveGoogleMailboxes, undefined);
  assert.equal(script.api.getConnectNameservers, undefined);
  assert.equal(script.api.mapMailbox, undefined);
});

test("responses pass through passwords, empty 2xx bodies, and non-JSON text", async () => {
  const password = loadScript(() => ({ body: { password: "secret-password", appPassword: "app-secret", data: { secret: "totp" } } }));
  const body = await password.api.getUser({});
  assert.equal(body.password, "secret-password");
  assert.equal(body.appPassword, "app-secret");
  assert.equal(body.data.secret, "totp");
  const empty = loadScript(() => ({ status: 204, body: "" }));
  assert.equal(JSON.stringify(await empty.api.getUser({})), "{}");
  const blank = loadScript(() => ({ status: 200, body: "   " }));
  assert.equal(JSON.stringify(await blank.api.getUser({})), "{}");
  const text = loadScript(() => ({ status: 200, body: "zone-file-text" }));
  assert.equal(await text.api.getUser({}), "zone-file-text");
});

test("validation errors and non-2xx errors use the Zapmail message", async () => {
  const script = ok();
  await assert.rejects(() => script.api.listMailboxes(), /ZAPMAIL_INVALID_INPUT: input must be an object/);
  await assert.rejects(() => script.api.createWorkspace({}), /ZAPMAIL_INVALID_INPUT: name is required/);
  await assert.rejects(() => script.api.connectDomains({ domainNames: "example.com" }), /ZAPMAIL_INVALID_INPUT: domainNames is required/);
  await assert.rejects(() => script.api.listMailboxes({ serviceProvider: "google" }), /ZAPMAIL_INVALID_INPUT: serviceProvider must be GOOGLE or MICROSOFT/);
  await assert.rejects(() => script.api.listMailboxes({ serviceProvider: "GSUITE" }), /ZAPMAIL_INVALID_INPUT: serviceProvider must be GOOGLE or MICROSOFT/);
  await assert.rejects(() => script.api.retryFailedMailboxes({ domainIds: ["dom-1"] }), /ZAPMAIL_INVALID_INPUT: serviceProvider must be GOOGLE or MICROSOFT/);
  await assert.rejects(() => script.api.createDomainTags({ name: "Production" }), /ZAPMAIL_INVALID_INPUT: request body must be an array/);
  await assert.rejects(() => script.api.getZapSite({ id: "site-1", serviceProvider: "GOOGLE" }), /ZAPMAIL_INVALID_INPUT: x-workspace-key is required/);
  assert.equal(script.calls.length, 0);
  const failed = loadScript(() => ({ status: 403, body: { status: 403, message: "bad vault-zapmail-key token", errorId: "e1" } }));
  await assert.rejects(() => failed.api.getUser({}), (error) => {
    assert.equal(error.message, "ZAPMAIL_REQUEST_FAILED: 403 bad [redacted] token");
    assert.equal(error.message.includes("vault-zapmail-key"), false);
    assert.equal(error.message.includes("e1"), false);
    return true;
  });
  const html = loadScript(() => ({ status: 502, body: "<html>vault-zapmail-key</html>" }));
  await assert.rejects(() => html.api.getUser({}), /ZAPMAIL_REQUEST_FAILED: 502 <html>\[redacted\]<\/html>/);
});
