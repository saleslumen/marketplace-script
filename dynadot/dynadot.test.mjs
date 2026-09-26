import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { createContext, runInContext } from "node:vm";

const root = dirname(fileURLToPath(import.meta.url));
const API_KEY = "vault-key-secret";
const API_SECRET = "vault-secret-value";
const FIXED_REQUEST_ID = "550e8400-e29b-41d4-a716-446655440000";
const DOC_SIGNATURE = "zvC0VjJrs2smbLXs6cw3Q4VuymDxGVgn6VbxWFYXzhU=";
const expectedSignature = (apiKey, apiSecret, fullPathAndQuery, xRequestId, requestBody) => {
  const message = `${apiKey}\n${fullPathAndQuery}\n${xRequestId}\n${requestBody}`;
  return createHmac("sha256", Buffer.from(apiSecret, "utf8")).update(Buffer.from(message, "utf8")).digest("base64");
};
const contact = {
  name: "Webb",
  email: "webb@example.com",
  phone_number: "8662623399",
  phone_cc: "1",
  address1: "PO Box 345",
  city: "San Mateo",
  zip: "94401",
  country: "US",
};
const SPECS = [
  { group: "domains", fn: "searchDomain", method: "GET", pathname: "/restful/v2/domains/example.com/search", input: { domain_name: "example.com", show_price: true, currency: "USD" }, query: { show_price: "true", currency: "USD" } },
  { group: "domains", fn: "bulkSearch", method: "GET", pathname: "/restful/v2/domains/bulk_search", input: { domain_name_list: ["example1.com", "example2.net"] }, query: { domain_name_list: "example1.com,example2.net" } },
  { group: "domains", fn: "listDomains", method: "GET", pathname: "/restful/v2/domains", input: { sort: "name_asc", page_size: 50, page: 1, status: "active" }, query: { sort: "name_asc", page_size: "50", page: "1", status: "active" } },
  { group: "domains", fn: "getDomainInfo", method: "GET", pathname: "/restful/v2/domains/example.com", input: { domain_name: "example.com" }, query: {} },
  { group: "domains", fn: "registerDomain", method: "POST", pathname: "/restful/v2/domains/example.com/register", input: { domain_name: "example.com", domain: { duration: 1, privacy: "off" }, currency: "USD" }, payload: { domain: { duration: 1, privacy: "off" }, currency: "USD" } },
  { group: "domains", fn: "renewDomain", method: "POST", pathname: "/restful/v2/domains/example.com/renew", input: { domain_name: "example.com", duration: 1, year: 2026, currency: "USD", coupon: "testcoupon" }, payload: { duration: 1, year: 2026, currency: "USD", coupon: "testcoupon" } },
  { group: "nameservers", fn: "getNameservers", method: "GET", pathname: "/restful/v2/domains/example.com/nameservers", input: { domain_name: "example.com" }, query: {} },
  { group: "nameservers", fn: "setNameservers", method: "PUT", pathname: "/restful/v2/domains/example.com/nameservers", input: { domain_name: "example.com", nameserver_list: ["ns1.example.net", "ns2.example.net"] }, payload: { nameserver_list: ["ns1.example.net", "ns2.example.net"] } },
  { group: "nameservers", fn: "registerNameserver", method: "POST", pathname: "/restful/v2/nameservers/register", input: { nameserver: { server_name: "ns1.example.com", ip: "192.0.2.1" } }, payload: { nameserver: { server_name: "ns1.example.com", ip: "192.0.2.1" } } },
  { group: "dns", fn: "getDns", method: "GET", pathname: "/restful/v2/domains/example.com/records", input: { domain_name: "example.com" }, query: {} },
  { group: "dns", fn: "setDns", method: "POST", pathname: "/restful/v2/domains/example.com/records", input: { domain_name: "example.com", dns_main_list: [{ record_type: "a", record_value1: "192.0.2.1" }], ttl: 3600 }, payload: { dns_main_list: [{ record_type: "a", record_value1: "192.0.2.1" }], ttl: 3600 } },
  { group: "dns", fn: "removeDns", method: "DELETE", pathname: "/restful/v2/domains/example.com/records", input: { domain_name: "example.com", dns_main_list: [{ record_type: "a", record_value1: "192.0.2.1" }] }, payload: { dns_main_list: [{ record_type: "a", record_value1: "192.0.2.1" }] } },
  { group: "transfers", fn: "transferIn", method: "POST", pathname: "/restful/v2/domains/example.com/transfer_in", input: { domain_name: "example.com", domain: { duration: 1, privacy: "off", auth_code: "testauth" } }, payload: { domain: { duration: 1, auth_code: "testauth", privacy: "off" } } },
  { group: "transfers", fn: "getTransferStatus", method: "GET", pathname: "/restful/v2/domains/example.com/transfer_status", input: { domain_name: "example.com", transfer_type: "in" }, query: { transfer_type: "in" } },
  { group: "transfers", fn: "cancelTransfer", method: "POST", pathname: "/restful/v2/orders/1234567/cancel_transfer", input: { order_id: "1234567", domain_name: "example.com" }, payload: { domain_name: "example.com" } },
  { group: "contacts", fn: "createContact", method: "POST", pathname: "/restful/v2/contacts", input: { contact }, payload: { contact } },
  { group: "orders", fn: "getOrderStatus", method: "GET", pathname: "/restful/v2/orders/0", input: { order_id: 0 }, query: {} },
  { group: "account", fn: "getAccountInfo", method: "GET", pathname: "/restful/v2/accounts/info", input: undefined, query: {} },
  { group: "folders", fn: "folderCreate", method: "POST", pathname: "/restful/v2/folders", input: { folder_name: "primary" }, payload: { folder_name: "primary" } },
  { group: "aftermarket", fn: "getListingItem", method: "GET", pathname: "/restful/v2/aftermarket/listings/example.com", input: { domain_name: "example.com", currency: "USD" }, query: { currency: "USD" } },
  { group: "sitebuilders", fn: "listSiteBuilder", method: "GET", pathname: "/restful/v2/sitebuilders", input: undefined, query: {} },
  { group: "email", fn: "createEmailHosting", method: "POST", pathname: "/restful/v2/email_hosting", input: { domain_name: "example.com", email_name: "sales", username: "sales", password: "mailbox-pass" }, payload: { domain_name: "example.com", email_name: "sales", username: "sales", password: "mailbox-pass" } },
];
const loadScript = ({ handler, apiBase = "prod", keys } = {}) => {
  const calls = [];
  const resolvedKeys = keys || { dynadot: API_KEY, dynadotSecret: API_SECRET };
  const context = createContext({
    dynadotCreateRequestId: () => FIXED_REQUEST_ID,
    dynadotHmacSha256Base64: (secret, message) => createHmac("sha256", Buffer.from(secret, "utf8")).update(Buffer.from(message, "utf8")).digest("base64"),
    ConnectionApp: {
      getApiKey: async (key) => {
        if (Object.prototype.hasOwnProperty.call(resolvedKeys, key)) return resolvedKeys[key];
        throw new Error(`AUTH_NOT_CONNECTED: ${key}`);
      },
    },
    ScriptContext: { configuration: { apiBase } },
    UrlFetchApp: {
      fetch: async (url, options = {}) => {
        calls.push({
          url,
          method: String(options.method || "GET").toUpperCase(),
          payload: options.payload,
          headers: options.headers || {},
          muteHttpExceptions: options.muteHttpExceptions === true,
        });
        const result = handler ? await handler({ url, method: String(options.method || "GET").toUpperCase(), headers: options.headers || {} }) : { status: 200, body: {} };
        const status = Number(result.status) || 200;
        const body = result.body === undefined ? {} : result.body;
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
const parseUrl = (url) => {
  const parsed = new URL(url);
  const params = {};
  parsed.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return { origin: parsed.origin, pathname: parsed.pathname, search: parsed.search, params };
};
const plain = (value) => JSON.parse(JSON.stringify(value));
const assertNoSecrets = (value) => {
  const text = typeof value === "string" ? value : JSON.stringify(value);
  assert.equal(text.includes(API_KEY), false);
  assert.equal(text.includes(API_SECRET), false);
};
test("HMAC string-to-sign matches the Dynadot REST v2 example", () => {
  const { api } = loadScript();
  const signature = api.createSignature("your_api_key", "your_secret", "/restful/v2/accounts/info", FIXED_REQUEST_ID, "");
  assert.equal(signature, DOC_SIGNATURE);
  assert.equal(signature, expectedSignature("your_api_key", "your_secret", "/restful/v2/accounts/info", FIXED_REQUEST_ID, ""));
});
test("each operation group sends a signed REST v2 request and returns the JSON body", async () => {
  const { api, calls } = loadScript({
    handler: ({ url }) => ({ status: 200, body: { code: 200, message: "Success", data: { path: new URL(url).pathname } } }),
  });
  for (const spec of SPECS) {
    const before = calls.length;
    const result = spec.input === undefined ? await api[spec.fn]() : await api[spec.fn](spec.input);
    assert.equal(calls.length, before + 1, spec.fn);
    const call = calls[before];
    const parsed = parseUrl(call.url);
    const payload = call.payload || "";
    assert.equal(call.method, spec.method, spec.fn);
    assert.equal(call.muteHttpExceptions, true, spec.fn);
    assert.equal(parsed.origin, "https://api.dynadot.com", spec.fn);
    assert.equal(parsed.pathname, spec.pathname, spec.fn);
    assert.deepEqual(parsed.params, spec.query || {}, spec.fn);
    if (spec.payload) assert.deepEqual(JSON.parse(payload), spec.payload, spec.fn);
    else assert.equal(call.payload, undefined, spec.fn);
    assert.equal(call.headers.Accept, "application/json", spec.fn);
    assert.equal(call.headers.Authorization, `Bearer ${API_KEY}`, spec.fn);
    assert.equal(call.headers["X-Request-ID"], FIXED_REQUEST_ID, spec.fn);
    assert.equal(call.headers["X-Signature"], expectedSignature(API_KEY, API_SECRET, `${parsed.pathname}${parsed.search}`, FIXED_REQUEST_ID, payload), spec.fn);
    if (spec.payload) assert.equal(call.headers["Content-Type"], "application/json", spec.fn);
    else assert.equal(call.headers["Content-Type"], undefined, spec.fn);
    assert.equal(call.url.includes(API_KEY), false, spec.fn);
    assert.equal(call.url.includes(API_SECRET), false, spec.fn);
    assert.equal(call.url.includes("key="), false, spec.fn);
    assert.equal(call.url.includes("/api3"), false, spec.fn);
    assert.equal(JSON.stringify(call.headers).includes(API_SECRET), false, spec.fn);
    assert.deepEqual(plain(result), { code: 200, message: "Success", data: { path: spec.pathname } }, spec.fn);
    assertNoSecrets(result);
  }
});
test("validation rejects missing, unknown, and mistyped input before a request", async () => {
  const { api, calls } = loadScript();
  await assert.rejects(api.searchDomain({}), /DYNADOT_INVALID_INPUT: domain_name is required/);
  await assert.rejects(api.searchDomain({ domain: "example.com" }), /DYNADOT_INVALID_INPUT: domain is not a parameter/);
  await assert.rejects(api.searchDomain({ domain_name: "example.com", show_price: "yes" }), /DYNADOT_INVALID_INPUT: show_price must be a boolean/);
  await assert.rejects(api.searchDomain("example.com"), /DYNADOT_INVALID_INPUT: input must be an object/);
  await assert.rejects(api.renewDomain({ domain_name: "example.com", duration: 1 }), /DYNADOT_INVALID_INPUT: year is required/);
  await assert.rejects(api.renewDomain({ domain_name: "example.com", duration: 1, year: "2026" }), /DYNADOT_INVALID_INPUT: year must be a number/);
  await assert.rejects(api.registerDomain({ domain_name: "example.com" }), /DYNADOT_INVALID_INPUT: domain is required/);
  await assert.rejects(api.registerDomain({ domain_name: "example.com", domain: { privacy: "off" } }), /DYNADOT_INVALID_INPUT: domain.duration is required/);
  await assert.rejects(api.setNameservers({ domain_name: "example.com" }), /DYNADOT_INVALID_INPUT: nameserver_list is required/);
  await assert.rejects(api.setNameservers({ domain_name: "example.com", nameserver_list: [] }), /DYNADOT_INVALID_INPUT: nameserver_list is required/);
  await assert.rejects(api.createContact({ contact: { name: "Webb", phonenum: "8662623399" } }), /DYNADOT_INVALID_INPUT: contact.phonenum is not a parameter/);
  await assert.rejects(api.createContact({ contact: { name: "Webb" } }), /DYNADOT_INVALID_INPUT: contact.email is required/);
  await assert.rejects(api.getAccountInfo({ domain_name: "example.com" }), /DYNADOT_INVALID_INPUT: domain_name is not a parameter/);
  assert.equal(calls.length, 0);
});
test("vendor and HTTP errors use DYNADOT_REQUEST_FAILED and omit credentials and URLs", async () => {
  const http = loadScript({
    handler: () => ({ status: 401, body: { code: 401, message: `Unauthorized ${API_KEY}`, error: { description: `bad ${API_SECRET}` } } }),
  });
  await assert.rejects(http.api.getDomainInfo({ domain_name: "example.com" }), (error) => {
    assert.equal(error.message, "DYNADOT_REQUEST_FAILED: 401 Unauthorized [REDACTED]");
    assert.equal(error.message.includes("api.dynadot.com"), false);
    assert.equal(http.calls[0].url.includes(API_KEY), false);
    assert.equal(http.calls[0].url.includes(API_SECRET), false);
    assertNoSecrets(error.message);
    return true;
  });
  const described = loadScript({
    handler: () => ({ status: 400, body: { code: 400, error: { description: `missing domain ${API_SECRET}` } } }),
  });
  await assert.rejects(described.api.getDomainInfo({ domain_name: "example.com" }), (error) => {
    assert.equal(error.message, "DYNADOT_REQUEST_FAILED: 400 missing domain [REDACTED]");
    assertNoSecrets(error.message);
    return true;
  });
  const text = loadScript({
    handler: () => ({ status: 500, body: `bad gateway ${API_KEY} ${API_SECRET}` }),
  });
  await assert.rejects(text.api.getAccountInfo(), (error) => {
    assert.equal(error.message, "DYNADOT_REQUEST_FAILED: 500 bad gateway [REDACTED] [REDACTED]");
    assert.equal(error.message.includes(text.calls[0].url), false);
    assertNoSecrets(error.message);
    return true;
  });
});
test("success JSON is returned as-is", async () => {
  const body = { code: 200, message: "Success", data: { domain_name: "example.com", note: `see ${API_SECRET}`, apikey: API_KEY, authorization: `Bearer ${API_KEY}` } };
  const { api } = loadScript({ handler: () => ({ status: 200, body }) });
  assert.deepEqual(plain(await api.getDomainInfo({ domain_name: "example.com" })), body);
});
test("sandbox apiBase selects the sandbox host", async () => {
  const { api, calls } = loadScript({
    apiBase: "sandbox",
    handler: () => ({ status: 200, body: { code: 200, message: "Success" } }),
  });
  await api.getAccountInfo();
  assert.equal(parseUrl(calls[0].url).origin, "https://api-sandbox.dynadot.com");
  assert.equal(calls[0].url.includes(API_SECRET), false);
  const urlBase = loadScript({
    apiBase: "https://preview.sandbox.example",
    handler: () => ({ status: 200, body: { code: 200, message: "Success" } }),
  });
  await urlBase.api.getAccountInfo();
  assert.equal(parseUrl(urlBase.calls[0].url).origin, "https://api-sandbox.dynadot.com");
});
test("missing credentials fail before a request and do not echo secrets", async () => {
  const { api, calls } = loadScript({ keys: { dynadot: "", dynadotSecret: API_SECRET } });
  await assert.rejects(api.searchDomain({ domain_name: "example.com" }), (error) => {
    assert.equal(error.message, "DYNADOT_AUTH_MISSING: connect the Dynadot API key and signing secret");
    assertNoSecrets(error.message);
    return true;
  });
  assert.equal(calls.length, 0);
});
test("every REST operation is a function and API3 commands are gone", () => {
  const { api } = loadScript();
  const files = readdirSync(root).filter((file) => file.endsWith(".js") && file !== "http.js");
  assert.equal(files.length, 160);
  files.forEach((file) => {
    const name = file.slice(0, -3);
    assert.equal(typeof api[name], "function", name);
    assert.equal(readFileSync(join(root, file), "utf8").includes("api3"), false, name);
  });
  const http = readFileSync(join(root, "http.js"), "utf8");
  assert.equal(http.includes("api3"), false);
  ["search", "setDns2", "accountInfo", "getAccountBalance", "listDomain", "domainInfo", "setNs", "register"].forEach((name) => {
    assert.equal(api[name], undefined, name);
  });
});
