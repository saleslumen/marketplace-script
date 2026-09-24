/**
 * @description List sObjects available to the connected user.
 * @returns {Object} Global describe
 * @property {string} encoding
 * @property {number} maxBatchSize
 * @property {Object[]} sobjects
 * @throws {SALESFORCE_NOT_CONFIGURED} instanceUrl is missing or invalid
 * @throws {AUTH_NOT_CONNECTED} Salesforce is not connected
 * @throws {SALESFORCE_REQUEST_FAILED} Salesforce rejected or could not complete the request
 */
async function describeGlobal() {
  const result = await dataRequest("/sobjects", "GET");
  return {
    encoding: asString(result.encoding),
    maxBatchSize: Number(result.maxBatchSize) || 0,
    sobjects: asArray(result.sobjects),
  };
}
