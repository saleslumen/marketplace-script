import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { createContext, runInContext } from "node:vm";

const root = dirname(fileURLToPath(import.meta.url));
const API_KEY = "vault-aiark-key";
const TRACK_ID = "719aba5a-876f-4690-bb57-5157153836b4";
const loadScript = (handler) => {
  const calls = [];
  const context = createContext({
    ConnectionApp: {
      getApiKey: async (key) => {
        if (key !== "aiark") throw new Error(`AUTH_NOT_CONNECTED: ${key}`);
        return API_KEY;
      },
    },
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
const ok = (body) => () => ({ status: 200, body });
const lastCall = (calls) => calls[calls.length - 1];

test("operations send the documented method, path, X-TOKEN, and body", async () => {
  const vendor = { trackId: TRACK_ID, state: "PENDING", content: [{ id: "person-1" }], total: 12, ok: false, outcome: "leave-me" };
  const script = loadScript(ok(vendor));
  const people = {
    page: 0,
    size: 10,
    account: { location: { any: { include: ["Germany"] } } },
    contact: { seniority: { any: { include: ["director"] } } },
    perPage: 25,
  };
  const searched = await script.api.searchPeople(people);
  assert.equal(JSON.stringify(searched), JSON.stringify(vendor));
  assert.equal(script.calls[0].method, "POST");
  assert.equal(script.calls[0].url, "https://api.ai-ark.com/api/developer-portal/v1/people");
  assert.equal(script.calls[0].headers["X-TOKEN"], API_KEY);
  assert.equal(script.calls[0].headers["Content-Type"], "application/json");
  assert.equal(script.calls[0].headers.Accept, "application/json");
  assert.equal(script.calls[0].muteHttpExceptions, true);
  assert.deepEqual(JSON.parse(script.calls[0].payload), people);
  assert.equal(JSON.stringify(searched).includes(API_KEY), false);
  const preview = { page: 1, size: 25, contact: { location: { any: { include: ["Berlin"] } } } };
  await script.api.previewPeople(preview);
  assert.equal(script.calls[1].method, "POST");
  assert.equal(script.calls[1].url, "https://api.ai-ark.com/api/developer-portal/v1/people/preview");
  assert.deepEqual(JSON.parse(script.calls[1].payload), preview);
  const companies = { page: 0, size: 10, lookalikeDomains: ["raisin.com"], account: { location: { any: { include: ["Germany"] } } } };
  await script.api.searchCompanies(companies);
  assert.equal(script.calls[2].url, "https://api.ai-ark.com/api/developer-portal/v1/companies");
  assert.deepEqual(JSON.parse(script.calls[2].payload), companies);
  const list = { type: "people_id", values: ["d39d88bf-6ec5-8915-77db-3145472cf706"] };
  await script.api.createOrUpdateList(list);
  assert.equal(script.calls[3].method, "POST");
  assert.equal(script.calls[3].url, "https://api.ai-ark.com/api/developer-portal/v1/lists");
  assert.deepEqual(JSON.parse(script.calls[3].payload), list);
  await script.api.exportSinglePerson({ url: "https://www.linkedin.com/in/john-doe" });
  assert.equal(script.calls[4].url, "https://api.ai-ark.com/api/developer-portal/v1/people/export/single");
  assert.deepEqual(JSON.parse(script.calls[4].payload), { url: "https://www.linkedin.com/in/john-doe" });
  await script.api.exportSinglePersonV2({ id: "592439b8-13c7-e31c-296e-b6e2f7339aeb" });
  assert.equal(script.calls[5].url, "https://api.ai-ark.com/api/developer-portal/v2/people/export/single");
  assert.deepEqual(JSON.parse(script.calls[5].payload), { id: "592439b8-13c7-e31c-296e-b6e2f7339aeb" });
  const exported = { page: 0, size: 100, webhook: "https://example.com/hook", account: { domain: { any: { include: ["acme.com"] } } } };
  await script.api.exportPeople(exported);
  assert.equal(script.calls[6].method, "POST");
  assert.equal(script.calls[6].url, "https://api.ai-ark.com/api/developer-portal/v1/people/export");
  assert.deepEqual(JSON.parse(script.calls[6].payload), exported);
  await script.api.listExportInquiries({ trackId: TRACK_ID, page: 0, size: 100 });
  assert.equal(script.calls[7].method, "GET");
  assert.equal(script.calls[7].payload, undefined);
  assert.equal(script.calls[7].url, `https://api.ai-ark.com/api/developer-portal/v1/people/export/${TRACK_ID}/inquiries?page=0&size=100`);
  const status = await script.api.getExportStatus({ trackId: TRACK_ID });
  assert.equal(JSON.stringify(status), JSON.stringify(vendor));
  assert.equal(script.calls[8].method, "GET");
  assert.equal(script.calls[8].url, `https://api.ai-ark.com/api/developer-portal/v1/people/export/${TRACK_ID}/statistics`);
  assert.equal(script.calls.filter((call) => call.url.endsWith("/v1/people/export") && call.method === "POST").length, 1);
  await script.api.listExportSubmissions({ state: "SETTLED", fullyRefunded: false, page: 1, size: 25, sort: ["created,desc", "trackId,asc"] });
  assert.equal(script.calls[9].method, "GET");
  assert.equal(script.calls[9].url, "https://api.ai-ark.com/api/developer-portal/v1/people/export/submissions?state=SETTLED&fullyRefunded=false&page=1&size=25&sort=created%2Cdesc&sort=trackId%2Casc");
  await script.api.resendExportPeopleWebhook({ trackId: TRACK_ID, webhook: "https://example.com/again" });
  assert.equal(script.calls[10].method, "PATCH");
  assert.equal(script.calls[10].url, `https://api.ai-ark.com/api/developer-portal/v1/people/export/${TRACK_ID}/notify`);
  assert.deepEqual(JSON.parse(script.calls[10].payload), { webhook: "https://example.com/again" });
  const finder = { trackId: TRACK_ID, webhook: "https://example.com/finder" };
  await script.api.findEmailsByTrackId(finder);
  assert.equal(script.calls[11].method, "POST");
  assert.equal(script.calls[11].url, "https://api.ai-ark.com/api/developer-portal/v1/people/email-finder");
  assert.deepEqual(JSON.parse(script.calls[11].payload), finder);
  await script.api.listEmailFinderResults({ trackId: ` ${TRACK_ID} `, page: 2, size: 10 });
  assert.equal(script.calls[12].url, `https://api.ai-ark.com/api/developer-portal/v1/people/email-finder/${TRACK_ID}/inquiries?page=2&size=10`);
  await script.api.getEmailFinderStatistics({ trackId: TRACK_ID });
  assert.equal(script.calls[13].url, `https://api.ai-ark.com/api/developer-portal/v1/people/email-finder/${TRACK_ID}/statistics`);
  await script.api.listEmailFinderSubmissions({});
  assert.equal(script.calls[14].method, "GET");
  assert.equal(script.calls[14].url, "https://api.ai-ark.com/api/developer-portal/v1/people/email-finder/submissions");
  await script.api.resendEmailFinderWebhook({ trackId: TRACK_ID, webhook: "https://example.com/finder-again" });
  assert.equal(script.calls[15].method, "PATCH");
  assert.equal(script.calls[15].url, `https://api.ai-ark.com/api/developer-portal/v1/people/email-finder/${TRACK_ID}/notify`);
  assert.deepEqual(JSON.parse(script.calls[15].payload), { webhook: "https://example.com/finder-again" });
  const phone = { linkedin: "https://www.linkedin.com/in/melissa-deyneka-51116125" };
  await script.api.findMobilePhone(phone);
  assert.equal(script.calls[16].url, "https://api.ai-ark.com/api/developer-portal/v1/people/mobile-phone-finder");
  assert.deepEqual(JSON.parse(script.calls[16].payload), phone);
  const phoneByName = { domain: "cnyric.org", name: "Melissa Deyneka" };
  await script.api.findMobilePhoneV2(phoneByName);
  assert.equal(script.calls[17].url, "https://api.ai-ark.com/api/developer-portal/v2/people/mobile-phone-finder");
  assert.deepEqual(JSON.parse(script.calls[17].payload), phoneByName);
  await script.api.analyzePersonality({ url: "https://www.linkedin.com/in/mahyar-mohsenpour" });
  assert.equal(script.calls[18].url, "https://api.ai-ark.com/api/developer-portal/v1/people/analysis");
  await script.api.reversePeopleLookup({ search: "bnorris@cnyric.org" });
  assert.equal(script.calls[19].method, "POST");
  assert.equal(script.calls[19].url, "https://api.ai-ark.com/api/developer-portal/v1/people/reverse-lookup");
  assert.deepEqual(JSON.parse(script.calls[19].payload), { search: "bnorris@cnyric.org" });
  const credits = await script.api.fetchCredit();
  assert.equal(JSON.stringify(credits), JSON.stringify(vendor));
  assert.equal(lastCall(script.calls).method, "GET");
  assert.equal(lastCall(script.calls).url, "https://api.ai-ark.com/api/developer-portal/v1/payments/credits");
  assert.equal(lastCall(script.calls).payload, undefined);
  assert.equal(script.api.ensurePeopleExport, undefined);
});

test("validation rejects required fields before a request", async () => {
  const script = loadScript(() => ({ status: 200, body: {} }));
  const before = script.calls.length;
  await assert.rejects(() => script.api.searchPeople(null), /AIARK_INVALID_INPUT: input must be an object/);
  await assert.rejects(() => script.api.searchPeople({ page: 0, perPage: 10 }), /AIARK_INVALID_INPUT: size is required/);
  await assert.rejects(() => script.api.searchPeople({ page: 0, size: "10" }), /AIARK_INVALID_INPUT: size must be an integer from 0 to 100/);
  await assert.rejects(() => script.api.searchPeople({ page: -1, size: 10 }), /AIARK_INVALID_INPUT: page must be an integer greater than or equal to 0/);
  await assert.rejects(() => script.api.previewPeople({ page: 0, size: 101 }), /AIARK_INVALID_INPUT: size must be an integer from 0 to 100/);
  await assert.rejects(() => script.api.searchCompanies({ page: 0, size: 10, lookalikeDomains: ["a", "b", "c", "d", "e", "f"] }), /AIARK_INVALID_INPUT: lookalikeDomains must be an array of at most 5 strings/);
  await assert.rejects(() => script.api.exportPeople({ page: 0, size: 10001, webhook: "https://example.com/hook" }), /AIARK_INVALID_INPUT: size must be an integer from 1 to 10000/);
  await assert.rejects(() => script.api.exportPeople({ page: 0, size: 10 }), /AIARK_INVALID_INPUT: webhook is required/);
  await assert.rejects(() => script.api.getExportStatus({}), /AIARK_INVALID_INPUT: trackId is required/);
  await assert.rejects(() => script.api.listExportInquiries({ trackId: TRACK_ID, size: 0 }), /AIARK_INVALID_INPUT: size must be an integer from 1 to 100/);
  await assert.rejects(() => script.api.listExportSubmissions({ state: "pending" }), /AIARK_INVALID_INPUT: state must be PENDING or SETTLED/);
  await assert.rejects(() => script.api.listEmailFinderSubmissions({ fullyRefunded: "true" }), /AIARK_INVALID_INPUT: fullyRefunded must be a boolean/);
  await assert.rejects(() => script.api.listExportSubmissions({ sort: ["created,desc", ""] }), /AIARK_INVALID_INPUT: sort must be an array of strings/);
  await assert.rejects(() => script.api.exportSinglePerson({}), /AIARK_INVALID_INPUT: id or url is required/);
  await assert.rejects(() => script.api.exportSinglePersonV2({ id: "  ", url: "" }), /AIARK_INVALID_INPUT: id or url is required/);
  await assert.rejects(() => script.api.findMobilePhone({ domain: "cnyric.org" }), /AIARK_INVALID_INPUT: linkedin or domain and name is required/);
  await assert.rejects(() => script.api.findMobilePhoneV2({}), /AIARK_INVALID_INPUT: linkedin or domain and name is required/);
  await assert.rejects(() => script.api.findEmailsByTrackId({ trackId: TRACK_ID }), /AIARK_INVALID_INPUT: webhook is required/);
  await assert.rejects(() => script.api.resendExportPeopleWebhook({ webhook: "https://example.com/hook" }), /AIARK_INVALID_INPUT: trackId is required/);
  await assert.rejects(() => script.api.analyzePersonality({}), /AIARK_INVALID_INPUT: url is required/);
  await assert.rejects(() => script.api.reversePeopleLookup({ search: "  " }), /AIARK_INVALID_INPUT: search is required/);
  await assert.rejects(() => script.api.createOrUpdateList({ values: ["person-1"] }), /AIARK_INVALID_INPUT: type is required/);
  await assert.rejects(() => script.api.createOrUpdateList({ id: TRACK_ID, values: ["person-1"], type: "account" }), /AIARK_INVALID_INPUT: type must be people_id or company_id/);
  await assert.rejects(() => script.api.createOrUpdateList({ type: "company_id", values: ["company-1"], mode: "append" }), /AIARK_INVALID_INPUT: mode must be APPEND or REPLACE/);
  await assert.rejects(() => script.api.createOrUpdateList({ type: "people_id", values: "person-1" }), /AIARK_INVALID_INPUT: values is required/);
  await assert.rejects(() => script.api.fetchCredit([]), /AIARK_INVALID_INPUT: input must be an object/);
  assert.equal(script.calls.length, before);
});

test("non-2xx responses throw AIARK_REQUEST_FAILED without the API key", async () => {
  const limited = loadScript(() => ({ status: 429, body: { status: 429, error: `slow down ${API_KEY}` } }));
  await assert.rejects(() => limited.api.fetchCredit(), (error) => {
    assert.equal(error.message, "AIARK_REQUEST_FAILED: 429 slow down [redacted]");
    assert.equal(error.message.includes(API_KEY), false);
    return true;
  });
  const conflict = loadScript(() => ({ status: 409, body: { timestamp: "2026-02-23T10:30:00.000Z", status: 409, error: "track id in progress", path: "/v1/people/export/{trackId}/inquiries" } }));
  await assert.rejects(() => conflict.api.listExportInquiries({ trackId: TRACK_ID }), /AIARK_REQUEST_FAILED: 409 track id in progress/);
  const refunded = loadScript(() => ({ status: 403, body: { status: 4031013, error: "this request was automatically refunded because the results were not delivered within the time limit. you can submit it again." } }));
  await assert.rejects(
    () => refunded.api.getExportStatus({ trackId: TRACK_ID }),
    /AIARK_REQUEST_FAILED: 403 this request was automatically refunded because the results were not delivered within the time limit\. you can submit it again\./,
  );
  const plain = loadScript(() => ({ status: 500, body: "gateway down" }));
  await assert.rejects(() => plain.api.searchPeople({ page: 0, size: 1 }), /AIARK_REQUEST_FAILED: 500 gateway down/);
  const invalid = loadScript(() => ({ status: 200, body: "not-json" }));
  await assert.rejects(() => invalid.api.fetchCredit(), /AIARK_REQUEST_FAILED: 200 invalid JSON/);
  const empty = loadScript(() => ({ status: 200, body: "" }));
  assert.equal(JSON.stringify(await empty.api.fetchCredit()), "{}");
});
