/**
 * @description Ensure ownership for the full requested domain set (retry-safe).
 * Already-owned domains may proceed without spend. Missing domains require purchaseConfirmed=true.
 * Optional maxTotalCost is enforced only when Spaceship availability exposes a price; otherwise confirmation covers registrar price.
 * Never silently drops unavailable requested domains; ok only when every requested domain is owned.
 * @param {Object} input
 * @param {string|string[]} input.domains - Full requested set
 * @param {Object} [input.contacts]
 * @param {boolean|string} [input.purchaseConfirmed] - Required when any domain needs registration spend
 * @param {string|number} [input.maxTotalCost] - Optional spend cap when API returns prices
 * @returns {Object}
 */
async function ensureDomainsOwned(input) {
  const req = input && typeof input === "object" ? input : {};
  const domains = asCsvList(req.domains);
  const contacts = req.contacts || {};
  const purchaseConfirmed = asBoolean(req.purchaseConfirmed, false);
  const maxTotalCost = asNumber(req.maxTotalCost, undefined);
  if (!domains.length) {
    return {
      ok: false,
      outcome: "MISSING_DOMAINS",
      owned: [],
      alreadyOwned: [],
      registered: [],
      unavailable: [],
      pending: [],
      failed: [],
      failure: "domains is required",
    };
  }
  const alreadyOwned = [];
  const registered = [];
  const unavailable = [];
  const pending = [];
  const failed = [];
  const operations = [];
  const toBuy = [];
  for (const domain of domains) {
    const ownership = await getOwnedDomain(domain);
    if (ownership.owned) {
      alreadyOwned.push(domain);
      continue;
    }
    toBuy.push(domain);
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
        priceNote: "Spaceship availability may omit price; purchaseConfirmed=true covers registrar spend for missing domains",
        failure: `purchaseConfirmed=true required to register ${toBuy.length} missing domain(s): ${toBuy.join(", ")}`,
      };
    }
    const availability = await checkAvailability({ domains: toBuy });
    availabilityResults = availability.results || [];
    const availableSet = new Set((availability.available || []).map((name) => asString(name).toLowerCase()));
    for (const domain of toBuy) {
      if (!availableSet.has(domain.toLowerCase())) {
        unavailable.push(domain);
      }
    }
    const buyable = toBuy.filter((domain) => availableSet.has(domain.toLowerCase()));
    const prices = [];
    for (const row of availabilityResults) {
      const domain = asString(row.domain || row.name).toLowerCase();
      if (!buyable.some((name) => name.toLowerCase() === domain)) continue;
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
      const purchase = await registerDomains({ domains: buyable, contacts });
      operations.push(...(purchase.operations || []));
      for (const domain of purchase.registered || []) registered.push(domain);
      for (const domain of purchase.pending || []) pending.push(domain);
      for (const row of purchase.failed || []) failed.push(row);
    }
  }
  const owned = [];
  for (const domain of domains) {
    const ownership = await getOwnedDomain(domain);
    if (ownership.owned) owned.push(domain);
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
      : "Spaceship availability did not expose complete prices; purchaseConfirmed covers registrar spend",
    ready: ok,
    failure,
  };
}
