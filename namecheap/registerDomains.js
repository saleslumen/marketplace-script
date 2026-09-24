/**
 * @description Register domains via namecheap.domains.create (POST). Prefer ensureDomainsOwned for retries.
 * @param {Object} input
 * @param {string|string[]} input.domains
 * @param {Object} input.contacts - Registrant/Tech/Admin/AuxBilling required fields
 * @returns {Object}
 */
async function registerDomains(input) {
  const domains = asCsvList(input && input.domains);
  if (!domains.length) throw new Error("NAMECHEAP_REQUEST_FAILED: domains is required");
  const contactValidation = validateContactsForCreate((input && input.contacts) || {});
  if (!contactValidation.ok) {
    return {
      ok: false,
      outcome: "CONTACTS_INVALID",
      registered: [],
      pending: [],
      failed: domains.map((domain) => ({ domain, failure: contactValidation.failure })),
      operations: [],
      failure: contactValidation.failure,
    };
  }
  const registered = [];
  const pending = [];
  const failed = [];
  const operations = [];
  for (const domain of domains) {
    try {
      const check = await checkAvailability({ domains: [domain] });
      const row = (check.results || []).find((item) => item.domain === domain.toLowerCase()) || {};
      const params = {
        ...contactValidation.params,
        DomainName: domain,
      };
      if (row.isPremium) {
        params.IsPremiumDomain = "true";
        if (row.premiumRegistrationPrice !== null && row.premiumRegistrationPrice !== undefined) {
          params.PremiumPrice = String(row.premiumRegistrationPrice);
        }
      }
      const response = await namecheapRequest("namecheap.domains.create", params, { method: "POST" });
      const result = response.commandResponse && response.commandResponse.DomainCreateResult;
      const attrs = attributeMap(result);
      const created = asBoolean(attrs.Registered, false);
      const nonRealTime = asBoolean(attrs.NonRealTimeDomain, false);
      const chargedAmount = extractCreatePrice(attrs);
      operations.push({
        domain,
        status: created ? (nonRealTime ? "pending" : "success") : "failed",
        domainId: asString(attrs.DomainID),
        orderId: asString(attrs.OrderID),
        transactionId: asString(attrs.TransactionID),
        chargedAmount,
        detail: attrs,
      });
      if (!created) {
        failed.push({ domain, failure: `create Registered=false for ${domain}` });
        continue;
      }
      if (nonRealTime) pending.push(domain);
      else registered.push(domain);
    } catch (error) {
      const failure = asString(error && error.message) || "create failed";
      failed.push({ domain, failure });
      operations.push({ domain, status: "failed", failure });
    }
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
