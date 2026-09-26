import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { createContext, runInContext } from "node:vm";

const root = dirname(fileURLToPath(import.meta.url));
const API_KEY = "vault-apollo-key";
const loadScript = (handler) => {
  const calls = [];
  const context = createContext({
    ConnectionApp: {
      getApiKey: async (key) => {
        if (key !== "apollo") throw new Error(`AUTH_NOT_CONNECTED: ${key}`);
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
        const result = handler ? await handler({ url, method: String(options.method || "GET").toUpperCase() }) : { status: 200, body: {} };
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
const parsedUrl = (url) => {
  const parsed = new URL(url);
  return parsed;
};

test("people and organization calls use documented names and return the Apollo body", async () => {
  const people = { id: "person-1", first_name: "Ada", email: "ada@example.com", organization: { name: "Example" } };
  const script = loadScript(({ url }) => {
    if (url.includes("/people/bulk_match")) return { body: { matches: [people], total_requested_enrichments: 1 } };
    if (url.includes("/people/match")) return { body: { person: people } };
    if (url.includes("/mixed_people/api_search")) return { body: { total_entries: 1, people: [people] } };
    if (url.includes("/organizations/bulk_enrich")) return { body: { organizations: [{ id: "org-1", name: "Apollo" }] } };
    if (url.includes("/organizations/enrich")) return { body: { organization: { id: "org-1", primary_domain: "apollo.io" } } };
    return { body: { organizations: [{ id: "org-1" }], pagination: { page: 1 } } };
  });
  const searched = await script.api.searchPeople({
    "person_titles[]": ["VP Sales"],
    person_titles: ["ignored"],
    include_similar_titles: false,
    page: 2,
    per_page: 10,
    "revenue_range[min]": 1000000,
  });
  assert.equal(JSON.stringify(searched), JSON.stringify({ total_entries: 1, people: [people] }));
  const search = parsedUrl(script.calls[0].url);
  assert.equal(script.calls[0].method, "POST");
  assert.equal(script.calls[0].payload, undefined);
  assert.equal(script.calls[0].muteHttpExceptions, true);
  assert.equal(script.calls[0].headers["X-Api-Key"], API_KEY);
  assert.equal(search.origin + search.pathname, "https://api.apollo.io/api/v1/mixed_people/api_search");
  assert.deepEqual(search.searchParams.getAll("person_titles[]"), ["VP Sales"]);
  assert.equal(search.searchParams.get("person_titles"), null);
  assert.equal(search.searchParams.get("include_similar_titles"), "false");
  assert.equal(search.searchParams.get("page"), "2");
  assert.equal(search.searchParams.get("per_page"), "10");
  assert.equal(search.searchParams.get("revenue_range[min]"), "1000000");
  assert.equal(JSON.stringify(searched).includes(API_KEY), false);
  const enriched = await script.api.enrichPerson({ id: "person-1", firstName: "Ada", reveal_personal_emails: false });
  assert.equal(JSON.stringify(enriched), JSON.stringify({ person: people }));
  const match = parsedUrl(script.calls[1].url);
  assert.equal(match.pathname, "/api/v1/people/match");
  assert.equal(match.searchParams.get("id"), "person-1");
  assert.equal(match.searchParams.get("firstName"), null);
  assert.equal(match.searchParams.get("reveal_personal_emails"), "false");
  assert.equal(script.calls[1].payload, undefined);
  const bulk = await script.api.bulkEnrichPeople({
    details: [{ id: "person-1", domain: "example.com" }],
    reveal_phone_number: true,
    poll_only: true,
  });
  assert.equal(JSON.stringify(bulk), JSON.stringify({ matches: [people], total_requested_enrichments: 1 }));
  const bulkUrl = parsedUrl(script.calls[2].url);
  assert.equal(bulkUrl.pathname, "/api/v1/people/bulk_match");
  assert.equal(bulkUrl.searchParams.get("reveal_phone_number"), "true");
  assert.equal(bulkUrl.searchParams.get("poll_only"), "true");
  assert.deepEqual(JSON.parse(script.calls[2].payload), { details: [{ id: "person-1", domain: "example.com" }] });
  const organizations = await script.api.searchOrganizations({ "q_organization_name": "Apollo", page: 1 });
  assert.equal(JSON.stringify(organizations), JSON.stringify({ organizations: [{ id: "org-1" }], pagination: { page: 1 } }));
  assert.equal(parsedUrl(script.calls[3].url).pathname, "/api/v1/mixed_companies/search");
  assert.equal(parsedUrl(script.calls[3].url).searchParams.get("q_organization_name"), "Apollo");
  assert.equal(script.calls[3].payload, undefined);
  const organization = await script.api.enrichOrganization({ domain: "apollo.io", name: "Apollo" });
  assert.equal(JSON.stringify(organization), JSON.stringify({ organization: { id: "org-1", primary_domain: "apollo.io" } }));
  const enrich = parsedUrl(script.calls[4].url);
  assert.equal(script.calls[4].method, "GET");
  assert.equal(enrich.pathname, "/api/v1/organizations/enrich");
  assert.equal(enrich.searchParams.get("domain"), "apollo.io");
  assert.equal(enrich.searchParams.get("name"), "Apollo");
  const bulkOrganizations = await script.api.bulkEnrichOrganizations({
    "domains[]": ["apollo.io"],
    details: [{ linkedin_url: "http://www.linkedin.com/company/microsoft" }],
  });
  assert.equal(JSON.stringify(bulkOrganizations), JSON.stringify({ organizations: [{ id: "org-1", name: "Apollo" }] }));
  const bulkOrg = parsedUrl(script.calls[5].url);
  assert.equal(bulkOrg.pathname, "/api/v1/organizations/bulk_enrich");
  assert.deepEqual(bulkOrg.searchParams.getAll("domains[]"), ["apollo.io"]);
  assert.deepEqual(JSON.parse(script.calls[5].payload), { details: [{ linkedin_url: "http://www.linkedin.com/company/microsoft" }] });
});

test("records, sequences, workspace, and usage calls keep Apollo paths and bodies", async () => {
  const script = loadScript(({ url, method }) => {
    if (url.endsWith("/labels") && method === "GET") return { body: [{ id: "label-1", name: "Maui", modality: "contacts" }] };
    if (url.includes("/usage_stats/api_usage_stats")) return { body: { "[\"api/v1/contacts\", \"search\"]": { day: { limit: 6000, consumed: 1, left_over: 5999 } } } };
    return { body: { id: "row-1", contact: { id: "contact-1" }, account: { id: "account-1" }, email_accounts: [], users: [] } };
  });
  await script.api.createContact({ first_name: "Ada", email: "ada@example.com", run_dedupe: true, firstName: "ignored" });
  assert.equal(script.calls[0].method, "POST");
  assert.equal(script.calls[0].url, "https://api.apollo.io/api/v1/contacts");
  assert.deepEqual(JSON.parse(script.calls[0].payload), { first_name: "Ada", email: "ada@example.com", run_dedupe: true });
  await script.api.updateContact({ contact_id: "contact/1", title: "VP" });
  assert.equal(script.calls[1].method, "PATCH");
  assert.equal(script.calls[1].url, "https://api.apollo.io/api/v1/contacts/contact%2F1");
  assert.deepEqual(JSON.parse(script.calls[1].payload), { title: "VP" });
  await script.api.searchContacts({ q_keywords: "ada", page: 3, sort_ascending: false });
  assert.equal(script.calls[2].method, "POST");
  assert.equal(script.calls[2].url, "https://api.apollo.io/api/v1/contacts/search");
  assert.deepEqual(JSON.parse(script.calls[2].payload), { q_keywords: "ada", sort_ascending: false, page: 3 });
  await script.api.getContact({ contact_id: "contact-1" });
  assert.equal(script.calls[3].method, "GET");
  assert.equal(script.calls[3].url, "https://api.apollo.io/api/v1/contacts/contact-1");
  assert.equal(script.calls[3].payload, undefined);
  await script.api.createAccount({ name: "Example", domain: "example.com" });
  assert.equal(script.calls[4].url, "https://api.apollo.io/api/v1/accounts");
  assert.deepEqual(JSON.parse(script.calls[4].payload), { name: "Example", domain: "example.com" });
  await script.api.updateAccount({ account_id: "account-1", phone: "555" });
  assert.equal(script.calls[5].method, "PATCH");
  assert.equal(script.calls[5].url, "https://api.apollo.io/api/v1/accounts/account-1");
  assert.deepEqual(JSON.parse(script.calls[5].payload), { phone: "555" });
  await script.api.searchAccounts({ q_organization_name: "Example", per_page: 5 });
  assert.equal(script.calls[6].url, "https://api.apollo.io/api/v1/accounts/search");
  assert.deepEqual(JSON.parse(script.calls[6].payload), { q_organization_name: "Example", per_page: 5 });
  await script.api.searchSequences({ q_name: "Outbound", page: "2" });
  const sequences = parsedUrl(script.calls[7].url);
  assert.equal(script.calls[7].method, "POST");
  assert.equal(sequences.pathname, "/api/v1/emailer_campaigns/search");
  assert.equal(sequences.searchParams.get("q_name"), "Outbound");
  assert.equal(sequences.searchParams.get("page"), "2");
  assert.equal(script.calls[7].payload, undefined);
  await script.api.addContactsToSequence({
    sequence_id: "sequence 1",
    emailer_campaign_id: " sequence 1 ",
    "contact_ids[]": ["contact-1"],
    send_email_from_email_account_id: ["mailbox-1", "mailbox-2"],
    sequence_no_email: true,
  });
  const added = parsedUrl(script.calls[8].url);
  assert.equal(added.pathname, "/api/v1/emailer_campaigns/sequence%201/add_contact_ids");
  assert.equal(added.searchParams.get("emailer_campaign_id"), " sequence 1 ");
  assert.deepEqual(added.searchParams.getAll("contact_ids[]"), ["contact-1"]);
  assert.deepEqual(added.searchParams.getAll("send_email_from_email_account_id"), ["mailbox-1", "mailbox-2"]);
  assert.equal(added.searchParams.get("sequence_no_email"), "true");
  await script.api.listEmailAccounts();
  assert.equal(script.calls[9].method, "GET");
  assert.equal(script.calls[9].url, "https://api.apollo.io/api/v1/email_accounts");
  await script.api.listUsers({ page: 1, per_page: 25 });
  assert.equal(script.calls[10].url, "https://api.apollo.io/api/v1/users/search?page=1&per_page=25");
  await script.api.getCurrentUser({ include_credit_usage: true });
  assert.equal(script.calls[11].url, "https://api.apollo.io/api/v1/users/api_profile?include_credit_usage=true");
  const lists = await script.api.listLabels();
  assert.equal(JSON.stringify(lists), JSON.stringify([{ id: "label-1", name: "Maui", modality: "contacts" }]));
  assert.equal(script.calls[12].url, "https://api.apollo.io/api/v1/labels");
  await script.api.createLabel({ name: "Maui", modality: "contacts" });
  assert.deepEqual(JSON.parse(script.calls[13].payload), { name: "Maui", modality: "contacts" });
  await script.api.updateLabel({ id: "label-1", name: "West", book_of_business: false });
  assert.equal(script.calls[14].method, "PATCH");
  assert.equal(script.calls[14].url, "https://api.apollo.io/api/v1/labels/label-1");
  assert.deepEqual(JSON.parse(script.calls[14].payload), { name: "West", book_of_business: false });
  await script.api.addToLabels({ entity_ids: ["contact-1"], label_names: ["Maui"], modality: "contacts", async: false });
  assert.equal(script.calls[15].url, "https://api.apollo.io/api/v1/labels/add_entity_ids_to_label_names");
  assert.deepEqual(JSON.parse(script.calls[15].payload), { entity_ids: ["contact-1"], label_names: ["Maui"], modality: "contacts", async: false });
  await script.api.removeFromLabels({ entity_ids: ["contact-1"], label_names: ["Maui"], modality: "accounts" });
  assert.equal(script.calls[16].url, "https://api.apollo.io/api/v1/labels/remove_entity_ids_from_label_names");
  const usage = await script.api.getApiUsageStats();
  assert.equal(JSON.stringify(usage), JSON.stringify({ "[\"api/v1/contacts\", \"search\"]": { day: { limit: 6000, consumed: 1, left_over: 5999 } } }));
  assert.equal(script.calls[17].method, "POST");
  assert.equal(script.calls[17].url, "https://api.apollo.io/api/v1/usage_stats/api_usage_stats");
  assert.equal(script.calls[17].payload, undefined);
  await script.api.getCreditUsageStats();
  assert.equal(script.calls[18].url, "https://api.apollo.io/api/v1/usage_stats/credit_usage_stats");
  assert.equal(script.calls[18].payload, undefined);
});

test("validation fails before a request and Apollo errors omit the API key", async () => {
  const script = loadScript(() => ({ status: 200, body: {} }));
  const reject = async (fn, pattern) => {
    const before = script.calls.length;
    await assert.rejects(fn, pattern);
    assert.equal(script.calls.length, before);
  };
  await reject(() => script.api.searchPeople(), /APOLLO_INVALID_INPUT: input must be an object/);
  await reject(() => script.api.searchPeople({ page: "1" }), /APOLLO_INVALID_INPUT: page must be an integer/);
  await reject(() => script.api.enrichPerson({ reveal_phone_number: true }), /APOLLO_INVALID_INPUT: webhook_url is required when reveal_phone_number is true/);
  await reject(() => script.api.enrichPerson({ poll_only: true, webhook_url: "https://example.com/hook" }), /APOLLO_INVALID_INPUT: webhook_url cannot be set when poll_only is true/);
  await reject(() => script.api.bulkEnrichPeople({ details: [] }), /APOLLO_INVALID_INPUT: details must contain 1 to 10 people/);
  await reject(() => script.api.enrichOrganization({ name: "Apollo" }), /APOLLO_INVALID_INPUT: domain, linkedin_url, or website is required/);
  await reject(() => script.api.bulkEnrichOrganizations({}), /APOLLO_INVALID_INPUT: domains\[\] or details is required/);
  await reject(() => script.api.getContact({}), /APOLLO_INVALID_INPUT: contact_id is required/);
  await reject(() => script.api.addContactsToSequence({ sequence_id: "sequence-1", emailer_campaign_id: "sequence-1", send_email_from_email_account_id: "mailbox-1" }), /APOLLO_INVALID_INPUT: contact_ids\[\] or label_names\[\] is required/);
  await reject(() => script.api.addContactsToSequence({ sequence_id: "sequence-1", emailer_campaign_id: "sequence-1", "label_names[]": ["Maui"], send_email_from_email_account_id: "mailbox-1", auto_unpause_at: "2026-01-01T00:00:00Z", status: "active" }), /APOLLO_INVALID_INPUT: auto_unpause_at requires status paused/);
  await reject(() => script.api.createLabel({ name: "Maui", modality: "people" }), /APOLLO_INVALID_INPUT: modality must be contacts or accounts/);
  await reject(() => script.api.addToLabels({ entity_ids: [], label_names: ["Maui"], modality: "contacts" }), /APOLLO_INVALID_INPUT: entity_ids is required/);
  const failed = loadScript(() => ({ status: 401, body: { error: `bad key ${API_KEY}`, error_code: "INVALID_API_KEY" } }));
  await assert.rejects(() => failed.api.listEmailAccounts(), (error) => {
    assert.equal(error.message, "APOLLO_REQUEST_FAILED: 401 bad key [redacted]");
    assert.equal(error.message.includes(API_KEY), false);
    return true;
  });
  const detailed = loadScript(() => ({ status: 422, body: { error_details: { code: "INPUT.VALIDATION.FAILED", message: `see ${API_KEY}` } } }));
  await assert.rejects(() => detailed.api.getApiUsageStats(), (error) => {
    assert.equal(error.message, "APOLLO_REQUEST_FAILED: 422 see [redacted]");
    assert.equal(error.message.includes(API_KEY), false);
    return true;
  });
  const text = loadScript(() => ({ status: 500, body: `upstream ${API_KEY}` }));
  await assert.rejects(() => text.api.getCreditUsageStats(), /APOLLO_REQUEST_FAILED: 500 upstream \[redacted\]/);
  assert.equal(script.api.searchAndEnrichPeople, undefined);
});

const declaredFunctions = () => readdirSync(root).filter((name) => name.endsWith(".js")).flatMap((name) => {
  const source = readFileSync(join(root, name), "utf8");
  return [...source.matchAll(/^(?:async )?function ([A-Za-z0-9]+)\(/gm)].map((match) => match[1]);
}).sort();

test("added endpoints use the documented method and path", async () => {
  const script = loadScript(() => ({ body: { echoed: true } }));
  const cases = [
    ["getPerson", { id: "person-1" }, "GET", "/api/v1/people/person-1"],
    ["getOrganization", { id: "org-1" }, "GET", "/api/v1/organizations/org-1"],
    ["listOrganizationJobPostings", { organization_id: "org-1", page: 2 }, "GET", "/api/v1/organizations/org-1/job_postings", { page: "2" }],
    ["getAccount", { id: "account-1" }, "GET", "/api/v1/accounts/account-1"],
    ["bulkCreateAccounts", { accounts: [{ name: "Example" }] }, "POST", "/api/v1/accounts/bulk_create", null, { accounts: [{ name: "Example" }] }],
    ["bulkUpdateAccounts", { account_ids: ["account-1"], name: "Renamed" }, "POST", "/api/v1/accounts/bulk_update", null, { account_ids: ["account-1"], name: "Renamed" }],
    ["updateAccountOwners", { "account_ids[]": ["account-1"], owner_id: "user-1" }, "POST", "/api/v1/accounts/update_owners", { "account_ids[]": ["account-1"], owner_id: "user-1" }],
    ["listAccountStages", null, "GET", "/api/v1/account_stages"],
    ["bulkCreateContacts", { contacts: [{ email: "ada@example.com" }] }, "POST", "/api/v1/contacts/bulk_create", null, { contacts: [{ email: "ada@example.com" }] }],
    ["bulkUpdateContacts", { contact_ids: ["contact-1"], title: "VP" }, "POST", "/api/v1/contacts/bulk_update", null, { contact_ids: ["contact-1"], title: "VP" }],
    ["updateContactStages", { "contact_ids[]": ["contact-1"], contact_stage_id: "stage-1" }, "POST", "/api/v1/contacts/update_stages", { "contact_ids[]": ["contact-1"], contact_stage_id: "stage-1" }],
    ["updateContactOwners", { "contact_ids[]": ["contact-1"], owner_id: "user-1" }, "POST", "/api/v1/contacts/update_owners", { "contact_ids[]": ["contact-1"], owner_id: "user-1" }],
    ["listContactStages", null, "GET", "/api/v1/contact_stages"],
    ["listContactDeals", { contact_id: "contact-1" }, "POST", "/api/v1/contacts/contact-1/opportunities"],
    ["listEmailSchedules", null, "GET", "/api/v1/emailer_schedules"],
    ["createDeal", { name: "Expansion" }, "POST", "/api/v1/opportunities", null, { name: "Expansion" }],
    ["listDeals", { page: 1 }, "GET", "/api/v1/opportunities/search", { page: "1" }],
    ["getDeal", { opportunity_id: "deal-1" }, "GET", "/api/v1/opportunities/deal-1"],
    ["updateDeal", { opportunity_id: "deal-1", name: "Expansion" }, "PATCH", "/api/v1/opportunities/deal-1", null, { name: "Expansion" }],
    ["listDealStages", null, "GET", "/api/v1/opportunity_stages"],
    ["createSequence", { name: "Outbound" }, "POST", "/api/v1/sequences", null, { name: "Outbound" }],
    ["updateSequence", { id: "sequence-1", name: "Outbound" }, "PUT", "/api/v1/sequences/sequence-1", null, { name: "Outbound" }],
    ["updateSequenceContactStatus", { "emailer_campaign_ids[]": ["sequence-1"], "contact_ids[]": ["contact-1"], mode: "stop" }, "POST", "/api/v1/emailer_campaigns/remove_or_stop_contact_ids", { "emailer_campaign_ids[]": ["sequence-1"], "contact_ids[]": ["contact-1"], mode: "stop" }],
    ["activateSequence", { sequence_id: "sequence-1" }, "POST", "/api/v1/emailer_campaigns/sequence-1/approve"],
    ["deactivateSequence", { sequence_id: "sequence-1" }, "POST", "/api/v1/emailer_campaigns/sequence-1/abort"],
    ["archiveSequence", { sequence_id: "sequence-1" }, "POST", "/api/v1/emailer_campaigns/sequence-1/archive"],
    ["getSequenceActivity", { contact_id: "contact-1" }, "POST", "/api/v1/emailer_campaigns/activity_feed", null, { contact_id: "contact-1" }],
    ["createTask", { user_id: "user-1", contact_id: "contact-1", type: "call", status: "scheduled", due_at: "2026-01-01T00:00:00Z" }, "POST", "/api/v1/tasks", null, { user_id: "user-1", contact_id: "contact-1", type: "call", status: "scheduled", due_at: "2026-01-01T00:00:00Z" }],
    ["bulkCreateTasks", { user_id: "user-1", contact_ids: ["contact-1"], type: "call", status: "scheduled", due_at: "2026-01-01T00:00:00Z" }, "POST", "/api/v1/tasks/bulk_create", null, { user_id: "user-1", contact_ids: ["contact-1"], type: "call", status: "scheduled", due_at: "2026-01-01T00:00:00Z" }],
    ["getTask", { id: "task-1" }, "GET", "/api/v1/tasks/task-1"],
    ["updateTask", { id: "task-1", title: "Follow up" }, "PATCH", "/api/v1/tasks/task-1", null, { title: "Follow up" }],
    ["completeTask", { id: "task-1" }, "POST", "/api/v1/tasks/task-1/complete"],
    ["skipTask", { id: "task-1" }, "POST", "/api/v1/tasks/task-1/skip"],
    ["searchTasks", { page: 1 }, "POST", "/api/v1/tasks/search", { page: "1" }],
    ["createEmailDraft", { contact_id: "contact-1", subject: "Hello" }, "POST", "/api/v1/emailer_messages", null, { contact_id: "contact-1", subject: "Hello" }],
    ["sendEmail", { id: "message-1" }, "POST", "/api/v1/emailer_messages/message-1/send_now"],
    ["getEmailContent", { ids: ["message-1"] }, "POST", "/api/v1/emailer_messages/get_content", null, { ids: ["message-1"] }],
    ["getEmailSendStatus", { id: "message-1" }, "POST", "/api/v1/emailer_messages/email_send_status", null, { id: "message-1" }],
    ["searchEmails", { page: 2 }, "GET", "/api/v1/emailer_messages/search", { page: "2" }],
    ["getEmailStats", { id: "message-1" }, "GET", "/api/v1/emailer_messages/message-1/activities"],
    ["searchCalls", { q_keywords: "demo", page: "1" }, "GET", "/api/v1/phone_calls/search", { q_keywords: "demo", page: "1" }],
    ["createCall", { contact_id: "contact-1", logged: true }, "POST", "/api/v1/phone_calls", { contact_id: "contact-1", logged: "true" }],
    ["updateCall", { id: "call-1", note: "Left voicemail" }, "PUT", "/api/v1/phone_calls/call-1", { note: "Left voicemail" }],
    ["searchNewsArticles", { "organization_ids[]": ["org-1"] }, "POST", "/api/v1/news_articles/search", { "organization_ids[]": ["org-1"] }],
    ["listNotes", { contact_id: "contact-1", limit: 25 }, "GET", "/api/v1/notes", { contact_id: "contact-1", limit: "25" }],
    ["queryReport", { metrics: [{ value: "num_emails_sent" }], group_by: [], sorts: [], filters: {}, group_by_totals_selected: false, pivot_group_by_totals_selected: false, date_ranges: [{ modality: "last_30_days" }] }, "POST", "/api/v1/reports/sync_report", null, { metrics: [{ value: "num_emails_sent" }], group_by: [], sorts: [], filters: {}, group_by_totals_selected: false, pivot_group_by_totals_selected: false, date_ranges: [{ modality: "last_30_days" }] }],
    ["searchConversations", { page: 1 }, "POST", "/api/v1/conversations/search", null, { page: 1 }],
    ["getConversation", { id: "conversation-1" }, "GET", "/api/v1/conversations/conversation-1"],
    ["exportConversations", { start_time: "2026-01-01T00:00:00Z", end_time: "2026-01-02T00:00:00Z", email: "ada@example.com" }, "POST", "/api/v1/conversations/export", null, { start_time: "2026-01-01T00:00:00Z", end_time: "2026-01-02T00:00:00Z", email: "ada@example.com" }],
    ["getConversationExport", { id: "export-1" }, "GET", "/api/v1/conversations/export/export-1"],
    ["listFields", { source: "custom" }, "GET", "/api/v1/fields", { source: "custom" }],
    ["createField", { label: "Region", modality: "account", type: "string" }, "POST", "/api/v1/fields", null, { label: "Region", modality: "account", type: "string" }],
    ["updateFields", { fields: [{ id: "field-1", label: "Region" }] }, "PATCH", "/api/v1/fields", null, { fields: [{ id: "field-1", label: "Region" }] }],
    ["listCustomFields", null, "GET", "/api/v1/typed_custom_fields"],
    ["pollWebhookResult", { request_id: "1039995589705121900" }, "GET", "/api/v1/webhook_result/1039995589705121900"],
    ["pollWebhookResult", { request_id: "-1039995589705121900" }, "GET", "/api/v1/webhook_result/-1039995589705121900"],
  ];
  for (const [fn, input, method, pathname, query, body] of cases) {
    const before = script.calls.length;
    const result = input === null ? await script.api[fn]() : await script.api[fn](input);
    assert.equal(JSON.stringify(result), JSON.stringify({ echoed: true }), fn);
    const call = script.calls[before];
    assert.equal(call.method, method, fn);
    const url = new URL(call.url);
    assert.equal(url.origin + url.pathname, `https://api.apollo.io${pathname}`, fn);
    assert.equal(call.headers["X-Api-Key"], API_KEY, fn);
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        const want = Array.isArray(value) ? value : [value];
        assert.deepEqual(url.searchParams.getAll(key), want, `${fn} ${key}`);
      }
    } else {
      assert.equal(url.search, "", fn);
    }
    if (body) assert.equal(call.payload, JSON.stringify(body), fn);
    else assert.equal(call.payload, undefined, fn);
  }
  const coveredEarlier = ["searchPeople", "enrichPerson", "bulkEnrichPeople", "searchOrganizations", "enrichOrganization", "bulkEnrichOrganizations", "createContact", "updateContact", "searchContacts", "getContact", "createAccount", "updateAccount", "searchAccounts", "searchSequences", "addContactsToSequence", "listEmailAccounts", "listUsers", "getCurrentUser", "listLabels", "createLabel", "updateLabel", "addToLabels", "removeFromLabels", "getApiUsageStats", "getCreditUsageStats"];
  assert.deepEqual([...new Set([...coveredEarlier, ...cases.map((item) => item[0])])].sort(), declaredFunctions());
});

test("added endpoints reject invalid input before the request", async () => {
  const script = loadScript(() => ({ body: {} }));
  const reject = (fn, error) => assert.rejects(fn, error);
  await reject(() => script.api.getPerson({}), /APOLLO_INVALID_INPUT: id is required/);
  await reject(() => script.api.bulkCreateContacts({ contacts: [] }), /APOLLO_INVALID_INPUT: contacts must contain 1 to 100 items/);
  await reject(() => script.api.bulkUpdateAccounts({ async: true, account_attributes: [{ id: "account-1" }] }), /APOLLO_INVALID_INPUT: async is not supported with account_attributes/);
  await reject(() => script.api.updateSequenceContactStatus({ "emailer_campaign_ids[]": ["sequence-1"], "contact_ids[]": ["contact-1"], mode: "pause" }), /APOLLO_INVALID_INPUT: mode must be mark_as_finished, remove, or stop/);
  await reject(() => script.api.createEmailDraft({}), /APOLLO_INVALID_INPUT: contact_id is required/);
  await reject(() => script.api.createTask({ user_id: "user-1", contact_id: "contact-1", type: "call", status: "scheduled", due_at: "2026-01-01T00:00:00Z", priority: "urgent" }), /APOLLO_INVALID_INPUT: priority must be high, medium, or low/);
  await reject(() => script.api.searchNewsArticles({}), /APOLLO_INVALID_INPUT: organization_ids\[\] is required/);
  await reject(() => script.api.listNotes({ limit: 101 }), /APOLLO_INVALID_INPUT: limit must be an integer from 1 to 100/);
  await reject(() => script.api.queryReport({ metrics: [], group_by: [], sorts: [], filters: {}, group_by_totals_selected: false, pivot_group_by_totals_selected: false, date_ranges: [{}] }), /APOLLO_INVALID_INPUT: metrics must contain at least 1 item/);
  await reject(() => script.api.updateFields({ fields: [{ id: "field-1" }, { id: "field-2" }] }), /APOLLO_INVALID_INPUT: fields must contain 1 item/);
  await reject(() => script.api.pollWebhookResult({ request_id: 1039995589705121900 }), /APOLLO_INVALID_INPUT: request_id must be a decimal string/);
  await reject(() => script.api.pollWebhookResult({ request_id: 15 }), /APOLLO_INVALID_INPUT: request_id must be a decimal string/);
  await reject(() => script.api.listFields({ source: "all" }), /APOLLO_INVALID_INPUT: source must be system, custom, or crm_synced/);
  assert.equal(script.calls.length, 0);
});

test("public functions are the operations table", () => {
  const readme = readFileSync(join(root, "README.md"), "utf8");
  const operations = readme.slice(readme.indexOf("## Operations"), readme.indexOf("## Errors"));
  const documented = [...operations.matchAll(/^\| `([A-Za-z0-9]+)` \|/gm)].map((match) => match[1]).sort();
  const declared = declaredFunctions();
  assert.equal(documented.length, 80);
  assert.deepEqual(declared, documented);
});
