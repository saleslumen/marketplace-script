import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { createContext, runInContext } from "node:vm";

const root = dirname(fileURLToPath(import.meta.url));
const clientRecord = (id) => ({
  id,
  fields: { "Namespace ID": "ns-1", Name: "ns-1", Status: "QUEUED" },
});
const loadScript = (handler) => {
  const calls = [];
  const context = createContext({
    ConnectionApp: { getApiKey: async () => "pat" },
    VaultService: {
      getUserVault: () => ({
        getProperty: async (key) => ({
          AIRTABLE_BASE_ID: "appBase",
          AIRTABLE_TABLE_NAME: "Clients",
          AIRTABLE_TABLE_ID: "tblClients",
          AIRTABLE_OPERATIONS_TABLE_NAME: "Operations",
          AIRTABLE_OPERATIONS_TABLE_ID: "tblOps",
        })[key] || "",
        setProperty: async () => {},
      }),
    },
    UrlFetchApp: {
      fetch: async (url, options = {}) => {
        calls.push({ url, method: String(options.method || "GET").toUpperCase() });
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

test("getClient keys the Clients row by namespace and rejects a duplicate or foreign record", async () => {
  const one = loadScript(({ url }) => {
    if (url.includes("/Operations")) return { body: { records: [] } };
    return { body: { records: [clientRecord("recA")] } };
  });
  const found = await one.api.getClient({ namespaceId: "ns-1", recordId: "recA" });
  assert.equal(found.found, true);
  assert.equal(found.recordId, "recA");
  assert.match(one.calls[0].url, /maxRecords=2/);
  assert.match(one.calls[0].url, /Namespace%20ID/);
  const duplicate = loadScript(() => ({ body: { records: [clientRecord("recA"), clientRecord("recB")] } }));
  await assert.rejects(() => duplicate.api.getClient({ namespaceId: "ns-1" }), /duplicate client for namespaceId/);
  const foreign = loadScript(() => ({ body: { records: [clientRecord("recA")] } }));
  await assert.rejects(
    () => foreign.api.getClient({ namespaceId: "ns-1", recordId: "recOther" }),
    /recordId does not belong to namespaceId/,
  );
});

test("upsertClient rejects a duplicate namespace and creates the missing Clients row", async () => {
  const duplicate = loadScript(() => ({ body: { records: [clientRecord("recA"), clientRecord("recB")] } }));
  await assert.rejects(() => duplicate.api.upsertClient({ namespaceId: "ns-1" }), /duplicate client for namespaceId/);
  const created = loadScript(({ url, method }) => {
    if (method === "POST") return { body: { records: [clientRecord("recNew")] } };
    return { body: { records: [] } };
  });
  const row = await created.api.upsertClient({ namespaceId: "ns-1" });
  assert.equal(row.created, true);
  assert.equal(row.recordId, "recNew");
  assert.equal(row.namespaceId, "ns-1");
});

test("writeStatus fails when the namespace has no Clients row", async () => {
  const missing = loadScript(() => ({ body: { records: [] } }));
  await assert.rejects(
    () => missing.api.writeStatus({ namespaceId: "ns-1", status: "RUNNING", workflow: "Provision infrastructure" }),
    /client not found for namespaceId/,
  );
});
