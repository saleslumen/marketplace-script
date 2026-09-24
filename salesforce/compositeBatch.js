/**
 * @description Run a Salesforce composite batch request of up to 25 subrequests.
 * @param {Object[]} batchRequests Subrequests
 * @param {boolean} [haltOnError] Stop remaining subrequests after the first error
 * @returns {Object} Batch result
 * @property {boolean} hasErrors
 * @property {Object[]} results
 * @property {Object} raw Salesforce batch body
 * @throws {SALESFORCE_INVALID_INPUT} batchRequests is missing
 * @throws {SALESFORCE_NOT_CONFIGURED} instanceUrl is missing or invalid
 * @throws {AUTH_NOT_CONNECTED} Salesforce is not connected
 * @throws {SALESFORCE_REQUEST_FAILED} Salesforce rejected or could not complete the request
 */
async function compositeBatch(batchRequests, haltOnError) {
  const requests = requireObjectList(batchRequests, "batchRequests", COMPOSITE_REQUEST_LIMIT);
  const result = await dataRequest("/composite/batch", "POST", {
    haltOnError: optionalFlag(haltOnError) === true,
    batchRequests: requests,
  });
  return { hasErrors: result.hasErrors === true, results: asArray(result.results), raw: result };
}
