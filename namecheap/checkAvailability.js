/**
 * @description Check Namecheap availability for one or more domains (domains.check).
 * @param {Object} input
 * @param {string|string[]} input.domains
 * @returns {Object}
 */
async function checkAvailability(input) {
  const domains = asCsvList(input && input.domains);
  if (!domains.length) throw new Error("NAMECHEAP_REQUEST_FAILED: domains is required");
  const response = await namecheapRequest("namecheap.domains.check", { DomainList: domains.join(",") });
  const rows = asArray(response.commandResponse && response.commandResponse.DomainCheckResult);
  const results = rows.map((row) => {
    const attrs = attributeMap(row);
    const domain = asString(attrs.Domain).toLowerCase();
    const available = asBoolean(attrs.Available, false);
    const isPremium = asBoolean(attrs.IsPremiumName, false);
    const premiumPrice = asNumber(attrs.PremiumRegistrationPrice, null);
    return {
      domain,
      available,
      isPremium,
      premiumRegistrationPrice: premiumPrice,
      icannFee: asNumber(attrs.IcannFee, null),
      eapFee: asNumber(attrs.EapFee, null),
      errorNo: asString(attrs.ErrorNo),
      description: asString(attrs.Description),
      raw: attrs,
    };
  });
  const available = results.filter((row) => row.available).map((row) => row.domain).filter(Boolean);
  return { available, results, domains };
}
