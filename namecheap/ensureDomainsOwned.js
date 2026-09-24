/**
 * @description Ensure ownership for the full requested domain set (retry-safe).
 * Lists account domains (paginated), reuses already-owned, checks availability for missing,
 * requires purchaseConfirmed=true before create, creates only available, reconciles ownership.
 * Optional maxTotalCost when check/pricing exposes reliable prices; otherwise confirmation covers checkout price.
 * @param {Object} input
 * @param {string|string[]} input.domains
 * @param {Object} input.contacts
 * @param {boolean|string} [input.purchaseConfirmed]
 * @param {string|number} [input.maxTotalCost]
 * @returns {Object}
 */
async function ensureDomainsOwned(input) {
  const req = input && typeof input === "object" ? input : {};
  const domains = asCsvList(req.domains).map((name) => name.toLowerCase());
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
  const contactValidation = validateContactsForCreate(contacts);
  let ownedListing;
  try {
    ownedListing = await ownedSetFromList();
  } catch (error) {
    return {
      ok: false,
      outcome: "LIST_FAILED",
      domains,
      owned: [],
      alreadyOwned: [],
      registered: [],
      unavailable: [],
      pending: [],
      failed: [],
      failure: asString(error && error.message) || "domains.getList failed",
    };
  }
  const alreadyOwned = domains.filter((domain) => ownedListing.set.has(domain));
  const toBuy = domains.filter((domain) => !ownedListing.set.has(domain));
  const unavailable = [];
  const pending = [];
  const failed = [];
  const registered = [];
  const operations = [];
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
        priceNote: "Namecheap checkout price applies when availability/pricing omit complete amounts; purchaseConfirmed=true covers that spend for missing domains",
        failure: `purchaseConfirmed=true required to register ${toBuy.length} missing domain(s): ${toBuy.join(", ")}`,
      };
    }
    if (!contactValidation.ok) {
      return {
        ok: false,
        outcome: "CONTACTS_INVALID",
        domains,
        owned: alreadyOwned.slice(),
        alreadyOwned,
        registered: [],
        unavailable: [],
        pending: [],
        failed: [],
        missing: toBuy.slice(),
        toBuy,
        purchaseConfirmed: true,
        failure: contactValidation.failure,
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
        failure: asString(error && error.message) || "domains.check failed",
      };
    }
    availabilityResults = availability.results || [];
    const availableSet = new Set((availability.available || []).map((name) => asString(name).toLowerCase()));
    for (const domain of toBuy) {
      if (!availableSet.has(domain)) unavailable.push(domain);
    }
    const buyable = toBuy.filter((domain) => availableSet.has(domain));
    const pricingByTld = await loadRegisterPricingByTld();
    const prices = [];
    for (const domain of buyable) {
      const row = availabilityResults.find((item) => item.domain === domain) || {};
      if (row.isPremium && row.premiumRegistrationPrice !== null && row.premiumRegistrationPrice !== undefined) {
        prices.push({ domain, price: row.premiumRegistrationPrice, source: "premium_check" });
        continue;
      }
      const split = await resolveSldTld({ domain });
      const tldPrice = split.ok ? pricingByTld[split.tld.toLowerCase()] : undefined;
      if (tldPrice !== undefined && tldPrice !== null) {
        prices.push({ domain, price: tldPrice, source: "users_getPricing" });
      }
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
  let owned = [];
  try {
    const reconciled = await ownedSetFromList();
    owned = domains.filter((domain) => reconciled.set.has(domain));
  } catch (error) {
    return {
      ok: false,
      outcome: "RECONCILE_FAILED",
      domains,
      owned: alreadyOwned.slice(),
      alreadyOwned,
      registered,
      unavailable,
      pending,
      failed,
      operations,
      failure: asString(error && error.message) || "post-create getList failed",
    };
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
      : "Namecheap did not expose complete reliable prices for every missing domain; purchaseConfirmed covers current checkout price",
    ready: ok,
    failure,
  };
}
