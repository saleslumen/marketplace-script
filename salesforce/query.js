/**
 * @description Execute a SOQL query. GET /services/data/vXX.X/query?q=query
 * @param {Object} input
 * @param {string} input.q SOQL query
 * @returns {Object} Salesforce query response
 * @throws {SALESFORCE_INVALID_INPUT} q is missing
 * @throws {SALESFORCE_NOT_CONFIGURED} instanceUrl is missing or invalid, or apiVersion is invalid
 * @throws {AUTH_NOT_CONNECTED} Salesforce is not connected
 * @throws {SALESFORCE_REQUEST_FAILED} Salesforce rejected or could not complete the request
 */
async function query(input) {
  const req = requireInput(input);
  return dataRequest("/query", "GET", undefined, { q: requireText(req.q, "q") });
}
