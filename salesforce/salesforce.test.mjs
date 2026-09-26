import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { createContext, runInContext } from "node:vm";

const root = dirname(fileURLToPath(import.meta.url));
const origin = "https://example.my.salesforce.com";
const api = `${origin}/services/data/v68.0`;
const same = (actual, expected) => assert.equal(JSON.stringify(actual), JSON.stringify(expected));
const loadScript = (handler, configuration) => {
  const calls = [];
  const context = createContext({
    ScriptContext: {
      configuration: configuration || { instanceUrl: "https://Example.my.salesforce.com", apiVersion: "v68.0" },
    },
    ConnectionApp: { getAccessToken: async () => "sf-token" },
    UrlFetchApp: {
      fetch: async (url, options = {}) => {
        calls.push({
          url,
          method: String(options.method || "GET").toUpperCase(),
          payload: options.payload,
          headers: options.headers,
        });
        const result = await handler({ url, method: String(options.method || "GET").toUpperCase() });
        const body = result && Object.prototype.hasOwnProperty.call(result, "body") ? result.body : { echoed: true };
        return {
          getResponseCode: () => (result && result.status) || 200,
          getContentText: () => (typeof body === "string" ? body : JSON.stringify(body)),
          getHeaders: () => (result && result.headers) || {},
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
const respond = ({ url, method }) => {
  if (url === `${origin}/services/data` && method === "GET") return { body: [{ version: "68.0", label: "Winter '27" }] };
  if (url.startsWith(`${api}/query?`) || url.startsWith(`${api}/queryAll?`) || url.startsWith(`${api}/query/`)) return { body: { totalSize: "2", done: false, nextRecordsUrl: "/services/data/v68.0/query/01g-2000", records: [{ Id: "001" }], extra: true } };
  if (url.startsWith(`${api}/search/?`)) return { body: { searchRecords: [{ Id: "001" }], extra: true } };
  if (url === `${api}/sobjects` && method === "GET") return { body: { encoding: "UTF-8", maxBatchSize: 200, sobjects: [], extra: true } };
  if (url === `${api}/composite` && method === "POST") return { body: { compositeResponse: [], extra: true } };
  if (url === `${api}/limits` && method === "GET") return { body: { DailyApiRequests: { Max: 15000, Remaining: 14999 }, extra: true } };
  if (url === `${api}/sobjects/Account/` && method === "POST") return { body: { id: "001", success: true, errors: [] } };
  if (url.startsWith(`${api}/sobjects/Account/Ext__c/11999`) && method === "PATCH") {
    return { status: 201, body: { id: "001", success: true, errors: [], created: true }, headers: { Location: "/services/data/v68.0/sobjects/Account/001" } };
  }
  if (method === "DELETE" || url === `${api}/sobjects/Account/001/`) return { status: 204, body: "", headers: { Location: "/services/data/v68.0/sobjects/Account/001" } };
  if (url.includes("/MALFORMED")) return { status: 400, body: [{ errorCode: "MALFORMED_QUERY", message: "unexpected token" }] };
  return { body: { echoed: true } };
};

test("query, search, describe, limits, and versions return the Salesforce body", async () => {
  const script = loadScript(respond);
  const queried = await script.api.query({ q: "SELECT Id FROM Account" });
  same(queried, { totalSize: "2", done: false, nextRecordsUrl: "/services/data/v68.0/query/01g-2000", records: [{ Id: "001" }], extra: true });
  assert.equal(script.calls[0].url, `${api}/query?q=SELECT%20Id%20FROM%20Account`);
  assert.equal(script.calls[0].method, "GET");
  assert.equal(script.calls[0].headers.Authorization, "Bearer sf-token");
  same(await script.api.queryAll({ q: "SELECT Id FROM Account" }), queried);
  assert.equal(script.calls[1].url, `${api}/queryAll?q=SELECT%20Id%20FROM%20Account`);
  same(await script.api.queryMore({ queryLocator: "01g-2000" }), queried);
  assert.equal(script.calls[2].url, `${api}/query/01g-2000`);
  const found = await script.api.search({ q: "FIND {Acme}" });
  same(found, { searchRecords: [{ Id: "001" }], extra: true });
  assert.equal(script.calls[3].url, `${api}/search/?q=FIND%20%7BAcme%7D`);
  same(await script.api.describeGlobal(), { encoding: "UTF-8", maxBatchSize: 200, sobjects: [], extra: true });
  assert.equal(script.calls[4].url, `${api}/sobjects`);
  same(await script.api.getLimits(), { DailyApiRequests: { Max: 15000, Remaining: 14999 }, extra: true });
  assert.equal(script.calls[5].url, `${api}/limits`);
  same(await script.api.listVersions(), [{ version: "68.0", label: "Winter '27" }]);
  assert.equal(script.calls[6].url, `${origin}/services/data`);
  same(await script.api.listResources(), { echoed: true });
  assert.equal(script.calls[7].url, `${api}`);
  const compositeBody = await script.api.composite({ compositeRequest: [{ method: "GET", url: "/services/data/v68.0/limits", referenceId: "limits" }] });
  same(compositeBody, { compositeResponse: [], extra: true });
  assert.deepEqual(JSON.parse(script.calls[8].payload), { compositeRequest: [{ method: "GET", url: "/services/data/v68.0/limits", referenceId: "limits" }] });
});

test("sObject, collection, composite, describe, and search calls use documented names", async () => {
  const script = loadScript(respond);
  const created = await script.api.createSObject({ sObject: "Account", Name: "Acme", NumberOfEmployees: 10 });
  same(created, { id: "001", success: true, errors: [] });
  assert.equal(script.calls[0].method, "POST");
  assert.equal(script.calls[0].url, `${api}/sobjects/Account/`);
  assert.deepEqual(JSON.parse(script.calls[0].payload), { Name: "Acme", NumberOfEmployees: 10 });
  const updated = await script.api.updateSObject({ sObject: "Account", id: "001", Name: "Acme", "If-Match": "etag" });
  same(updated, {});
  assert.equal(script.calls[1].url, `${api}/sobjects/Account/001/`);
  assert.equal(script.calls[1].method, "PATCH");
  assert.deepEqual(JSON.parse(script.calls[1].payload), { Name: "Acme" });
  assert.equal(script.calls[1].headers["If-Match"], "etag");
  await script.api.getSObject({ sObject: "Account", id: "001", fields: "Name,Id", "If-None-Match": "etag" });
  assert.equal(script.calls[2].url, `${api}/sobjects/Account/001/?fields=Name%2CId`);
  assert.equal(script.calls[2].headers["If-None-Match"], "etag");
  assert.equal(script.calls[2].payload, undefined);
  const deleted = await script.api.deleteSObject({ sObject: "Account", id: "001" });
  same(deleted, {});
  assert.equal(script.calls[3].method, "DELETE");
  const upserted = await script.api.upsertSObject({ sObject: "Account", fieldName: "Ext__c", fieldValue: "11999", Name: "Acme", updateOnly: false });
  same(upserted, { id: "001", success: true, errors: [], created: true });
  assert.equal(script.calls[4].url, `${api}/sobjects/Account/Ext__c/11999?updateOnly=false`);
  assert.deepEqual(JSON.parse(script.calls[4].payload), { Name: "Acme" });
  await script.api.getSObjectByExternalId({ sObject: "Account", fieldName: "Ext__c", fieldValue: "a/b" });
  assert.equal(script.calls[5].url, `${api}/sobjects/Account/Ext__c/a%2Fb`);
  same(await script.api.deleteSObjectByExternalId({ sObject: "Account", fieldName: "Ext__c", fieldValue: "11999" }), {});
  assert.equal(script.calls[6].method, "DELETE");
  assert.equal(script.calls[6].url, `${api}/sobjects/Account/Ext__c/11999`);
  await script.api.getSObjectBasicInformation({ sObject: "Account" });
  assert.equal(script.calls[7].method, "GET");
  assert.equal(script.calls[7].url, `${api}/sobjects/Account/`);
  await script.api.describeSObject({ sObject: "Account" });
  assert.equal(script.calls[8].url, `${api}/sobjects/Account/describe`);
  await script.api.createSObjects({ records: [{ attributes: { type: "Account" }, Name: "Acme" }], allOrNone: true });
  assert.equal(script.calls[9].url, `${api}/composite/sobjects`);
  assert.deepEqual(JSON.parse(script.calls[9].payload), { records: [{ attributes: { type: "Account" }, Name: "Acme" }], allOrNone: true });
  await script.api.createSObjects({ sObject: "Account", records: [{ Name: "Bare" }] });
  assert.deepEqual(JSON.parse(script.calls[10].payload), { records: [{ Name: "Bare" }] });
  await script.api.updateSObjects({ records: [{ attributes: { type: "Account" }, id: "001", Name: "Acme" }] });
  assert.equal(script.calls[11].method, "PATCH");
  assert.deepEqual(JSON.parse(script.calls[11].payload), { records: [{ attributes: { type: "Account" }, id: "001", Name: "Acme" }] });
  await script.api.deleteSObjects({ ids: "001,003" });
  assert.equal(script.calls[12].method, "DELETE");
  assert.equal(script.calls[12].url, `${api}/composite/sobjects?ids=001%2C003`);
  assert.equal(script.calls[12].payload, undefined);
  await script.api.upsertSObjects({ SobjectName: "Account", ExternalIdFieldName: "Ext__c", records: [{ attributes: { type: "Account" }, Ext__c: "11999" }] });
  assert.equal(script.calls[13].url, `${api}/composite/sobjects/Account/Ext__c`);
  assert.equal(script.calls[13].method, "PATCH");
  await script.api.getSObjectCollection({ sObject: "Account", ids: "001,003", fields: "Id,Name" });
  assert.equal(script.calls[14].url, `${api}/composite/sobjects/Account?ids=001%2C003&fields=Id%2CName`);
  await script.api.getSObjectCollectionWithBody({ sObject: "Account", recordIds: ["001", "003"], fieldNames: ["Id", "Name"] });
  assert.equal(script.calls[15].method, "POST");
  assert.deepEqual(JSON.parse(script.calls[15].payload), { recordIds: ["001", "003"], fieldNames: ["Id", "Name"] });
  await script.api.createSObjectTree({ sObjectName: "Account", records: [{ attributes: { type: "Account", referenceId: "ref1" }, Name: "Acme" }] });
  assert.equal(script.calls[16].url, `${api}/composite/tree/Account`);
  await script.api.compositeBatch({ batchRequests: [{ method: "GET", url: "v68.0/limits" }], haltOnError: true });
  assert.deepEqual(JSON.parse(script.calls[17].payload), { batchRequests: [{ method: "GET", url: "v68.0/limits" }], haltOnError: true });
  assert.equal(script.calls[17].url, `${api}/composite/batch`);
  await script.api.compositeGraph({ graphs: [{ graphId: "g1", compositeRequest: [] }] });
  assert.equal(script.calls[18].url, `${api}/composite/graph`);
  assert.deepEqual(JSON.parse(script.calls[18].payload), { graphs: [{ graphId: "g1", compositeRequest: [] }] });
  await script.api.getCompositeResources();
  assert.equal(script.calls[19].url, `${api}/composite`);
  assert.equal(script.calls[19].method, "GET");
  await script.api.getDeleted({ sObject: "Account", start: "2024-01-01T00:00:00Z", end: "2024-01-02T00:00:00Z" });
  assert.equal(script.calls[20].url, `${api}/sobjects/Account/deleted/?start=2024-01-01T00%3A00%3A00Z&end=2024-01-02T00%3A00%3A00Z`);
  await script.api.getUpdated({ sObject: "Account", start: "2024-01-01T00:00:00Z", end: "2024-01-02T00:00:00Z" });
  assert.equal(script.calls[21].url, `${api}/sobjects/Account/updated/?start=2024-01-01T00%3A00%3A00Z&end=2024-01-02T00%3A00%3A00Z`);
  await script.api.recordCount();
  assert.equal(script.calls[22].url, `${api}/limits/recordCount`);
  await script.api.recordCount({ sObjects: "Account,Contact" });
  assert.equal(script.calls[23].url, `${api}/limits/recordCount?sObjects=Account%2CContact`);
  await script.api.describeLayouts({ sObject: "Global" });
  assert.equal(script.calls[24].url, `${api}/sobjects/Global/describe/layouts/`);
  await script.api.describeRecordTypeLayouts({ sObject: "Account", recordTypeId: "012000000000000AAA" });
  assert.equal(script.calls[25].url, `${api}/sobjects/Account/describe/layouts/012000000000000AAA`);
  await script.api.describeNamedLayouts({ sObject: "Account", layoutName: "Account Layout" });
  assert.equal(script.calls[26].url, `${api}/sobjects/Account/describe/namedLayouts/Account%20Layout`);
  await script.api.describeApprovalLayouts({ sObject: "Account" });
  assert.equal(script.calls[27].url, `${api}/sobjects/Account/describe/approvalLayouts/`);
  await script.api.describeCompactLayouts({ sObject: "Account" });
  assert.equal(script.calls[28].url, `${api}/sobjects/Account/describe/compactLayouts/`);
  await script.api.compactLayouts({ q: "Account,Contact" });
  assert.equal(script.calls[29].url, `${api}/compactLayouts?q=Account%2CContact`);
  const searched = await script.api.parameterizedSearch({ q: "Acme", sobject: ["Account", "Contact"], "Account.fields": "id,name", spellCorrection: false });
  same(searched, { echoed: true });
  assert.equal(script.calls[30].url, `${api}/parameterizedSearch/?q=Acme&sobject=Account&sobject=Contact&Account.fields=id%2Cname&spellCorrection=false`);
  const postedSearch = { q: "Acme", sobjects: [{ name: "Account", fields: ["Id", "Name"] }], spellCorrection: true };
  await script.api.parameterizedSearchInBody(postedSearch);
  assert.equal(script.calls[31].method, "POST");
  assert.equal(script.calls[31].url, `${api}/parameterizedSearch/`);
  assert.deepEqual(JSON.parse(script.calls[31].payload), postedSearch);
  await script.api.searchScopeOrder();
  assert.equal(script.calls[32].url, `${api}/search/scopeOrder`);
  await script.api.getSObjectRelationship({ sObject: "Account", id: "001", relationshipName: "Contacts" });
  assert.equal(script.calls[33].url, `${api}/sobjects/Account/001/Contacts`);
  await script.api.updateSObjectRelationship({ sObject: "Account", id: "001", relationshipName: "Owner", Email: "a@b.com" });
  assert.equal(script.calls[34].method, "PATCH");
  assert.equal(script.calls[34].url, `${api}/sobjects/Account/001/Owner`);
  assert.deepEqual(JSON.parse(script.calls[34].payload), { Email: "a@b.com" });
  same(await script.api.deleteSObjectRelationship({ sObject: "Account", id: "001", relationshipName: "Contacts" }), {});
  assert.equal(script.calls[35].method, "DELETE");
  assert.equal(script.calls[35].url, `${api}/sobjects/Account/001/Contacts`);
  await script.api.request({ path: "query", query: { q: "SELECT Id FROM Account" } });
  assert.equal(script.calls[36].url, `${api}/query?q=SELECT%20Id%20FROM%20Account`);
  assert.equal(script.calls[36].method, "GET");
  same(await script.api.request({ path: "/sobjects/Account/001", method: "DELETE" }), {});
  assert.equal(script.calls[37].method, "DELETE");
  await script.api.createSObjectByExternalId({ sObject: "Account", Name: "Acme" });
  assert.equal(script.calls[38].method, "POST");
  assert.equal(script.calls[38].url, `${api}/sobjects/Account/Id`);
  assert.deepEqual(JSON.parse(script.calls[38].payload), { Name: "Acme" });
});

test("invalid input, aliases, and configuration do not call Salesforce", async () => {
  const script = loadScript(respond);
  assert.equal(script.api.getIdentity, undefined);
  assert.equal(script.api.getOrganization, undefined);
  const before = script.calls.length;
  await assert.rejects(() => script.api.query({ soql: "SELECT Id FROM Account" }), /SALESFORCE_INVALID_INPUT: q must be a string/);
  await assert.rejects(() => script.api.queryMore({ queryLocator: "/services/data/v68.0/query/01g-2000" }), /queryLocator must be the locator token/);
  await assert.rejects(() => script.api.composite({ compositeRequest: Array.from({ length: 26 }, () => ({ method: "GET" })), allOrNone: "true" }), /at most 25 compositeRequest/);
  await assert.rejects(() => script.api.createSObjects({ records: [{ Name: "A" }], allOrNone: "false" }), /allOrNone must be a boolean/);
  await assert.rejects(() => script.api.deleteSObjects({ ids: Array.from({ length: 201 }, (_, index) => `00${index}`).join(",") }), /at most 200 ids/);
  await assert.rejects(() => script.api.getSObjectCollectionWithBody({ sObject: "Account", recordIds: Array.from({ length: 2001 }, () => "001"), fieldNames: ["Id"] }), /at most 2000 recordIds/);
  await assert.rejects(() => script.api.parameterizedSearch({ q: "Acme", sobjects: [{ name: "Account" }] }), /sobjects must be a string, number, or boolean/);
  await assert.rejects(() => script.api.request({ path: "/MALFORMED" }), /SALESFORCE_REQUEST_FAILED \(400 MALFORMED_QUERY\): unexpected token/);
  assert.equal(script.calls.length, before + 1);
  const latest = loadScript(respond, { instanceUrl: "https://example.my.salesforce.com", apiVersion: "latest" });
  await assert.rejects(() => latest.api.getLimits(), /SALESFORCE_NOT_CONFIGURED: apiVersion must look like v68.0/);
  assert.equal(latest.calls.length, 0);
  const missing = loadScript(respond, {});
  await assert.rejects(() => missing.api.listResources(), /SALESFORCE_NOT_CONFIGURED: instanceUrl is required/);
  assert.equal(missing.calls.length, 0);
});

test("non-JSON success text is returned unchanged", async () => {
  const csv = "Id,Name\n001,Acme\n";
  const script = loadScript(() => ({ status: 200, body: csv, headers: { "content-type": "text/csv" } }));
  assert.equal(await script.api.request({ path: "/query/csv" }), csv);
});
