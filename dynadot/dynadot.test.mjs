import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { createContext, runInContext } from "node:vm";

const root = dirname(fileURLToPath(import.meta.url));
const FIXED_REQUEST_ID = "550e8400-e29b-41d4-a716-446655440000";
const hmacSha256Base64 = (secret, message) => (
  createHmac("sha256", Buffer.from(secret, "utf8")).update(Buffer.from(message, "utf8")).digest("base64")
);
const expectedSignature = (apiKey, apiSecret, fullPathAndQuery, xRequestId, requestBody = "") => (
  hmacSha256Base64(apiSecret, `${apiKey}\n${fullPathAndQuery}\n${xRequestId}\n${requestBody}`)
);
const loadScript = ({ handler } = {}) => {
  const calls = [];
  const context = createContext({
    dynadotCreateRequestId: () => FIXED_REQUEST_ID,
    dynadotHmacSha256Base64: hmacSha256Base64,
    ConnectionApp: {
      getApiKey: async (key) => {
        if (key === "dynadot") return "vault-key-secret";
        if (key === "dynadotSecret") return "vault-secret-value";
        throw new Error(`AUTH_NOT_CONNECTED: ${key}`);
      },
    },
    ScriptContext: { configuration: { apiBase: "prod" } },
    UrlFetchApp: {
      fetch: async (url, options = {}) => {
        const payload = options.payload !== undefined ? JSON.parse(options.payload) : undefined;
        calls.push({
          url,
          method: String(options.method || "GET").toUpperCase(),
          payload,
          headers: options.headers || {},
          muteHttpExceptions: options.muteHttpExceptions === true,
          rawPayload: options.payload,
        });
        const result = handler
          ? await handler({
            url,
            method: String(options.method || "GET").toUpperCase(),
            payload,
            headers: options.headers || {},
          })
          : { status: 200, body: { code: 200, message: "Success", data: {} } };
        const status = Number(result.status) || 200;
        const body = result.body === undefined ? { code: 200, data: {} } : result.body;
        return {
          getResponseCode: () => status,
          getContentText: () => (typeof body === "string" ? body : JSON.stringify(body)),
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
const parseUrl = (url) => {
  const parsed = new URL(url);
  const params = {};
  parsed.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return { origin: parsed.origin, pathname: parsed.pathname, params };
};
const ownedInfo = (domain) => ({
  DomainInfoResponse: {
    ResponseCode: 0,
    Status: "success",
    DomainInfo: { Name: domain, Status: "active", Expiration: "1" },
  },
});
const missingInfo = () => ({
  DomainInfoResponse: {
    ResponseCode: -1,
    Status: "error",
    Error: "not in your account",
  },
});
const searchBody = (domain, available, price) => ({
  code: 200,
  message: "Success",
  data: {
    domain_name: domain,
    available,
    premium: "No",
    price_list: price === undefined ? [] : [{ currency: "USD", registration_price: String(price) }],
  },
});
const registerOk = (domain) => ({
  RegisterResponse: {
    ResponseCode: 0,
    Status: "success",
    DomainName: domain,
    Expiration: 1,
  },
});

test("HMAC string-to-sign plus Base64 matches Dynadot JS fixture", () => {
  const { api } = loadScript();
  const signature = api.createSignature(
    "your_api_key",
    "your_secret",
    "/restful/v2/accounts/info",
    FIXED_REQUEST_ID,
    "",
  );
  assert.equal(
    signature,
    expectedSignature("your_api_key", "your_secret", "/restful/v2/accounts/info", FIXED_REQUEST_ID, ""),
  );
});

test("authed calls send Bearer, X-Signature, and X-Request-ID without leaking connection secrets", async () => {
  const { api, calls } = loadScript({
    handler: () => ({
      status: 200,
      body: searchBody("example.com", "Yes", 12.5),
    }),
  });
  const result = await api.checkAvailability({ domains: "example.com" });
  assert.equal(result.ok, true);
  assert.deepEqual([...result.available], ["example.com"]);
  assert.equal(result.results[0].price, 12.5);
  const call = lastCall(calls);
  const parsed = parseUrl(call.url);
  assert.equal(call.muteHttpExceptions, true);
  assert.equal(call.method, "GET");
  assert.equal(call.payload, undefined);
  assert.equal(parsed.origin, "https://api.dynadot.com");
  assert.equal(parsed.pathname, "/restful/v2/domains/example.com/search");
  assert.equal(call.headers.Authorization, "Bearer vault-key-secret");
  assert.equal(call.headers["X-Request-ID"], FIXED_REQUEST_ID);
  assert.equal(
    call.headers["X-Signature"],
    expectedSignature("vault-key-secret", "vault-secret-value", "/restful/v2/domains/example.com/search", FIXED_REQUEST_ID, ""),
  );
  const serialized = JSON.stringify(result);
  assert.equal(serialized.includes("vault-key-secret"), false);
  assert.equal(serialized.includes("vault-secret-value"), false);
  assert.equal(serialized.includes(call.headers["X-Signature"]), false);
});

test("ensureDomainsOwned reuses owned names, gates spend, fail-closes unavailable, and does not repurchase", async () => {
  const registerCalls = [];
  const { api, calls } = loadScript({
    handler: ({ url, method }) => {
      const parsed = parseUrl(url);
      if (method === "GET" && parsed.pathname === "/restful/v2/domains/missing.com/search") {
        return { status: 200, body: searchBody("missing.com", "Yes", 10) };
      }
      if (method === "GET" && parsed.pathname === "/restful/v2/domains/taken.com/search") {
        return { status: 200, body: searchBody("taken.com", "No") };
      }
      if (method === "GET" && parsed.pathname === "/restful/v2/domains/buy.com/search") {
        return { status: 200, body: searchBody("buy.com", "Yes", 8) };
      }
      if (parsed.pathname === "/api3.json" && parsed.params.command === "domain_info") {
        if (parsed.params.domain === "owned.com") return { status: 200, body: ownedInfo("owned.com") };
        if (parsed.params.domain === "missing.com") return { status: 200, body: missingInfo() };
        if (parsed.params.domain === "taken.com") return { status: 200, body: missingInfo() };
        if (parsed.params.domain === "buy.com") return { status: 200, body: ownedInfo("buy.com") };
      }
      if (parsed.pathname === "/api3.json" && parsed.params.command === "register") {
        registerCalls.push(`${parsed.pathname}?command=${parsed.params.command}&domain=${parsed.params.domain}`);
        return { status: 200, body: registerOk(parsed.params.domain) };
      }
      return { status: 500, body: { code: 500, message: `unexpected ${method} ${url}` } };
    },
  });
  const already = await api.ensureDomainsOwned({ domains: ["owned.com"] });
  assert.equal(already.ok, true);
  assert.equal(already.outcome, "OWNED");
  assert.deepEqual([...already.alreadyOwned], ["owned.com"]);
  assert.deepEqual([...already.owned], ["owned.com"]);
  assert.equal(registerCalls.length, 0);
  assert.equal(parseUrl(calls[0].url).pathname, "/api3.json");
  assert.equal(parseUrl(calls[0].url).params.command, "domain_info");
  assert.equal(parseUrl(calls[0].url).params.domain, "owned.com");
  const unconfirmed = await api.ensureDomainsOwned({ domains: ["owned.com", "missing.com"] });
  assert.equal(unconfirmed.ok, false);
  assert.equal(unconfirmed.outcome, "PURCHASE_NOT_CONFIRMED");
  assert.deepEqual([...unconfirmed.alreadyOwned], ["owned.com"]);
  assert.deepEqual([...unconfirmed.missing], ["missing.com"]);
  assert.equal(registerCalls.length, 0);
  const unavailable = await api.ensureDomainsOwned({
    domains: ["owned.com", "taken.com"],
    purchaseConfirmed: true,
  });
  assert.equal(unavailable.ok, false);
  assert.equal(unavailable.outcome, "DOMAINS_UNAVAILABLE");
  assert.deepEqual([...unavailable.unavailable], ["taken.com"]);
  assert.equal(registerCalls.length, 0);
  const capped = await api.ensureDomainsOwned({
    domains: ["missing.com"],
    purchaseConfirmed: true,
    maxTotalCost: 5,
  });
  assert.equal(capped.ok, false);
  assert.equal(capped.outcome, "MAX_TOTAL_COST_EXCEEDED");
  assert.equal(capped.estimatedTotalCost, 10);
  assert.equal(registerCalls.length, 0);
  let buyLookups = 0;
  const buyScript = loadScript({
    handler: ({ url, method }) => {
      const parsed = parseUrl(url);
      if (method === "GET" && parsed.pathname === "/restful/v2/domains/buy.com/search") {
        return { status: 200, body: searchBody("buy.com", "Yes", 8) };
      }
      if (parsed.pathname === "/api3.json" && parsed.params.command === "domain_info") {
        if (parsed.params.domain === "owned.com") return { status: 200, body: ownedInfo("owned.com") };
        if (parsed.params.domain === "buy.com") {
          buyLookups += 1;
          if (buyLookups === 1) return { status: 200, body: missingInfo() };
          return { status: 200, body: ownedInfo("buy.com") };
        }
      }
      if (parsed.pathname === "/api3.json" && parsed.params.command === "register") {
        registerCalls.push(url);
        assert.equal(parsed.params.domain, "buy.com");
        assert.equal(parsed.params.duration, "1");
        assert.equal(parsed.params.registrant_contact, "11");
        assert.equal(parsed.params.privacy, undefined);
        return { status: 200, body: registerOk("buy.com") };
      }
      return { status: 500, body: { code: 500, message: `unexpected ${method} ${url}` } };
    },
  });
  const bought = await buyScript.api.ensureDomainsOwned({
    domains: ["owned.com", "buy.com"],
    purchaseConfirmed: true,
    contacts: { registrant_contact: 11 },
  });
  assert.equal(bought.ok, true);
  assert.equal(bought.outcome, "OWNED");
  assert.deepEqual([...bought.alreadyOwned], ["owned.com"]);
  assert.deepEqual([...bought.registered], ["buy.com"]);
  assert.equal(registerCalls.length, 1);
  const registerParsed = parseUrl(registerCalls[0]);
  assert.equal(registerParsed.pathname, "/api3.json");
  assert.equal(registerParsed.params.command, "register");
  assert.equal(registerParsed.params.domain, "buy.com");
  assert.equal(buyScript.calls.some((call) => call.payload !== undefined && parseUrl(call.url).params.command === "register"), false);
});

test("setNameserversForZones requires read-back and fail-closes permanent API errors", async () => {
  const { api, calls } = loadScript({
    handler: ({ url }) => {
      const parsed = parseUrl(url);
      if (parsed.pathname !== "/api3.json") return { status: 500, body: { message: `unexpected ${url}` } };
      if (parsed.params.command === "server_list") {
        return { status: 200, body: { ServerListResponse: { ResponseCode: 0, Status: "success", ServerList: [] } } };
      }
      if (parsed.params.command === "add_ns" && parsed.params.host === "ns1.example.net") {
        return { status: 200, body: { AddNsResponse: { ResponseCode: 0, Status: "success", AddNsContent: { Server: { Host: "ns1.example.net", ServerId: 1 } } } } };
      }
      if (parsed.params.command === "add_ns" && parsed.params.host === "ns2.example.net") {
        return { status: 200, body: { AddNsResponse: { ResponseCode: 0, Status: "success", AddNsContent: { Server: { Host: "ns2.example.net", ServerId: 2 } } } } };
      }
      if (parsed.params.command === "add_ns" && parsed.params.host === "ns-already.example.net") {
        return { status: 200, body: { AddNsResponse: { ResponseCode: -1, Status: "error", Error: "already exists in your account" } } };
      }
      if (parsed.params.command === "add_ns" && parsed.params.host === "ns-denied.example.net") {
        return { status: 401, body: { code: 401, message: "Unauthorized" } };
      }
      if (parsed.params.command === "set_ns" && parsed.params.domain === "ok.com") {
        return { status: 200, body: { SetNsResponse: { ResponseCode: 0, Status: "success" } } };
      }
      if (parsed.params.command === "get_ns" && parsed.params.domain === "ok.com") {
        return {
          status: 200,
          body: {
            GetNsResponse: {
              ResponseCode: 0,
              Status: "success",
              NsContent: { Host0: "ns1.example.net", Host1: "ns2.example.net" },
            },
          },
        };
      }
      if (parsed.params.command === "set_ns" && parsed.params.domain === "have.com") {
        return { status: 200, body: { SetNsResponse: { ResponseCode: 0, Status: "success" } } };
      }
      if (parsed.params.command === "get_ns" && parsed.params.domain === "have.com") {
        return {
          status: 200,
          body: {
            GetNsResponse: {
              ResponseCode: 0,
              Status: "success",
              NsContent: { Host0: "ns-already.example.net" },
            },
          },
        };
      }
      if (parsed.params.command === "set_ns" && parsed.params.domain === "lag.com") {
        return { status: 200, body: { SetNsResponse: { ResponseCode: 0, Status: "success" } } };
      }
      if (parsed.params.command === "get_ns" && parsed.params.domain === "lag.com") {
        return { status: 200, body: { GetNsResponse: { ResponseCode: 0, Status: "success", NsContent: {} } } };
      }
      if (parsed.params.command === "set_ns" && parsed.params.domain === "denied.com") {
        return { status: 401, body: { code: 401, message: "Unauthorized" } };
      }
      return { status: 500, body: { message: `unexpected ${url}` } };
    },
  });
  const beforeOk = calls.length;
  const ok = await api.setNameserversForZones({
    zones: [{ domain: "ok.com", nameServers: ["ns1.example.net", "ns2.example.net"] }],
  });
  assert.equal(ok.ok, true);
  assert.equal(ok.outcome, "NAMESERVERS_SET");
  assert.deepEqual([...ok.updated], ["ok.com"]);
  const okCommands = calls.slice(beforeOk).map((call) => parseUrl(call.url).params.command);
  assert.deepEqual(okCommands, ["server_list", "add_ns", "add_ns", "set_ns", "get_ns"]);
  const addHosts = calls.slice(beforeOk).filter((call) => parseUrl(call.url).params.command === "add_ns").map((call) => parseUrl(call.url).params.host);
  assert.deepEqual(addHosts, ["ns1.example.net", "ns2.example.net"]);
  const setCall = calls.find((call) => parseUrl(call.url).params.command === "set_ns");
  const getCall = calls.find((call) => parseUrl(call.url).params.command === "get_ns");
  assert.equal(parseUrl(setCall.url).pathname, "/api3.json");
  assert.equal(parseUrl(setCall.url).params.ns0, "ns1.example.net");
  assert.equal(parseUrl(setCall.url).params.ns1, "ns2.example.net");
  assert.equal(parseUrl(getCall.url).pathname, "/api3.json");
  assert.equal(parseUrl(getCall.url).params.domain, "ok.com");
  assert.equal(setCall.payload, undefined);
  assert.equal(calls.some((call) => parseUrl(call.url).params.command === "register_ns"), false);
  const beforeHave = calls.length;
  const have = await api.setNameserversForZones({
    zones: [{ domain: "have.com", nameServers: ["ns-already.example.net"] }],
  });
  assert.equal(have.ok, true);
  assert.equal(have.outcome, "NAMESERVERS_SET");
  assert.deepEqual([...have.updated], ["have.com"]);
  const haveCommands = calls.slice(beforeHave).map((call) => parseUrl(call.url).params.command);
  assert.deepEqual(haveCommands, ["server_list", "add_ns", "set_ns", "get_ns"]);
  const pending = await api.setNameserversForZones({
    zones: [{ domain: "lag.com", nameServers: ["ns1.example.net"] }],
  });
  assert.equal(pending.ok, false);
  assert.equal(pending.outcome, "NAMESERVER_PENDING");
  assert.equal(pending.retryable, true);
  assert.equal(pending.results[0].outcome, "NAMESERVER_READBACK_PENDING");
  assert.deepEqual([...pending.pending], ["lag.com"]);
  const denied = await api.setNameserversForZones({
    zones: [{ domain: "denied.com", nameServers: ["ns-denied.example.net"] }],
  });
  assert.equal(denied.ok, false);
  assert.equal(denied.outcome, "NAMESERVER_PARTIAL_FAILED");
  assert.equal(denied.retryable, false);
  assert.equal(denied.results[0].outcome, "NAMESERVER_FAILED");
});

test("401 is unauthorized and 429 is retryable", async () => {
  const { api, calls } = loadScript({
    handler: ({ url }) => {
      const parsed = parseUrl(url);
      if (parsed.pathname.endsWith("/search")) return { status: 401, body: { code: 401, message: "Unauthorized" } };
      return { status: 429, body: { code: 429, message: "Too many requests" } };
    },
  });
  const unauthorized = await api.checkAvailability({ domains: "example.com" });
  assert.equal(unauthorized.ok, false);
  assert.equal(unauthorized.outcome, "UNAUTHORIZED");
  assert.equal(unauthorized.retryable, false);
  assert.equal(unauthorized.status, 401);
  const limited = await api.listDomains();
  assert.equal(limited.ok, false);
  assert.equal(limited.outcome, "RATE_LIMITED");
  assert.equal(limited.retryable, true);
  assert.equal(limited.status, 429);
  assert.equal(parseUrl(lastCall(calls).url).pathname, "/api3.json");
  assert.equal(parseUrl(lastCall(calls).url).params.command, "list_domain");
});

test("classifiedResult keeps the script envelope over a colliding vendor body", async () => {
  const { api } = loadScript({
    handler: () => ({
      status: 200,
      body: { ok: false, outcome: "nope", data: { domain_name: "example.com", available: "Yes" } },
    }),
  });
  const result = await api.checkAvailability({ domains: "example.com" });
  assert.equal(result.ok, true);
  assert.equal(result.outcome, "AVAILABLE");
  assert.equal(result.failure, "");
  assert.deepEqual([...result.available], ["example.com"]);
  assert.equal(result.results[0].raw.ok, undefined);
  assert.equal(result.results[0].raw.outcome, undefined);
});
