/**
 * @description List cached record counts. GET /services/data/vXX.X/limits/recordCount?sObjects=objectList
 * @param {Object} [input]
 * @param {string} [input.sObjects] Comma-separated object API names. Omit it to count every object.
 * @returns {Object} Salesforce record counts
 * @throws {SALESFORCE_INVALID_INPUT} sObjects is not a string
 * @throws {SALESFORCE_NOT_CONFIGURED} instanceUrl is missing or invalid, or apiVersion is invalid
 * @throws {AUTH_NOT_CONNECTED} Salesforce is not connected
 * @throws {SALESFORCE_REQUEST_FAILED} Salesforce rejected or could not complete the request
 */
async function recordCount(input) {
  const query = {};
  if (input !== undefined) {
    const req = requireInput(input);
    const sObjects = optionalText(req.sObjects, "sObjects");
    if (sObjects !== undefined) query.sObjects = sObjects;
  }
  return dataRequest("/limits/recordCount", "GET", undefined, query);
}
