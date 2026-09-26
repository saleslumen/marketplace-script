import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { createContext, runInContext } from "node:vm";

const root = dirname(fileURLToPath(import.meta.url));
const base = "https://api.cloudflare.com/client/v4";
const envelope = (result = { id: "zone1" }, extra = {}) => ({
  success: true,
  errors: [],
  messages: [],
  result,
  ...extra,
});
const loadScript = (handler) => {
  const calls = [];
  const context = createContext({
    ConnectionApp: { getApiKey: async (key) => (key === "cloudflare" ? "vault-token-secret" : "") },
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
        const body = result.body === undefined ? envelope() : result.body;
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
const ok = () => loadScript(() => ({ body: envelope({ id: "zone1" }, { result_info: { count: 1, page: 1 } }) }));
const record = { name: "www.example.com", ttl: 3600, type: "A", content: "192.0.2.1", proxied: true };

test("zone operations encode method, path, query, and body", async () => {
  const script = ok();
  const listed = await script.api.listZones({
    account: { id: "acct", name: "Example" },
    direction: "desc",
    match: "all",
    name: "example.com",
    order: "name",
    page: 2,
    per_page: 20,
    status: "active",
    type: ["full", "partial"],
    zoneId: "ignored",
  });
  assert.equal(JSON.stringify(listed), JSON.stringify(envelope({ id: "zone1" }, { result_info: { count: 1, page: 1 } })));
  assert.equal(script.calls[0].method, "GET");
  assert.equal(script.calls[0].payload, undefined);
  assert.equal(script.calls[0].muteHttpExceptions, true);
  assert.equal(script.calls[0].headers.Authorization, "Bearer vault-token-secret");
  assert.equal(script.calls[0].headers.Accept, "application/json");
  assert.equal(
    script.calls[0].url,
    `${base}/zones?account.id=acct&account.name=Example&direction=desc&match=all&name=example.com&order=name&page=2&per_page=20&status=active&type=full%2Cpartial`,
  );
  await script.api.getZone({ zone_id: "zone1" });
  assert.equal(script.calls[1].method, "GET");
  assert.equal(script.calls[1].url, `${base}/zones/zone1`);
  await script.api.createZone({ account: { id: "acct" }, name: " example.com " });
  assert.equal(script.calls[2].method, "POST");
  assert.equal(script.calls[2].url, `${base}/zones`);
  assert.deepEqual(JSON.parse(script.calls[2].payload), { account: { id: "acct" }, name: "example.com" });
  await script.api.editZone({ zone_id: "zone1", paused: false, vanity_name_servers: ["ns1.example.com"] });
  assert.equal(script.calls[3].method, "PATCH");
  assert.equal(script.calls[3].url, `${base}/zones/zone1`);
  assert.deepEqual(JSON.parse(script.calls[3].payload), { paused: false, vanity_name_servers: ["ns1.example.com"] });
  await script.api.deleteZone({ zone_id: "zone1" });
  assert.equal(script.calls[4].method, "DELETE");
  assert.equal(script.calls[4].url, `${base}/zones/zone1`);
  assert.equal(script.calls[4].payload, undefined);
  await script.api.rerunZoneActivationCheck({ zone_id: "zone1" });
  assert.equal(script.calls[5].method, "PUT");
  assert.equal(script.calls[5].url, `${base}/zones/zone1/activation_check`);
  assert.equal(script.calls[5].payload, undefined);
  assert.equal(script.calls.length, 6);
  assert.equal(JSON.stringify(listed).includes("vault-token-secret"), false);
});

test("zone setting operations encode method, path, and body", async () => {
  const script = ok();
  await script.api.getAllZoneSettings({ zone_id: "zone1" });
  assert.equal(script.calls[0].method, "GET");
  assert.equal(script.calls[0].url, `${base}/zones/zone1/settings`);
  await script.api.getZoneSetting({ zone_id: "zone1", setting_id: "cname_flattening" });
  assert.equal(script.calls[1].method, "GET");
  assert.equal(script.calls[1].url, `${base}/zones/zone1/settings/cname_flattening`);
  await script.api.editZoneSetting({ zone_id: "zone1", setting_id: "cname_flattening", value: "flatten_at_root" });
  assert.equal(script.calls[2].method, "PATCH");
  assert.equal(script.calls[2].url, `${base}/zones/zone1/settings/cname_flattening`);
  assert.deepEqual(JSON.parse(script.calls[2].payload), { value: "flatten_at_root" });
  await script.api.editZoneSetting({ zone_id: "zone1", setting_id: "ssl_recommender", enabled: false });
  assert.deepEqual(JSON.parse(script.calls[3].payload), { enabled: false });
  await script.api.editMultipleZoneSettings({
    zone_id: "zone1",
    items: [{ id: "cname_flattening", value: "flatten_all" }],
  });
  assert.equal(script.calls[4].method, "PATCH");
  assert.equal(script.calls[4].url, `${base}/zones/zone1/settings`);
  assert.deepEqual(JSON.parse(script.calls[4].payload), { items: [{ id: "cname_flattening", value: "flatten_all" }] });
});

test("dns record operations encode method, path, query, and body", async () => {
  const script = loadScript(({ url }) => {
    if (url.endsWith("/dns_records/export")) return { status: 200, body: "example.com. 300 IN A 192.0.2.1\n" };
    return { body: envelope({ id: "rec1" }) };
  });
  await script.api.listDnsRecords({ zone_id: "zone1" });
  assert.equal(script.calls[0].method, "GET");
  assert.equal(script.calls[0].url, `${base}/zones/zone1/dns_records`);
  await script.api.listDnsRecords({
    zone_id: "zone1",
    comment: { exact: "hello" },
    name: { exact: "www.example.com" },
    type: "A",
    proxied: false,
    include_shadow_metadata: true,
    tag_match: "all",
    page: 1,
    per_page: 100,
    search: "www",
  });
  assert.equal(
    script.calls[1].url,
    `${base}/zones/zone1/dns_records?comment.exact=hello&include_shadow_metadata=true&name.exact=www.example.com&page=1&per_page=100&proxied=false&search=www&tag_match=all&type=A`,
  );
  await script.api.getDnsRecord({ zone_id: "zone1", dns_record_id: "rec1", include_shadow_metadata: true });
  assert.equal(script.calls[2].method, "GET");
  assert.equal(script.calls[2].url, `${base}/zones/zone1/dns_records/rec1?include_shadow_metadata=true`);
  await script.api.createDnsRecord({ zone_id: "zone1", ...record, include_shadow_metadata: true });
  assert.equal(script.calls[3].method, "POST");
  assert.equal(script.calls[3].url, `${base}/zones/zone1/dns_records?include_shadow_metadata=true`);
  assert.deepEqual(JSON.parse(script.calls[3].payload), record);
  await script.api.updateDnsRecord({ zone_id: "zone1", dns_record_id: "rec1", ...record, comment: "note" });
  assert.equal(script.calls[4].method, "PATCH");
  assert.equal(script.calls[4].url, `${base}/zones/zone1/dns_records/rec1`);
  assert.deepEqual(JSON.parse(script.calls[4].payload), { ...record, comment: "note" });
  await script.api.overwriteDnsRecord({ zone_id: "zone1", dns_record_id: "rec1", ...record, include_shadow_metadata: false });
  assert.equal(script.calls[5].method, "PUT");
  assert.equal(script.calls[5].url, `${base}/zones/zone1/dns_records/rec1?include_shadow_metadata=false`);
  assert.deepEqual(JSON.parse(script.calls[5].payload), record);
  await script.api.deleteDnsRecord({ zone_id: "zone1", dns_record_id: "rec1" });
  assert.equal(script.calls[6].method, "DELETE");
  assert.equal(script.calls[6].url, `${base}/zones/zone1/dns_records/rec1`);
  assert.equal(script.calls[6].payload, undefined);
  await script.api.batchDnsRecords({
    zone_id: "zone1",
    include_shadow_metadata: true,
    deletes: [{ id: "rec1" }],
    posts: [record],
  });
  assert.equal(script.calls[7].method, "POST");
  assert.equal(script.calls[7].url, `${base}/zones/zone1/dns_records/batch?include_shadow_metadata=true`);
  assert.deepEqual(JSON.parse(script.calls[7].payload), { deletes: [{ id: "rec1" }], posts: [record] });
  const exported = await script.api.exportDnsRecords({ zone_id: "zone1" });
  assert.equal(exported, "example.com. 300 IN A 192.0.2.1\n");
  assert.equal(script.calls[8].method, "GET");
  assert.equal(script.calls[8].url, `${base}/zones/zone1/dns_records/export`);
  assert.equal(script.calls[8].headers.Accept, "text/plain");
  await script.api.importDnsRecords({ zone_id: "zone1", file: "www 300 IN A 192.0.2.1", proxied: "true" });
  assert.equal(script.calls[9].method, "POST");
  assert.equal(script.calls[9].url, `${base}/zones/zone1/dns_records/import`);
  assert.equal(script.calls[9].headers["Content-Type"], "multipart/form-data; boundary=cloudflare-form-boundary");
  assert.match(script.calls[9].payload, /name="file"/);
  assert.match(script.calls[9].payload, /www 300 IN A 192\.0\.2\.1/);
  assert.match(script.calls[9].payload, /name="proxied"\r\n\r\ntrue/);
  await script.api.scanDnsRecords({ zone_id: "zone1" });
  assert.equal(script.calls[10].method, "POST");
  assert.equal(script.calls[10].url, `${base}/zones/zone1/dns_records/scan`);
  assert.equal(script.calls[10].payload, undefined);
  await script.api.triggerDnsRecordScan({ zone_id: "zone1" });
  assert.equal(script.calls[11].method, "POST");
  assert.equal(script.calls[11].url, `${base}/zones/zone1/dns_records/scan/trigger`);
  await script.api.reviewScannedDnsRecords({
    zone_id: "zone1",
    accepts: [record],
    rejects: [{ id: "rec9" }],
  });
  assert.equal(script.calls[12].method, "POST");
  assert.equal(script.calls[12].url, `${base}/zones/zone1/dns_records/scan/review`);
  assert.deepEqual(JSON.parse(script.calls[12].payload), { accepts: [record], rejects: [{ id: "rec9" }] });
  await script.api.listScannedDnsRecords({ zone_id: "zone1" });
  assert.equal(script.calls[13].method, "GET");
  assert.equal(script.calls[13].url, `${base}/zones/zone1/dns_records/scan/review`);
});

test("dnssec operations encode method and path", async () => {
  const script = ok();
  await script.api.getDnssec({ zone_id: "zone1" });
  assert.equal(script.calls[0].method, "GET");
  assert.equal(script.calls[0].url, `${base}/zones/zone1/dnssec`);
  await script.api.editDnssec({ zone_id: "zone1", dnssec_presigned: true, status: "active" });
  assert.equal(script.calls[1].method, "PATCH");
  assert.equal(script.calls[1].url, `${base}/zones/zone1/dnssec`);
  assert.deepEqual(JSON.parse(script.calls[1].payload), { dnssec_presigned: true, status: "active" });
  await script.api.deleteDnssec({ zone_id: "zone1" });
  assert.equal(script.calls[2].method, "DELETE");
  assert.equal(script.calls[2].url, `${base}/zones/zone1/dnssec`);
  await script.api.listDnssecZsks({ zone_id: "zone1" });
  assert.equal(script.calls[3].method, "GET");
  assert.equal(script.calls[3].url, `${base}/zones/zone1/dnssec/zsk`);
});

test("dns settings operations encode method, path, and body", async () => {
  const script = ok();
  await script.api.getZoneDnsSettings({ zone_id: "zone1" });
  assert.equal(script.calls[0].method, "GET");
  assert.equal(script.calls[0].url, `${base}/zones/zone1/dns_settings`);
  await script.api.updateZoneDnsSettings({ zone_id: "zone1", ns_ttl: 86400, zone_mode: "dns_only", zoneId: "ignored" });
  assert.equal(script.calls[1].method, "PATCH");
  assert.equal(script.calls[1].url, `${base}/zones/zone1/dns_settings`);
  assert.deepEqual(JSON.parse(script.calls[1].payload), { ns_ttl: 86400, zone_mode: "dns_only" });
  await script.api.getAccountDnsSettings({ account_id: "acct" });
  assert.equal(script.calls[2].method, "GET");
  assert.equal(script.calls[2].url, `${base}/accounts/acct/dns_settings`);
  await script.api.updateAccountDnsSettings({ account_id: "acct", enforce_dns_only: true, zone_defaults: { zone_mode: "standard" } });
  assert.equal(script.calls[3].method, "PATCH");
  assert.deepEqual(JSON.parse(script.calls[3].payload), { zone_defaults: { zone_mode: "standard" }, enforce_dns_only: true });
  await script.api.listInternalDnsViews({ account_id: "acct" });
  assert.equal(script.calls[4].url, `${base}/accounts/acct/dns_settings/views`);
  await script.api.getInternalDnsView({ account_id: "acct", view_id: "view1" });
  assert.equal(script.calls[5].url, `${base}/accounts/acct/dns_settings/views/view1`);
  await script.api.createInternalDnsView({ account_id: "acct", name: "office", zones: ["zone1"] });
  assert.equal(script.calls[6].method, "POST");
  assert.deepEqual(JSON.parse(script.calls[6].payload), { name: "office", zones: ["zone1"] });
  await script.api.updateInternalDnsView({ account_id: "acct", view_id: "view1", name: "branch" });
  assert.equal(script.calls[7].method, "PATCH");
  assert.equal(script.calls[7].url, `${base}/accounts/acct/dns_settings/views/view1`);
  assert.deepEqual(JSON.parse(script.calls[7].payload), { name: "branch" });
  await script.api.deleteInternalDnsView({ account_id: "acct", view_id: "view1" });
  assert.equal(script.calls[8].method, "DELETE");
  assert.equal(script.calls[8].url, `${base}/accounts/acct/dns_settings/views/view1`);
  assert.equal(script.api.cleanupDnsConflicts, undefined);
  assert.equal(script.api.deleteDnsRecordsByMatch, undefined);
  assert.equal(script.api.ensureZonesActive, undefined);
  assert.equal(script.api.createZones, undefined);
  assert.equal(script.api.exportDns, undefined);
});

test("validation errors name the missing documented field", async () => {
  const script = ok();
  await assert.rejects(() => script.api.listZones(), /CLOUDFLARE_INVALID_INPUT: input must be an object/);
  await assert.rejects(() => script.api.getZone({ zoneId: "zone1" }), /CLOUDFLARE_INVALID_INPUT: zone_id is required/);
  await assert.rejects(() => script.api.createZone({ name: "example.com" }), /CLOUDFLARE_INVALID_INPUT: account is required/);
  await assert.rejects(() => script.api.createZone({ account: { id: "acct" } }), /CLOUDFLARE_INVALID_INPUT: name is required/);
  await assert.rejects(() => script.api.editZoneSetting({ zone_id: "zone1", setting_id: "cname_flattening" }), /CLOUDFLARE_INVALID_INPUT: value or enabled is required/);
  await assert.rejects(() => script.api.editMultipleZoneSettings({ zone_id: "zone1" }), /CLOUDFLARE_INVALID_INPUT: items is required/);
  await assert.rejects(() => script.api.createDnsRecord({ zone_id: "zone1", name: "www.example.com", type: "A" }), /CLOUDFLARE_INVALID_INPUT: ttl is required/);
  await assert.rejects(() => script.api.importDnsRecords({ zone_id: "zone1" }), /CLOUDFLARE_INVALID_INPUT: file is required/);
  await assert.rejects(() => script.api.createInternalDnsView({ account_id: "acct", name: "office" }), /CLOUDFLARE_INVALID_INPUT: zones is required/);
  assert.equal(script.calls.length, 0);
});

test("non-2xx errors use the first Cloudflare message and omit the token", async () => {
  const failed = loadScript(() => ({
    status: 403,
    body: {
      success: false,
      errors: [{ code: 10000, message: "Authentication failed vault-token-secret" }, { message: "second" }],
      messages: [],
      result: null,
    },
  }));
  await assert.rejects(() => failed.api.getZone({ zone_id: "zone1" }), (error) => {
    assert.equal(error.message, "CLOUDFLARE_REQUEST_FAILED: 403 Authentication failed [redacted]");
    assert.equal(error.message.includes("vault-token-secret"), false);
    assert.equal(error.message.includes("second"), false);
    return true;
  });
  const html = loadScript(() => ({ status: 502, body: "<html>vault-token-secret</html>" }));
  await assert.rejects(() => html.api.getZone({ zone_id: "zone1" }), /CLOUDFLARE_REQUEST_FAILED: 502 <html>\[redacted\]<\/html>/);
  const passthrough = loadScript(() => ({
    status: 200,
    body: { success: false, errors: [{ code: 1000, message: "pending" }], messages: ["note"], result: null },
  }));
  const body = await passthrough.api.getZone({ zone_id: "zone1" });
  assert.equal(JSON.stringify(body), JSON.stringify({ success: false, errors: [{ code: 1000, message: "pending" }], messages: ["note"], result: null }));
});
