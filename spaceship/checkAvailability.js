/**
 * @description Check Spaceship availability for one or more domains.
 * @param {Object} input
 * @param {string|string[]} input.domains - Comma-separated or array
 * @returns {Object}
 * @property {string[]} available
 * @property {Object[]} results
 */
async function checkAvailability(input) {
  const domains = asCsvList(input && input.domains);
  if (!domains.length) throw new Error("SPACESHIP_REQUEST_FAILED: domains is required");
  const response = await spaceshipRequest("/domains/available", "POST", { domains });
  const results = Array.isArray(response) ? response : response.domains || response.results || [];
  const available = results
    .filter((row) => row.available === true || row.status === "available")
    .map((row) => asString(row.domain || row.name))
    .filter(Boolean);
  return { available, results, domains };
}
