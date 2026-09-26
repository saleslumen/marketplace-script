import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { createContext, runInContext } from "node:vm";

const root = dirname(fileURLToPath(import.meta.url));
const API_KEY = "lin_api_test_secret";
const PAGE_INFO = "pageInfo { hasNextPage hasPreviousPage startCursor endCursor }";
const loadScript = (handler) => {
  const calls = [];
  const context = createContext({
    ConnectionApp: {
      getApiKey: async (key) => {
        if (key === "linear") return API_KEY;
        throw new Error("AUTH_NOT_CONNECTED: " + key);
      },
    },
    ScriptContext: { configuration: { teamId: "configured-team" } },
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
        const result = handler ? await handler({ url, payload }) : { status: 200, body: { data: {} } };
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
const dataScript = () => {
  const data = { marker: "linear-data" };
  const script = loadScript(() => ({ status: 200, body: { data } }));
  const call = async (fn, input) => {
    const before = script.calls.length;
    const result = await script.api[fn](input);
    same(result, data);
    const sent = script.calls[before];
    assert.equal(sent.url, "https://api.linear.app/graphql");
    assert.equal(sent.method, "POST");
    assert.equal(sent.headers.Authorization, API_KEY);
    assert.equal(sent.headers["Content-Type"], "application/json");
    assert.equal(sent.headers.Accept, "application/json");
    assert.equal(sent.muteHttpExceptions, true);
    assert.equal(JSON.stringify(sent.payload).includes(API_KEY), false);
    assert.equal(JSON.stringify(result).includes(API_KEY), false);
    return sent.payload;
  };
  return { script, call };
};
const includes = (query, parts) => {
  parts.forEach((part) => assert.equal(query.includes(part), true, part));
};
const same = (actual, expected) => assert.equal(JSON.stringify(actual), JSON.stringify(expected));

test("issue operations send the documented query and variables", async () => {
  const { call } = dataScript();
  const created = { teamId: "team-1", title: "Bug", description: "details", labelIds: ["label-1"], priority: 2 };
  const createPayload = await call("issueCreate", { input: created, id: "ignored" });
  assert.equal(createPayload.query.startsWith("mutation IssueCreate($input: IssueCreateInput!) { issueCreate(input: $input) { "), true);
  same(createPayload.variables, { input: created });
  const templatePayload = await call("issueCreate", { input: { teamId: "team-1", templateId: "template-1" } });
  same(templatePayload.variables, { input: { teamId: "team-1", templateId: "template-1" } });
  includes(createPayload.query, ["success lastSyncId", "identifier", "title", "description", "assignee { id name }", "state { id name type color position }", "team { id key name }", "project { id name }"]);
  const patch = { title: "Next", stateId: "state-1" };
  const updatePayload = await call("issueUpdate", { id: "BLA-1", input: patch, issueId: "nope" });
  assert.equal(updatePayload.query.startsWith("mutation IssueUpdate($id: String!, $input: IssueUpdateInput!) { issueUpdate(id: $id, input: $input) { "), true);
  same(updatePayload.variables, { id: "BLA-1", input: patch });
  const issuePayload = await call("issue", { id: "BLA-1", issueId: "other" });
  assert.equal(issuePayload.query.startsWith("query Issue($id: String!) { issue(id: $id) { "), true);
  same(issuePayload.variables, { id: "BLA-1" });
  const filter = { team: { id: { eq: "team-1" } } };
  const listPayload = await call("issues", {
    after: "a",
    before: "b",
    filter,
    first: 10,
    includeArchived: true,
    last: 2,
    orderBy: "updatedAt",
    sort: [{ createdAt: "Descending" }],
    teamId: "team-1",
  });
  assert.equal(listPayload.query.startsWith("query Issues($after: String, $before: String, $filter: IssueFilter, $first: Int, $includeArchived: Boolean, $last: Int, $orderBy: PaginationOrderBy) { issues(after: $after, before: $before, filter: $filter, first: $first, includeArchived: $includeArchived, last: $last, orderBy: $orderBy) { "), true);
  same(listPayload.variables, { after: "a", before: "b", filter, first: 10, includeArchived: true, last: 2, orderBy: "updatedAt" });
  includes(listPayload.query, ["nodes {", PAGE_INFO]);
  const omitted = await call("issues", {});
  same(omitted.variables, {});
  assert.equal(omitted.query.includes("includeArchived: false"), false);
  const searchPayload = await call("searchIssues", { term: "login", teamId: "team-1", includeComments: true, first: 5, orderBy: "updatedAt" });
  assert.equal(searchPayload.query.startsWith("query SearchIssues($after: String, $before: String, $filter: IssueFilter, $first: Int, $includeArchived: Boolean, $includeComments: Boolean, $last: Int, $orderBy: PaginationOrderBy, $teamId: String, $term: String!) { searchIssues(after: $after, before: $before, filter: $filter, first: $first, includeArchived: $includeArchived, includeComments: $includeComments, last: $last, orderBy: $orderBy, teamId: $teamId, term: $term) { "), true);
  same(searchPayload.variables, { first: 5, includeComments: true, orderBy: "updatedAt", teamId: "team-1", term: "login" });
  includes(searchPayload.query, ["totalCount", "metadata", PAGE_INFO]);
  const deletePayload = await call("issueDelete", { id: "BLA-1", permanentlyDelete: true, trash: true });
  assert.equal(deletePayload.query.startsWith("mutation IssueDelete($id: String!, $permanentlyDelete: Boolean) { issueDelete(id: $id, permanentlyDelete: $permanentlyDelete) { "), true);
  same(deletePayload.variables, { id: "BLA-1", permanentlyDelete: true });
  includes(deletePayload.query, ["success lastSyncId", "entity {"]);
  const archivePayload = await call("issueArchive", { id: "BLA-1", trash: false });
  assert.equal(archivePayload.query.startsWith("mutation IssueArchive($id: String!, $trash: Boolean) { issueArchive(id: $id, trash: $trash) { "), true);
  same(archivePayload.variables, { id: "BLA-1", trash: false });
  includes(archivePayload.query, ["entity {"]);
  const unarchivePayload = await call("issueUnarchive", { id: "BLA-1", trash: true });
  assert.equal(unarchivePayload.query.startsWith("mutation IssueUnarchive($id: String!) { issueUnarchive(id: $id) { "), true);
  same(unarchivePayload.variables, { id: "BLA-1" });
  includes(unarchivePayload.query, ["entity {"]);
});

test("comment operations send the documented query and variables", async () => {
  const { call } = dataScript();
  const created = { issueId: "BLA-1", body: "Noted" };
  const createPayload = await call("commentCreate", { input: created });
  assert.equal(createPayload.query.startsWith("mutation CommentCreate($input: CommentCreateInput!) { commentCreate(input: $input) { "), true);
  same(createPayload.variables, { input: created });
  includes(createPayload.query, ["success lastSyncId", "body", "issueId", "user { id name }"]);
  const patch = { body: "Updated" };
  const updatePayload = await call("commentUpdate", { id: "comment-1", input: patch, body: "alias" });
  assert.equal(updatePayload.query.startsWith("mutation CommentUpdate($id: String!, $input: CommentUpdateInput!) { commentUpdate(id: $id, input: $input) { "), true);
  same(updatePayload.variables, { id: "comment-1", input: patch });
  const deletePayload = await call("commentDelete", { id: "comment-1" });
  assert.equal(deletePayload.query.startsWith("mutation CommentDelete($id: String!) { commentDelete(id: $id) { "), true);
  same(deletePayload.variables, { id: "comment-1" });
  includes(deletePayload.query, ["success lastSyncId entityId"]);
  const filter = { issue: { id: { eq: "BLA-1" } } };
  const listPayload = await call("comments", { filter, first: 20, includeArchived: false, orderBy: "createdAt", issueId: "BLA-1" });
  assert.equal(listPayload.query.startsWith("query Comments($after: String, $before: String, $filter: CommentFilter, $first: Int, $includeArchived: Boolean, $last: Int, $orderBy: PaginationOrderBy) { comments(after: $after, before: $before, filter: $filter, first: $first, includeArchived: $includeArchived, last: $last, orderBy: $orderBy) { "), true);
  same(listPayload.variables, { filter, first: 20, includeArchived: false, orderBy: "createdAt" });
  includes(listPayload.query, ["nodes {", PAGE_INFO]);
});

test("team, workflow state, label, project, and user operations send the documented query and variables", async () => {
  const { call } = dataScript();
  const teamFilter = { key: { eq: "ENG" } };
  const teamsPayload = await call("teams", { filter: teamFilter, first: 50, orderBy: "updatedAt" });
  assert.equal(teamsPayload.query.startsWith("query Teams($after: String, $before: String, $filter: TeamFilter, $first: Int, $includeArchived: Boolean, $last: Int, $orderBy: PaginationOrderBy) { teams(after: $after, before: $before, filter: $filter, first: $first, includeArchived: $includeArchived, last: $last, orderBy: $orderBy) { "), true);
  same(teamsPayload.variables, { filter: teamFilter, first: 50, orderBy: "updatedAt" });
  includes(teamsPayload.query, ["id name key", PAGE_INFO]);
  const teamPayload = await call("team", { id: "team-1", teamId: "other" });
  assert.equal(teamPayload.query.startsWith("query Team($id: String!) { team(id: $id) { "), true);
  same(teamPayload.variables, { id: "team-1" });
  includes(teamPayload.query, ["key", "visibility", "triageEnabled"]);
  const statePayload = await call("workflowStates", { filter: { team: { id: { eq: "team-1" } } }, includeArchived: true });
  assert.equal(statePayload.query.startsWith("query WorkflowStates($after: String, $before: String, $filter: WorkflowStateFilter, $first: Int, $includeArchived: Boolean, $last: Int, $orderBy: PaginationOrderBy) { workflowStates(after: $after, before: $before, filter: $filter, first: $first, includeArchived: $includeArchived, last: $last, orderBy: $orderBy) { "), true);
  same(statePayload.variables, { filter: { team: { id: { eq: "team-1" } } }, includeArchived: true });
  includes(statePayload.query, ["name", "type", "team { id key name }", PAGE_INFO]);
  const labelPayload = await call("issueLabels", { first: 25 });
  assert.equal(labelPayload.query.startsWith("query IssueLabels($after: String, $before: String, $filter: IssueLabelFilter, $first: Int, $includeArchived: Boolean, $last: Int, $orderBy: PaginationOrderBy) { issueLabels(after: $after, before: $before, filter: $filter, first: $first, includeArchived: $includeArchived, last: $last, orderBy: $orderBy) { "), true);
  same(labelPayload.variables, { first: 25 });
  includes(labelPayload.query, ["isGroup", PAGE_INFO]);
  const projectPayload = await call("projects", { orderBy: "updatedAt", includeArchived: false });
  assert.equal(projectPayload.query.startsWith("query Projects($after: String, $before: String, $filter: ProjectFilter, $first: Int, $includeArchived: Boolean, $last: Int, $orderBy: PaginationOrderBy) { projects(after: $after, before: $before, filter: $filter, first: $first, includeArchived: $includeArchived, last: $last, orderBy: $orderBy) { "), true);
  same(projectPayload.variables, { includeArchived: false, orderBy: "updatedAt" });
  includes(projectPayload.query, ["slugId", "status { id name type color position }", "lead { id name }", PAGE_INFO]);
  const viewerPayload = await call("viewer", {});
  assert.equal(viewerPayload.query.startsWith("query Viewer { viewer { "), true);
  assert.equal(viewerPayload.variables, undefined);
  includes(viewerPayload.query, ["id", "name", "displayName", "email"]);
  const usersPayload = await call("users", { includeDisabled: true, filter: { email: { eq: "ada@linear.app" } }, first: 10 });
  assert.equal(usersPayload.query.startsWith("query Users($after: String, $before: String, $filter: UserFilter, $first: Int, $includeArchived: Boolean, $includeDisabled: Boolean, $last: Int, $orderBy: PaginationOrderBy) { users(after: $after, before: $before, filter: $filter, first: $first, includeArchived: $includeArchived, includeDisabled: $includeDisabled, last: $last, orderBy: $orderBy) { "), true);
  same(usersPayload.variables, { filter: { email: { eq: "ada@linear.app" } }, first: 10, includeDisabled: true });
  includes(usersPayload.query, [PAGE_INFO]);
});

test("attachment operations send the documented query and variables", async () => {
  const { call } = dataScript();
  const created = { issueId: "BLA-1", title: "Spec", url: "https://example.com/spec", subtitle: "Docs" };
  const createPayload = await call("attachmentCreate", { input: created });
  assert.equal(createPayload.query.startsWith("mutation AttachmentCreate($input: AttachmentCreateInput!) { attachmentCreate(input: $input) { "), true);
  same(createPayload.variables, { input: created });
  includes(createPayload.query, ["success lastSyncId", "title", "url", "issue { id identifier }"]);
  const deletePayload = await call("attachmentDelete", { id: "attachment-1" });
  assert.equal(deletePayload.query.startsWith("mutation AttachmentDelete($id: String!) { attachmentDelete(id: $id) { "), true);
  same(deletePayload.variables, { id: "attachment-1" });
  includes(deletePayload.query, ["success lastSyncId entityId"]);
});

test("webhook operations send the documented query and variables", async () => {
  const { call } = dataScript();
  const created = { url: "https://example.com/hook", resourceTypes: ["Issue"], teamId: "team-1", label: "Deploys", enabled: false };
  const createPayload = await call("webhookCreate", { input: created });
  assert.equal(createPayload.query.startsWith("mutation WebhookCreate($input: WebhookCreateInput!) { webhookCreate(input: $input) { "), true);
  same(createPayload.variables, { input: created });
  includes(createPayload.query, ["success lastSyncId", "url", "enabled", "resourceTypes", "secret", "team { id key name }"]);
  const allTeams = { url: "https://example.com/hook", resourceTypes: ["Comment", "Issue"], allPublicTeams: true };
  const allPayload = await call("webhookCreate", { input: allTeams });
  same(allPayload.variables, { input: allTeams });
  const listPayload = await call("webhooks", { first: 10, includeArchived: true, filter: { enabled: { eq: true } } });
  assert.equal(listPayload.query.startsWith("query Webhooks($after: String, $before: String, $first: Int, $includeArchived: Boolean, $last: Int, $orderBy: PaginationOrderBy) { webhooks(after: $after, before: $before, first: $first, includeArchived: $includeArchived, last: $last, orderBy: $orderBy) { "), true);
  same(listPayload.variables, { first: 10, includeArchived: true });
  includes(listPayload.query, [PAGE_INFO]);
  const patch = { enabled: false, url: "https://example.com/next" };
  const updatePayload = await call("webhookUpdate", { id: "webhook-1", input: patch });
  assert.equal(updatePayload.query.startsWith("mutation WebhookUpdate($id: String!, $input: WebhookUpdateInput!) { webhookUpdate(id: $id, input: $input) { "), true);
  same(updatePayload.variables, { id: "webhook-1", input: patch });
  const deletePayload = await call("webhookDelete", { id: "webhook-1" });
  assert.equal(deletePayload.query.startsWith("mutation WebhookDelete($id: String!) { webhookDelete(id: $id) { "), true);
  same(deletePayload.variables, { id: "webhook-1" });
});

test("graphql sends the caller query and variables", async () => {
  const { call } = dataScript();
  const query = "query Issue($id: String!) { issue(id: $id) { id title } }";
  const payload = await call("graphql", { query, variables: { id: "BLA-9" } });
  assert.equal(payload.query, query);
  same(payload.variables, { id: "BLA-9" });
  const bare = await call("graphql", { query: "query { viewer { id } }" });
  assert.equal(bare.query, "query { viewer { id } }");
  assert.equal(bare.variables, undefined);
  same(Object.keys(bare), ["query"]);
});

test("required inputs throw LINEAR_INVALID_INPUT and do not call Linear", async () => {
  const script = loadScript(() => ({ status: 200, body: { data: {} } }));
  const rejects = async (fn, input, message) => {
    await assert.rejects(() => script.api[fn](input), (error) => {
      assert.equal(error.message, message);
      return true;
    });
  };
  await rejects("issueCreate", null, "LINEAR_INVALID_INPUT: input must be an object");
  await rejects("issueCreate", {}, "LINEAR_INVALID_INPUT: input must be an object");
  await rejects("issueCreate", { input: { title: "Bug" } }, "LINEAR_INVALID_INPUT: input.teamId is required");
  await rejects("issueCreate", { input: { teamId: "   " } }, "LINEAR_INVALID_INPUT: input.teamId is required");
  await rejects("issue", { issueId: "BLA-1" }, "LINEAR_INVALID_INPUT: id is required");
  await rejects("issueUpdate", { id: "BLA-1" }, "LINEAR_INVALID_INPUT: input must be an object");
  await rejects("searchIssues", {}, "LINEAR_INVALID_INPUT: term is required");
  await rejects("searchIssues", { term: " " }, "LINEAR_INVALID_INPUT: term is required");
  await rejects("commentDelete", { id: "" }, "LINEAR_INVALID_INPUT: id is required");
  await rejects("attachmentCreate", { input: { issueId: "i", title: "t" } }, "LINEAR_INVALID_INPUT: input.url is required");
  await rejects("webhookCreate", { input: { url: "https://example.com/hook", resourceTypes: ["Issue"] } }, "LINEAR_INVALID_INPUT: input.teamId or input.allPublicTeams is required");
  await rejects("webhookCreate", { input: { url: "https://example.com/hook", resourceTypes: ["Issue", ""], teamId: "team" } }, "LINEAR_INVALID_INPUT: input.resourceTypes[1] is required");
  await rejects("webhookCreate", { input: { url: "https://example.com/hook", teamId: "team" } }, "LINEAR_INVALID_INPUT: input.resourceTypes is required");
  await rejects("graphql", { variables: { id: "1" } }, "LINEAR_INVALID_INPUT: query is required");
  await rejects("graphql", { query: "query { viewer { id } }", variables: [] }, "LINEAR_INVALID_INPUT: variables must be an object");
  await rejects("viewer", undefined, "LINEAR_INVALID_INPUT: input must be an object");
  assert.equal(script.calls.length, 0);
  ["createIssue", "getIssue", "updateIssue", "getTeamId", "findIssueByCorrelation", "evaluateWebhookIssueUpdate"].forEach((name) => {
    assert.equal(script.api[name], undefined);
  });
});

test("GraphQL errors and non-2xx responses throw LINEAR_REQUEST_FAILED without the key", async () => {
  const partial = loadScript(() => ({
    status: 200,
    body: { data: { issue: { id: "1" } }, errors: [{ message: "access denied" }, { message: "second" }] },
  }));
  await assert.rejects(() => partial.api.issue({ id: "BLA-1" }), (error) => {
    assert.equal(error.message, "LINEAR_REQUEST_FAILED: 200 access denied");
    assert.equal(error.message.includes(API_KEY), false);
    return true;
  });
  const denied = loadScript(() => ({ status: 401, body: { errors: [{ message: "Authentication rejected " + API_KEY }] } }));
  await assert.rejects(() => denied.api.viewer({}), (error) => {
    assert.equal(error.message, "LINEAR_REQUEST_FAILED: 401 Authentication rejected");
    assert.equal(error.message.includes(API_KEY), false);
    return true;
  });
  const keyOnly = loadScript(() => ({ status: 200, body: { errors: [{ message: API_KEY }] } }));
  await assert.rejects(() => keyOnly.api.viewer({}), /LINEAR_REQUEST_FAILED: 200 request failed/);
  const messageBody = loadScript(() => ({ status: 400, body: { message: "bad request " + API_KEY } }));
  await assert.rejects(() => messageBody.api.viewer({}), (error) => {
    assert.equal(error.message, "LINEAR_REQUEST_FAILED: 400 bad request");
    return true;
  });
  const html = loadScript(() => ({ status: 502, body: "<html>" + API_KEY + "</html>" }));
  await assert.rejects(() => html.api.viewer({}), (error) => {
    assert.equal(error.message, "LINEAR_REQUEST_FAILED: 502 <html></html>");
    assert.equal(error.message.includes(API_KEY), false);
    return true;
  });
  const empty = loadScript(() => ({ status: 500, body: "" }));
  await assert.rejects(() => empty.api.viewer({}), /LINEAR_REQUEST_FAILED: 500 request failed/);
  const text = loadScript(() => ({ status: 200, body: "not-json" }));
  await assert.rejects(() => text.api.viewer({}), /LINEAR_REQUEST_FAILED: 200 not-json/);
  const bareData = loadScript(() => ({ status: 200, body: { data: null } }));
  assert.equal(await bareData.api.viewer({}), null);
  const extended = loadScript(() => ({ status: 200, body: { data: { viewer: { id: "user-1" } }, extensions: { requestId: "req-1" } } }));
  same(await extended.api.viewer({}), { viewer: { id: "user-1" } });
});

test("readme operations exist and the installation does not store a team id", () => {
  const readme = readFileSync(join(root, "README.md"), "utf8");
  const names = [...readme.matchAll(/^\| `([A-Za-z]+)` \|/gm)].map((match) => match[1]);
  const script = loadScript();
  assert.equal(names.length, 26);
  names.forEach((name) => assert.equal(typeof script.api[name], "function", name));
  const manifest = JSON.parse(readFileSync(join(root, "appsscript.json"), "utf8"));
  assert.equal(manifest.marketplace.configuration, undefined);
  same(manifest.marketplace.permissions.storage, []);
  same(manifest.marketplace.permissions.externalDomains, ["https://api.linear.app"]);
  assert.equal(manifest.marketplace.connections[0].kind, "API_KEY");
  assert.equal(manifest.marketplace.connections[0].key, "linear");
  const source = readdirSync(root).filter((name) => name.endsWith(".js")).map((name) => readFileSync(join(root, name), "utf8")).join("\n");
  ["correlation", "ScriptContext", "evaluateWebhookIssueUpdate", "findIssueByCorrelation", "getTeamId", "createIssue", "reopen"].forEach((token) => {
    assert.equal(source.includes(token), false, token);
  });
});
