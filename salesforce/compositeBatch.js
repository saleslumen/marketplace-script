/**
 * @description Execute up to 25 independent subrequests. POST /services/data/vXX.X/composite/batch
 * @param {Object} input
 * @param {Object[]} input.batchRequests Subrequests
 * @param {boolean} [input.haltOnError] Stop remaining subrequests after the first error
 * @returns {Object} Salesforce batch response
 * @throws {SALESFORCE_INVALID_INPUT} batchRequests is missing or longer than 25
 * @throws {SALESFORCE_NOT_CONFIGURED} instanceUrl is missing or invalid, or apiVersion is invalid
 * @throws {AUTH_NOT_CONNECTED} Salesforce is not connected
 * @throws {SALESFORCE_REQUEST_FAILED} Salesforce rejected or could not complete the request
 */
async function compositeBatch(input) {
  const req = requireInput(input);
  return dataRequest("/composite/batch", "POST", assignBoolean({ batchRequests: requireObjectList(req.batchRequests, "batchRequests", COMPOSITE_REQUEST_LIMIT) }, req, "haltOnError"));
}
