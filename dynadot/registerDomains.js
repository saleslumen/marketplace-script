/**
 * @description Register via official API3 GET /api3.json?command=register. Prefer ensureDomainsOwned.
 * Query params are the documented API3 fields (domain and duration as siblings). Contact ids only.
 * @param {Object} input
 * @param {string|string[]} input.domains
 * @param {Object} [input.contacts]
 * @returns {Object}
 */
async function registerDomains(input) {
  const domains = asCsvList(input && input.domains).map((name) => name.toLowerCase());
  if (!domains.length) throw new Error("DYNADOT_REQUEST_FAILED: domains is required");
  const bodyBase = collectRegisterInput(input);
  const registered = [];
  const pending = [];
  const failed = [];
  const operations = [];
  for (const domain of domains) {
    const params = { ...bodyBase, domain };
    if (input && input.registerPremiumByDomain && input.registerPremiumByDomain[domain]) params.premium = 1;
    const raw = await dynadotApi3Raw("register", params);
    const classified = classifiedApi3(raw, "REGISTERED", "REGISTRATION_FAILED");
    if (!classified.ok) {
      failed.push({ domain, failure: classified.failure });
      operations.push({ domain, status: "failed", detail: classified.data, failure: classified.failure });
      continue;
    }
    const data = classified.data && typeof classified.data === "object" ? classified.data : {};
    const registeredName = asString(data.DomainName || data.domain_name || data.domainName || domain).toLowerCase();
    if (registeredName && (data.Expiration !== undefined || data.expiration_date !== undefined || /^success$/i.test(asString(data.Status)))) {
      registered.push(registeredName);
      operations.push({ domain: registeredName, status: "success", expirationDate: data.Expiration || data.expiration_date, detail: data });
      continue;
    }
    pending.push(domain);
    operations.push({ domain, status: "pending", detail: data });
  }
  const ok = failed.length === 0 && pending.length === 0 && registered.length === domains.length;
  return {
    ok,
    outcome: ok ? "REGISTERED" : pending.length ? "REGISTRATION_PENDING" : "REGISTRATION_FAILED",
    registered,
    pending,
    failed,
    operations,
    failure: ok ? "" : `registered=${registered.length} pending=${pending.length} failed=${failed.length}`,
  };
}
