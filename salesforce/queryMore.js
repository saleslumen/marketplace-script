/**
 * @description Return the next SOQL batch for a query locator. GET /services/data/vXX.X/query/queryLocator. QueryAll nextRecordsUrl uses this same locator.
 * @param {Object} input
 * @param {string} input.queryLocator Locator token from nextRecordsUrl, not the URL
 * @returns {Object} Salesforce query response
 * @throws {SALESFORCE_INVALID_INPUT} queryLocator is missing or is a URL
 * @throws {SALESFORCE_NOT_CONFIGURED} instanceUrl is missing or invalid, or apiVersion is invalid
 * @throws {AUTH_NOT_CONNECTED} Salesforce is not connected
 * @throws {SALESFORCE_REQUEST_FAILED} Salesforce rejected or could not complete the request
 */
async function queryMore(input) {
  const req = requireInput(input);
  return dataRequest(`/query/${encodeURIComponent(requireQueryLocator(req.queryLocator))}`, "GET");
}
