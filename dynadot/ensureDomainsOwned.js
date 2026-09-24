/**
 * @description Ensure ownership for the full requested domain set (retry-safe).
 * Already-owned domains may proceed without spend. Missing domains require purchaseConfirmed=true.
 * Optional maxTotalCost is enforced only when search exposes a price for every buyable domain.
 * Register spend uses Dynadot account balance. Never silently drops unavailable names.
 * @param {Object} input
 * @param {string|string[]} input.domains
 * @param {Object} [input.contacts]
 * @param {boolean|string} [input.purchaseConfirmed]
 * @param {string|number} [input.maxTotalCost]
 * @returns {Object}
 */
async function ensureDomainsOwned(input) {
  const req = input && typeof input === "object" ? input : {};
  const domains = asCsvList(req.domains).map((name) => name.toLowerCase());
  const purchaseConfirmed = asBoolean(req.purchaseConfirmed, false);
  const maxTotalCost = asNumber(req.maxTotalCost, undefined);
  if (!domains.length) {
    return { ok: false, outcome: "MISSING_DOMAINS", owned: [], alreadyOwned: [], registered: [], unavailable: [], pending: [], failed: [], failure: "domains is required" };
  }
  const alreadyOwned = [];
  const registered = [];
  const unavailable = [];
  const pending = [];
  const failed = [];
  const operations = [];
  const toBuy = [];
  for (const domain of domains) {
    try {
      const ownership = await getOwnedDomain(domain);
      if (ownership.owned) {
        alreadyOwned.push(domain);
        continue;
      }
      toBuy.push(domain);
    } catch (error) {
      return {
        ok: false,
        outcome: error && error.outcome ? error.outcome : "LIST_FAILED",
        retryable: Boolean(error && error.retryable),
        domains,
        owned: alreadyOwned.slice(),
        alreadyOwned,
        registered: [],
        unavailable: [],
        pending: [],
        failed: [],
        failure: asString(error && error.message) || "domain info failed",
      };
    }
  }
  let estimatedTotalCost = null;
  let pricesKnown = false;
  let availabilityResults = [];
  if (toBuy.length) {
    if (!purchaseConfirmed) {
      return {
        ok: false,
        outcome: "PURCHASE_NOT_CONFIRMED",
        domains,
        owned: alreadyOwned.slice(),
        alreadyOwned,
        registered: [],
        unavailable: [],
        pending: [],
        failed: [],
        missing: toBuy.slice(),
        toBuy,
        toBuyCount: toBuy.length,
        alreadyOwnedCount: alreadyOwned.length,
        purchaseConfirmed: false,
        priceNote: "Dynadot register spends account balance; purchaseConfirmed=true covers registrar spend for missing domains",
        failure: `purchaseConfirmed=true required to register ${toBuy.length} missing domain(s): ${toBuy.join(", ")}`,
      };
    }
    let availability;
    try {
      availability = await checkAvailability({ domains: toBuy });
    } catch (error) {
      return {
        ok: false,
        outcome: "AVAILABILITY_FAILED",
        domains,
        owned: alreadyOwned.slice(),
        alreadyOwned,
        registered: [],
        unavailable: [],
        pending: [],
        failed: [],
        missing: toBuy.slice(),
        toBuy,
        failure: asString(error && error.message) || "domain search failed",
      };
    }
    if (!availability.ok && availability.outcome) {
      return {
        ok: false,
        outcome: availability.outcome,
        retryable: availability.retryable,
        domains,
        owned: alreadyOwned.slice(),
        alreadyOwned,
        registered: [],
        unavailable: [],
        pending: [],
        failed: [],
        missing: toBuy.slice(),
        toBuy,
        failure: availability.failure,
      };
    }
    availabilityResults = availability.results || [];
    const availableSet = new Set((availability.available || []).map((name) => asString(name).toLowerCase()));
    for (const domain of toBuy) {
      if (!availableSet.has(domain)) unavailable.push(domain);
    }
    const buyable = toBuy.filter((domain) => availableSet.has(domain));
    const prices = [];
    const registerPremiumByDomain = {};
    for (const row of availabilityResults) {
      const domain = asString(row.domain).toLowerCase();
      if (!buyable.includes(domain)) continue;
      if (row.premium) registerPremiumByDomain[domain] = true;
      const price = extractDomainPrice(row);
      if (price !== null) prices.push({ domain, price });
    }
    if (prices.length === buyable.length && buyable.length) {
      pricesKnown = true;
      estimatedTotalCost = prices.reduce((sum, row) => sum + row.price, 0);
      if (maxTotalCost !== undefined && estimatedTotalCost > maxTotalCost) {
        return {
          ok: false,
          outcome: "MAX_TOTAL_COST_EXCEEDED",
          domains,
          owned: alreadyOwned.slice(),
          alreadyOwned,
          registered: [],
          unavailable,
          pending: [],
          failed: [],
          missing: toBuy.slice(),
          toBuy: buyable,
          estimatedTotalCost,
          maxTotalCost,
          pricesKnown: true,
          failure: `Estimated register cost ${estimatedTotalCost} exceeds maxTotalCost ${maxTotalCost}`,
        };
      }
    }
    if (buyable.length) {
      const purchase = await registerDomains({ ...req, domains: buyable, registerPremiumByDomain });
      operations.push(...(purchase.operations || []));
      for (const domain of purchase.registered || []) registered.push(domain);
      for (const domain of purchase.pending || []) pending.push(domain);
      for (const row of purchase.failed || []) failed.push(row);
    }
  }
  const owned = [];
  for (const domain of domains) {
    try {
      const ownership = await getOwnedDomain(domain);
      if (ownership.owned) owned.push(domain);
    } catch (error) {
      return {
        ok: false,
        outcome: error && error.outcome ? error.outcome : "RECONCILE_FAILED",
        retryable: Boolean(error && error.retryable),
        domains,
        owned: alreadyOwned.slice(),
        alreadyOwned,
        registered,
        unavailable,
        pending,
        failed,
        operations,
        failure: asString(error && error.message) || "post-register domain info failed",
      };
    }
  }
  const missing = domains.filter((domain) => !owned.includes(domain));
  let outcome = "OWNED";
  let failure = "";
  if (unavailable.length) {
    outcome = "DOMAINS_UNAVAILABLE";
    failure = `Unavailable to buy (not owned): ${unavailable.join(", ")}`;
  } else if (failed.length) {
    outcome = "REGISTRATION_FAILED";
    failure = failed.map((row) => `${row.domain}: ${row.failure}`).join("; ");
  } else if (pending.length || missing.length) {
    outcome = "REGISTRATION_PENDING";
    failure = `Pending or not yet owned: ${missing.join(", ") || pending.join(", ")}`;
  }
  const ok = owned.length === domains.length && unavailable.length === 0 && failed.length === 0 && pending.length === 0;
  return {
    ok,
    outcome: ok ? "OWNED" : outcome,
    domains,
    owned,
    alreadyOwned,
    registered,
    unavailable,
    pending,
    failed,
    missing,
    operations,
    toBuy,
    toBuyCount: toBuy.length,
    alreadyOwnedCount: alreadyOwned.length,
    purchaseConfirmed,
    estimatedTotalCost,
    maxTotalCost: maxTotalCost === undefined ? null : maxTotalCost,
    pricesKnown,
    priceNote: pricesKnown
      ? `estimatedTotalCost=${estimatedTotalCost}`
      : "Dynadot search did not expose complete prices; purchaseConfirmed covers account-balance spend",
    ready: ok,
    failure,
  };
}
