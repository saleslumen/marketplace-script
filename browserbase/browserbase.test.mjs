import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { createContext, runInContext } from "node:vm";

const root = dirname(fileURLToPath(import.meta.url));
const same = (actual, expected) => assert.equal(JSON.stringify(actual), JSON.stringify(expected));
const loadScript = (handler) => {
  const calls = [];
  const context = createContext({
    ConnectionApp: { getApiKey: async () => "bb-test-key" },
    UrlFetchApp: {
      fetch: async (url, options = {}) => {
        calls.push({
          url,
          method: String(options.method || "GET").toUpperCase(),
          payload: options.payload,
          contentType: options.headers && options.headers["Content-Type"],
          accept: options.headers && options.headers.Accept,
          apiKey: options.headers && options.headers["X-BB-API-Key"],
        });
        const result = await handler({ url, method: String(options.method || "GET").toUpperCase(), headers: options.headers || {}, calls });
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

const vendor = ({ url, method, headers }) => {
  if (headers.Accept === "application/octet-stream") return { body: "file-bytes" };
  if (headers.Accept === "application/vnd.apple.mpegurl") return { body: "#EXTM3U\n" };
  if (method === "DELETE") return { body: "" };
  if (method === "POST" && url.endsWith("/v1/sessions")) {
    return { status: 201, body: { id: "ses/1", connectUrl: "wss://connect", seleniumRemoteUrl: "https://selenium", signingKey: "sig", status: "RUNNING" } };
  }
  if (url.endsWith("/logs")) return { body: [{ method: "Page.navigate", pageId: 0, sessionId: "ses/1" }] };
  if (url.endsWith("/replays")) return { body: { pages: [{ pageId: "0", url: "https://example", startTimeMs: 0, endTimeMs: 1 }], pageCount: 1 } };
  return { body: { marker: `${method} ${url}` } };
};

test("session operations send the documented request and return the Browserbase body", async () => {
  const script = loadScript(vendor);
  const createdFromAliases = await script.api.createSession({ country: "US", sessionId: "old", proxyCountry: "DE", browserbaseSessionId: "x" });
  same(createdFromAliases, { id: "ses/1", connectUrl: "wss://connect", seleniumRemoteUrl: "https://selenium", signingKey: "sig", status: "RUNNING" });
  assert.equal(script.calls[0].method, "POST");
  assert.equal(script.calls[0].url, "https://api.browserbase.com/v1/sessions");
  assert.equal(script.calls[0].payload, "{}");
  assert.equal(script.calls[0].apiKey, "bb-test-key");
  assert.equal(script.calls.length, 1);
  const created = await script.api.createSession({
    projectId: "prj_1",
    extensionId: "ext_1",
    browserSettings: {
      context: { id: "ctx_1", persist: true },
      extensionId: "ext_2",
      viewport: { width: 1280, height: 720 },
      blockAds: true,
      solveCaptchas: false,
      recordSession: true,
      logSession: false,
      advancedStealth: false,
      verified: true,
      captchaImageSelector: "#img",
      captchaInputSelector: "#input",
      os: "linux",
      allowedDomains: ["example.com"],
      ignoreCertificateErrors: true,
    },
    timeout: 120,
    keepAlive: true,
    proxies: [
      { type: "browserbase", geolocation: { country: "us", state: "ny", city: "New York" }, domainPattern: "example.com" },
      { type: "external", server: "https://proxy.example", username: "user", password: "pw", domainPattern: "*.example" },
      { type: "none" },
    ],
    proxySettings: { caCertificates: ["11111111-1111-1111-1111-111111111111"] },
    region: "eu-central-1",
    userMetadata: { order: "42" },
    country: "DE",
  });
  assert.equal(created.connectUrl, "wss://connect");
  assert.deepEqual(JSON.parse(script.calls[1].payload), {
    projectId: "prj_1",
    extensionId: "ext_1",
    browserSettings: {
      context: { id: "ctx_1", persist: true },
      extensionId: "ext_2",
      viewport: { width: 1280, height: 720 },
      blockAds: true,
      solveCaptchas: false,
      recordSession: true,
      logSession: false,
      advancedStealth: false,
      verified: true,
      captchaImageSelector: "#img",
      captchaInputSelector: "#input",
      os: "linux",
      allowedDomains: ["example.com"],
      ignoreCertificateErrors: true,
    },
    timeout: 120,
    keepAlive: true,
    proxies: [
      { type: "browserbase", geolocation: { country: "us", state: "ny", city: "New York" }, domainPattern: "example.com" },
      { type: "external", server: "https://proxy.example", username: "user", password: "pw", domainPattern: "*.example" },
      { type: "none" },
    ],
    proxySettings: { caCertificates: ["11111111-1111-1111-1111-111111111111"] },
    region: "eu-central-1",
    userMetadata: { order: "42" },
  });
  await script.api.createSession({ proxies: true });
  assert.deepEqual(JSON.parse(script.calls[2].payload), { proxies: true });
  const callsBeforeInvalid = script.calls.length;
  await assert.rejects(() => script.api.createSession({ timeout: 10 }), /BROWSERBASE_REQUEST_FAILED: timeout must be an integer from 60 to 21600/);
  await assert.rejects(() => script.api.getSession({ sessionId: "ses/1" }), /BROWSERBASE_REQUEST_FAILED: id is required/);
  await assert.rejects(() => script.api.updateSession({ id: "ses/1" }), /BROWSERBASE_REQUEST_FAILED: status is required/);
  assert.equal(script.calls.length, callsBeforeInvalid);
  const session = await script.api.getSession({ id: "ses/1" });
  same(session, { marker: "GET https://api.browserbase.com/v1/sessions/ses%2F1" });
  assert.equal(script.calls.at(-1).method, "GET");
  const listed = await script.api.listSessions({ status: "RUNNING", q: "team=acme" });
  same(listed, { marker: "GET https://api.browserbase.com/v1/sessions?status=RUNNING&q=team%3Dacme" });
  const updated = await script.api.updateSession({ id: "ses/1", status: "REQUEST_RELEASE" });
  same(updated, { marker: "POST https://api.browserbase.com/v1/sessions/ses%2F1" });
  assert.equal(script.calls.at(-1).method, "POST");
  assert.deepEqual(JSON.parse(script.calls.at(-1).payload), { status: "REQUEST_RELEASE" });
  assert.equal(script.calls.at(-2).method, "GET");
  const live = await script.api.sessionLiveUrls({ id: "ses/1" });
  same(live, { marker: "GET https://api.browserbase.com/v1/sessions/ses%2F1/debug" });
  const logs = await script.api.sessionLogs({ id: "ses/1" });
  same(logs, [{ method: "Page.navigate", pageId: 0, sessionId: "ses/1" }]);
  const replay = await script.api.getSessionReplay({ id: "ses/1" });
  same(replay, { pages: [{ pageId: "0", url: "https://example", startTimeMs: 0, endTimeMs: 1 }], pageCount: 1 });
  const playlist = await script.api.getReplayPage({ id: "ses/1", pageId: "0" });
  assert.equal(playlist, "#EXTM3U\n");
  assert.equal(script.calls.at(-1).accept, "application/vnd.apple.mpegurl");
  assert.equal(script.calls.at(-1).url, "https://api.browserbase.com/v1/sessions/ses%2F1/replays/0");
  const requested = await script.api.createSessionRecordingDownloads({ id: "ses/1" });
  same(requested, { marker: "POST https://api.browserbase.com/v1/sessions/ses%2F1/recording/downloads" });
  assert.equal(script.calls.at(-1).payload, undefined);
  const recording = await script.api.listSessionRecordingDownloads({ id: "ses/1" });
  same(recording, { marker: "GET https://api.browserbase.com/v1/sessions/ses%2F1/recording/downloads" });
  const uploaded = await script.api.createSessionUploads({ id: "ses/1", file: "hello" });
  same(uploaded, { marker: "POST https://api.browserbase.com/v1/sessions/ses%2F1/uploads" });
  assert.match(script.calls.at(-1).contentType, /^multipart\/form-data; boundary=/);
  assert.match(script.calls.at(-1).payload, /name="file"/);
  assert.match(script.calls.at(-1).payload, /hello/);
  const failed = loadScript(() => ({ status: 404, body: { message: "not found" } }));
  await assert.rejects(() => failed.api.getSession({ id: "missing" }), (error) => {
    assert.equal(error.message, 'BROWSERBASE_REQUEST_FAILED (404): {"message":"not found"}');
    assert.equal(error.message.includes("bb-test-key"), false);
    return true;
  });
});

test("downloads, contexts, extensions, and projects follow the documented paths", async () => {
  const script = loadScript(vendor);
  const listed = await script.api.listDownloads({
    sessionId: "ses/1",
    filename: "report.csv",
    mimeType: "text/csv",
    minSize: 1.5,
    maxSize: 10,
    createdAfter: "2026-01-19T00:00:00Z",
    createdBefore: "2026-01-20T00:00:00Z",
    limit: 20,
    offset: 0,
  });
  same(listed, {
    marker: "GET https://api.browserbase.com/v1/downloads?sessionId=ses%2F1&filename=report.csv&mimeType=text%2Fcsv&minSize=1.5&maxSize=10&createdAfter=2026-01-19T00%3A00%3A00Z&createdBefore=2026-01-20T00%3A00%3A00Z&limit=20&offset=0",
  });
  const metadata = await script.api.getDownload({ id: "dl/1" });
  same(metadata, { marker: "GET https://api.browserbase.com/v1/downloads/dl%2F1" });
  assert.equal(script.calls.at(-1).accept, "application/json");
  const file = await script.api.getDownload({ id: "dl/1", Accept: "application/octet-stream" });
  assert.equal(file, "file-bytes");
  assert.equal(script.calls.at(-1).accept, "application/octet-stream");
  const removed = await script.api.deleteDownload({ id: "dl/1" });
  assert.equal(removed, null);
  assert.equal(script.calls.at(-1).method, "DELETE");
  assert.equal(script.calls.at(-1).payload, undefined);
  const context = await script.api.createContext({ projectId: "prj_1", name: "Signed in" });
  same(context, { marker: "POST https://api.browserbase.com/v1/contexts" });
  assert.deepEqual(JSON.parse(script.calls.at(-1).payload), { projectId: "prj_1", name: "Signed in" });
  await script.api.getContext({ id: "ctx/1" });
  assert.equal(script.calls.at(-1).url, "https://api.browserbase.com/v1/contexts/ctx%2F1");
  assert.equal(await script.api.deleteContext({ id: "ctx/1" }), null);
  const extension = await script.api.uploadExtension({ file: "zip-bytes" });
  same(extension, { marker: "POST https://api.browserbase.com/v1/extensions" });
  assert.match(script.calls.at(-1).payload, /name="file"/);
  assert.match(script.calls.at(-1).payload, /zip-bytes/);
  await script.api.getExtension({ id: "ext/1" });
  assert.equal(script.calls.at(-1).url, "https://api.browserbase.com/v1/extensions/ext%2F1");
  assert.equal(await script.api.deleteExtension({ id: "ext/1" }), null);
  const projects = await script.api.listProjects();
  same(projects, { marker: "GET https://api.browserbase.com/v1/projects" });
  assert.equal(script.calls.at(-1).payload, undefined);
  await script.api.getProject({ id: "prj/1" });
  assert.equal(script.calls.at(-1).url, "https://api.browserbase.com/v1/projects/prj%2F1");
  const usage = await script.api.getProjectUsage({ id: "prj/1" });
  same(usage, { marker: "GET https://api.browserbase.com/v1/projects/prj%2F1/usage" });
  assert.equal(script.api.endSession, undefined);
  const callsBeforeInvalid = script.calls.length;
  await assert.rejects(() => script.api.getDownload({ id: "dl/1", Accept: "text/plain" }), /Accept must be application\/json or application\/octet-stream/);
  await assert.rejects(() => script.api.getReplayPage({ id: "ses/1", pageId: "0000" }), /pageId must be 1 to 3 digits/);
  await assert.rejects(() => script.api.listDownloads({}), /sessionId is required/);
  assert.equal(script.calls.length, callsBeforeInvalid);
});

test("manifest has the API key connection and no installation project default", () => {
  const manifest = JSON.parse(readFileSync(join(root, "appsscript.json"), "utf8"));
  assert.equal(manifest.marketplace.configuration, undefined);
  assert.deepEqual(manifest.marketplace.permissions.storage, []);
  assert.deepEqual(manifest.marketplace.permissions.externalDomains, ["https://api.browserbase.com"]);
  assert.equal(manifest.marketplace.connections[0].kind, "API_KEY");
  assert.equal(manifest.marketplace.connections[0].key, "browserbase");
  const source = readdirSync(root)
    .filter((name) => name.endsWith(".js"))
    .map((name) => readFileSync(join(root, name), "utf8"))
    .join("\n");
  for (const term of ["operatorUrl", "browserbaseSessionId", "proxyCountry", "geolocationCountry", "endSession", "ScriptContext", "getBrowserbaseProjectId"]) {
    assert.equal(source.includes(term), false, term);
  }
});
