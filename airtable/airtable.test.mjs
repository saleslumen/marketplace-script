import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { createContext, runInContext } from "node:vm";

const root = dirname(fileURLToPath(import.meta.url));
const loadScript = (handler) => {
  const calls = [];
  const context = createContext({
    ConnectionApp: { getApiKey: async () => "pat" },
    UrlFetchApp: {
      fetch: async (url, options = {}) => {
        calls.push({
          url,
          method: String(options.method || "GET").toUpperCase(),
          payload: options.payload,
          contentType: options.headers && options.headers["Content-Type"],
        });
        const result = await handler({ url, method: String(options.method || "GET").toUpperCase(), calls });
        const body = result.body === undefined ? {} : result.body;
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

const recordsApi = () =>
  loadScript(({ url, method }) => {
    if (method === "PATCH" && url.endsWith("/Email%20Accounts")) {
      return { body: { records: [{ id: "rec1", fields: { Email: "a@b.com" } }], createdRecords: [], updatedRecords: ["rec1"] } };
    }
    return { body: { id: "rec1", records: [] } };
  });

test("record operations encode method, path, query, and body", async () => {
  const script = recordsApi();
  const listed = await script.api.listRecords({
    baseId: "appOther",
    tableIdOrName: "Email Accounts",
    pageSize: 2,
    maxRecords: 5,
    offset: "itr/next",
    view: "Grid view",
    sort: [{ field: "Email", direction: "desc" }, { field: "Name" }],
    filterByFormula: "{Email}='a@b.com'",
    cellFormat: "string",
    timeZone: "UTC",
    userLocale: "en-us",
    fields: ["Email", "Name"],
    returnFieldsByFieldId: true,
    includeDateDependencyMetadata: false,
    recordMetadata: ["commentCount"],
  });
  assert.equal(JSON.stringify(listed), JSON.stringify({ id: "rec1", records: [] }));
  assert.equal(
    script.calls[0].url,
    "https://api.airtable.com/v0/appOther/Email%20Accounts?pageSize=2&maxRecords=5&offset=itr%2Fnext&view=Grid%20view&sort[0][field]=Email&sort[0][direction]=desc&sort[1][field]=Name&filterByFormula=%7BEmail%7D%3D'a%40b.com'&cellFormat=string&timeZone=UTC&userLocale=en-us&fields[]=Email&fields[]=Name&returnFieldsByFieldId=true&includeDateDependencyMetadata=false&recordMetadata[]=commentCount",
  );
  assert.equal(script.calls[0].method, "GET");
  await script.api.getRecord({ baseId: "appOther", tableIdOrName: "Email Accounts", recordId: "rec1", cellFormat: "json", returnFieldsByFieldId: true });
  assert.equal(script.calls[1].method, "GET");
  assert.equal(script.calls[1].url, "https://api.airtable.com/v0/appOther/Email%20Accounts/rec1?cellFormat=json&returnFieldsByFieldId=true");
  await script.api.createRecords({
    baseId: "appOther",
    tableIdOrName: "Email Accounts",
    records: [{ fields: { Email: "a@b.com" } }],
    typecast: true,
  });
  assert.equal(script.calls[2].method, "POST");
  assert.equal(script.calls[2].url, "https://api.airtable.com/v0/appOther/Email%20Accounts");
  assert.deepEqual(JSON.parse(script.calls[2].payload), { records: [{ fields: { Email: "a@b.com" } }], typecast: true });
  const upserted = await script.api.updateRecords({
    baseId: "appOther",
    tableIdOrName: "Email Accounts",
    performUpsert: { fieldsToMergeOn: ["Email"] },
    records: [{ fields: { Email: "a@b.com", Status: "Active" } }],
    typecast: true,
    returnFieldsByFieldId: true,
  });
  assert.equal(JSON.stringify(upserted), JSON.stringify({ records: [{ id: "rec1", fields: { Email: "a@b.com" } }], createdRecords: [], updatedRecords: ["rec1"] }));
  assert.equal(script.calls[3].method, "PATCH");
  assert.deepEqual(JSON.parse(script.calls[3].payload), {
    performUpsert: { fieldsToMergeOn: ["Email"] },
    records: [{ fields: { Email: "a@b.com", Status: "Active" } }],
    typecast: true,
    returnFieldsByFieldId: true,
  });
  await script.api.replaceRecords({
    baseId: "appOther",
    tableIdOrName: "Email Accounts",
    performUpsert: { fieldsToMergeOn: ["Email"] },
    records: [{ fields: { Email: "a@b.com" } }],
  });
  assert.equal(script.calls[4].method, "PUT");
  assert.equal(script.calls[4].url, "https://api.airtable.com/v0/appOther/Email%20Accounts");
  assert.deepEqual(JSON.parse(script.calls[4].payload).performUpsert, { fieldsToMergeOn: ["Email"] });
  await script.api.updateRecord({ baseId: "appOther", tableIdOrName: "Email Accounts", recordId: "rec1", fields: { Status: "Active" }, typecast: true });
  assert.equal(script.calls[5].method, "PATCH");
  assert.equal(script.calls[5].url, "https://api.airtable.com/v0/appOther/Email%20Accounts/rec1");
  assert.deepEqual(JSON.parse(script.calls[5].payload), { fields: { Status: "Active" }, typecast: true });
  await script.api.replaceRecord({ baseId: "appOther", tableIdOrName: "Email Accounts", recordId: "rec1", fields: { Email: "a@b.com" } });
  assert.equal(script.calls[6].method, "PUT");
  assert.equal(script.calls[6].url, "https://api.airtable.com/v0/appOther/Email%20Accounts/rec1");
  await script.api.deleteRecord({ baseId: "appOther", tableIdOrName: "Email Accounts", recordId: "rec1" });
  assert.equal(script.calls[7].method, "DELETE");
  assert.equal(script.calls[7].url, "https://api.airtable.com/v0/appOther/Email%20Accounts/rec1");
  assert.equal(script.calls[7].payload, undefined);
  await script.api.deleteRecords({ baseId: "appOther", tableIdOrName: "Email Accounts", records: ["rec1", "rec2"] });
  assert.equal(script.calls[8].method, "DELETE");
  assert.equal(script.calls[8].url, "https://api.airtable.com/v0/appOther/Email%20Accounts?records[]=rec1&records[]=rec2");
  const tooMany = Array.from({ length: 11 }, (_, index) => ({ id: `rec${index}`, fields: { Email: `${index}@b.com` } }));
  const callsBeforeLimit = script.calls.length;
  await assert.rejects(() => script.api.createRecords({ baseId: "appOther", tableIdOrName: "Email Accounts", records: tooMany }), /AIRTABLE_INVALID_INPUT: at most 10 records/);
  await assert.rejects(() => script.api.updateRecords({ baseId: "appOther", tableIdOrName: "Email Accounts", records: tooMany }), /AIRTABLE_INVALID_INPUT: at most 10 records/);
  await assert.rejects(() => script.api.replaceRecords({ baseId: "appOther", tableIdOrName: "Email Accounts", records: tooMany }), /AIRTABLE_INVALID_INPUT: at most 10 records/);
  await assert.rejects(
    () => script.api.deleteRecords({ baseId: "appOther", tableIdOrName: "Email Accounts", records: tooMany.map((row) => row.id) }),
    /AIRTABLE_INVALID_INPUT: at most 10 records/,
  );
  await assert.rejects(
    () => script.api.updateRecords({ baseId: "appOther", tableIdOrName: "Email Accounts", performUpsert: { fieldsToMergeOn: ["A", "B", "C", "D"] }, records: [{ fields: { Email: "a@b.com" } }] }),
    /AIRTABLE_INVALID_INPUT: fieldsToMergeOn must contain 1 to 3 fields/,
  );
  assert.equal(script.calls.length, callsBeforeLimit);
  await script.api.listRecords({ baseId: "appOther", tableIdOrName: "T", filterByFormula: "x".repeat(16000) });
  const posted = script.calls[script.calls.length - 1];
  assert.equal(posted.method, "POST");
  assert.equal(posted.url, "https://api.airtable.com/v0/appOther/T/listRecords");
  assert.equal(JSON.parse(posted.payload).filterByFormula, "x".repeat(16000));
  await script.api.uploadAttachment({
    baseId: "appOther",
    recordId: "rec1",
    attachmentFieldIdOrName: "Attachments",
    contentType: "text/plain",
    file: "SGVsbG8=",
    filename: "sample.txt",
  });
  const uploaded = script.calls[script.calls.length - 1];
  assert.equal(uploaded.method, "POST");
  assert.equal(uploaded.url, "https://content.airtable.com/v0/appOther/rec1/Attachments/uploadAttachment");
  assert.deepEqual(JSON.parse(uploaded.payload), { contentType: "text/plain", file: "SGVsbG8=", filename: "sample.txt" });
  const csv = "Email,Status\na@b.com,Active\n";
  await script.api.syncCsvData({ baseId: "appOther", tableIdOrName: "Email Accounts", apiEndpointSyncId: "sync1", csv });
  const synced = script.calls[script.calls.length - 1];
  assert.equal(synced.method, "POST");
  assert.equal(synced.url, "https://api.airtable.com/v0/appOther/Email%20Accounts/sync/sync1");
  assert.equal(synced.contentType, "text/csv");
  assert.equal(synced.payload, csv);
  const failed = loadScript(() => ({ status: 422, body: { error: { type: "INVALID_REQUEST_UNKNOWN", message: "Invalid request: parameter validation failed" } } }));
  await assert.rejects(() => failed.api.getRecord({ baseId: "appOther", tableIdOrName: "T", recordId: "rec1" }), (error) => {
    assert.equal(error.message, "AIRTABLE_REQUEST_FAILED: 422 Invalid request: parameter validation failed");
    assert.equal(error.message.includes("Bearer"), false);
    return true;
  });
});

test("base and schema operations encode method, path, query, and body", async () => {
  const script = loadScript(({ url }) => (url.includes("/blockInstallations") ? { body: [{ id: "bli1", state: "enabled" }] } : { body: { id: "appOther" } }));
  await script.api.listBases({ offset: "itr/next" });
  assert.equal(script.calls[0].method, "GET");
  assert.equal(script.calls[0].url, "https://api.airtable.com/v0/meta/bases?offset=itr%2Fnext");
  await script.api.getBaseSchema({ baseId: "appOther", include: ["visibleFieldIds"] });
  assert.equal(script.calls[1].url, "https://api.airtable.com/v0/meta/bases/appOther/tables?include[]=visibleFieldIds");
  await script.api.createBase({
    name: "Apartment Hunting",
    workspaceId: "wsp1",
    tables: [{ name: "Apartments", fields: [{ name: "Name", type: "singleLineText" }] }],
  });
  assert.equal(script.calls[2].method, "POST");
  assert.equal(script.calls[2].url, "https://api.airtable.com/v0/meta/bases");
  assert.deepEqual(JSON.parse(script.calls[2].payload), {
    name: "Apartment Hunting",
    workspaceId: "wsp1",
    tables: [{ name: "Apartments", fields: [{ name: "Name", type: "singleLineText" }] }],
  });
  await script.api.createTable({ baseId: "appOther", name: "Email Accounts", description: "Mailboxes", fields: [{ name: "Email", type: "singleLineText" }] });
  assert.equal(script.calls[3].method, "POST");
  assert.equal(script.calls[3].url, "https://api.airtable.com/v0/meta/bases/appOther/tables");
  assert.deepEqual(JSON.parse(script.calls[3].payload), { name: "Email Accounts", fields: [{ name: "Email", type: "singleLineText" }], description: "Mailboxes" });
  await script.api.updateTable({ baseId: "appOther", tableIdOrName: "Email Accounts", name: "Mailboxes", description: "Updated" });
  assert.equal(script.calls[4].method, "PATCH");
  assert.equal(script.calls[4].url, "https://api.airtable.com/v0/meta/bases/appOther/tables/Email%20Accounts");
  assert.deepEqual(JSON.parse(script.calls[4].payload), { name: "Mailboxes", description: "Updated" });
  await script.api.createField({ baseId: "appOther", tableId: "tbl1", name: "Email", type: "email" });
  assert.equal(script.calls[5].method, "POST");
  assert.equal(script.calls[5].url, "https://api.airtable.com/v0/meta/bases/appOther/tables/tbl1/fields");
  assert.deepEqual(JSON.parse(script.calls[5].payload), { name: "Email", type: "email" });
  await script.api.updateField({ baseId: "appOther", tableId: "tbl1", columnId: "fld1", name: "Email address" });
  assert.equal(script.calls[6].method, "PATCH");
  assert.equal(script.calls[6].url, "https://api.airtable.com/v0/meta/bases/appOther/tables/tbl1/fields/fld1");
  assert.deepEqual(JSON.parse(script.calls[6].payload), { name: "Email address" });
  await script.api.listViews({ baseId: "appOther", include: ["visibleFieldIds"] });
  assert.equal(script.calls[7].url, "https://api.airtable.com/v0/meta/bases/appOther/views?include[]=visibleFieldIds");
  await script.api.getViewMetadata({ baseId: "appOther", viewId: "viw1", include: ["visibleFieldIds"] });
  assert.equal(script.calls[8].url, "https://api.airtable.com/v0/meta/bases/appOther/views/viw1?include[]=visibleFieldIds");
  await script.api.getBaseCollaborators({ baseId: "appOther", include: ["collaborators", "interfaces"] });
  assert.equal(script.calls[9].url, "https://api.airtable.com/v0/meta/bases/appOther?include[]=collaborators&include[]=interfaces");
  await script.api.getInterface({ baseId: "appOther", pageBundleId: "pbd1", include: ["inviteLinks"] });
  assert.equal(script.calls[10].url, "https://api.airtable.com/v0/meta/bases/appOther/interfaces/pbd1?include[]=inviteLinks");
  await script.api.getWorkspaceCollaborators({ workspaceId: "wsp1", include: ["collaborators"] });
  assert.equal(script.calls[11].url, "https://api.airtable.com/v0/meta/workspaces/wsp1?include[]=collaborators");
  const installations = await script.api.listBlockInstallations({ baseId: "appOther" });
  assert.equal(JSON.stringify(installations), JSON.stringify([{ id: "bli1", state: "enabled" }]));
  assert.equal(script.calls[12].url, "https://api.airtable.com/v0/meta/bases/appOther/blockInstallations");
});

test("comment operations encode method, path, query, and body", async () => {
  const script = loadScript(() => ({ body: { id: "com1", deleted: true } }));
  await script.api.listComments({ baseId: "appOther", tableIdOrName: "Email Accounts", recordId: "rec1", pageSize: 10, offset: "itr/next" });
  assert.equal(script.calls[0].method, "GET");
  assert.equal(script.calls[0].url, "https://api.airtable.com/v0/appOther/Email%20Accounts/rec1/comments?pageSize=10&offset=itr%2Fnext");
  await script.api.createComment({ baseId: "appOther", tableIdOrName: "Email Accounts", recordId: "rec1", parentCommentId: "comParent", text: "Hello" });
  assert.equal(script.calls[1].method, "POST");
  assert.equal(script.calls[1].url, "https://api.airtable.com/v0/appOther/Email%20Accounts/rec1/comments");
  assert.deepEqual(JSON.parse(script.calls[1].payload), { parentCommentId: "comParent", text: "Hello" });
  await script.api.updateComment({ baseId: "appOther", tableIdOrName: "Email Accounts", recordId: "rec1", rowCommentId: "com1", text: "Updated" });
  assert.equal(script.calls[2].method, "PATCH");
  assert.equal(script.calls[2].url, "https://api.airtable.com/v0/appOther/Email%20Accounts/rec1/comments/com1");
  assert.deepEqual(JSON.parse(script.calls[2].payload), { text: "Updated" });
  await script.api.deleteComment({ baseId: "appOther", tableIdOrName: "Email Accounts", recordId: "rec1", rowCommentId: "com1" });
  assert.equal(script.calls[3].method, "DELETE");
  assert.equal(script.calls[3].url, "https://api.airtable.com/v0/appOther/Email%20Accounts/rec1/comments/com1");
});

test("webhook operations encode method, path, query, and body", async () => {
  const script = loadScript(() => ({ body: { id: "ach1", expirationTime: "2023-01-30T00:00:00.000Z" } }));
  const specification = { options: { filters: { dataTypes: ["tableData"], recordChangeScope: "tbl1" } } };
  await script.api.listWebhooks({ baseId: "appOther" });
  assert.equal(script.calls[0].method, "GET");
  assert.equal(script.calls[0].url, "https://api.airtable.com/v0/bases/appOther/webhooks");
  await script.api.createWebhook({ baseId: "appOther", notificationUrl: "https://example.com/hook", specification });
  assert.equal(script.calls[1].method, "POST");
  assert.equal(script.calls[1].url, "https://api.airtable.com/v0/bases/appOther/webhooks");
  assert.deepEqual(JSON.parse(script.calls[1].payload), { notificationUrl: "https://example.com/hook", specification });
  await script.api.deleteWebhook({ baseId: "appOther", webhookId: "ach1" });
  assert.equal(script.calls[2].method, "DELETE");
  assert.equal(script.calls[2].url, "https://api.airtable.com/v0/bases/appOther/webhooks/ach1");
  await script.api.refreshWebhook({ baseId: "appOther", webhookId: "ach1" });
  assert.equal(script.calls[3].method, "POST");
  assert.equal(script.calls[3].url, "https://api.airtable.com/v0/bases/appOther/webhooks/ach1/refresh");
  assert.equal(script.calls[3].payload, undefined);
  await script.api.enableWebhookNotifications({ baseId: "appOther", webhookId: "ach1", enable: false });
  assert.equal(script.calls[4].method, "POST");
  assert.equal(script.calls[4].url, "https://api.airtable.com/v0/bases/appOther/webhooks/ach1/enableNotifications");
  assert.deepEqual(JSON.parse(script.calls[4].payload), { enable: false });
  await script.api.listWebhookPayloads({ baseId: "appOther", webhookId: "ach1", cursor: 2, limit: 50 });
  assert.equal(script.calls[5].method, "GET");
  assert.equal(script.calls[5].url, "https://api.airtable.com/v0/bases/appOther/webhooks/ach1/payloads?cursor=2&limit=50");
  await assert.rejects(
    () => script.api.listWebhookPayloads({ baseId: "appOther", webhookId: "ach1", limit: 51 }),
    /AIRTABLE_INVALID_INPUT: limit must be an integer from 1 to 50/,
  );
});

test("getUserInfo calls whoami", async () => {
  const script = loadScript(() => ({ body: { id: "usr1", email: "owner@example.com" } }));
  const user = await script.api.getUserInfo();
  assert.equal(JSON.stringify(user), JSON.stringify({ id: "usr1", email: "owner@example.com" }));
  assert.equal(script.calls[0].method, "GET");
  assert.equal(script.calls[0].url, "https://api.airtable.com/v0/meta/whoami");
});

test("public functions are the operations table", () => {
  const readme = readFileSync(join(root, "README.md"), "utf8");
  const operations = readme.slice(readme.indexOf("## Operations"), readme.indexOf("## Errors"));
  const documented = [...operations.matchAll(/^\| `([A-Za-z0-9]+)` \|/gm)].map((match) => match[1]).sort();
  const declared = readdirSync(root).filter((name) => name.endsWith(".js")).flatMap((name) => {
    const source = readFileSync(join(root, name), "utf8");
    return [...source.matchAll(/^(?:async )?function ([A-Za-z0-9]+)\(/gm)].map((match) => match[1]);
  }).sort();
  assert.deepEqual(declared, documented);
});
