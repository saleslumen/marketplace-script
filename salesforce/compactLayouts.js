/**
 * @description List compact layouts for the objects in q. GET /services/data/vXX.X/compactLayouts?q=objectList
 * @param {Object} input
 * @param {string} input.q Comma-separated object API names
 * @returns {Object} Salesforce compact layouts
 * @throws {SALESFORCE_INVALID_INPUT} q is missing
 * @throws {SALESFORCE_NOT_CONFIGURED} instanceUrl is missing or invalid, or apiVersion is invalid
 * @throws {AUTH_NOT_CONNECTED} Salesforce is not connected
 * @throws {SALESFORCE_REQUEST_FAILED} Salesforce rejected or could not complete the request
 */
async function compactLayouts(input) {
  const req = requireInput(input);
  return dataRequest("/compactLayouts", "GET", undefined, { q: requireCommaSeparated(req.q, "q") });
}
