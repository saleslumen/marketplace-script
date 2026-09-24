/**
 * @description Create nested parent-child records with the sObject Tree API.
 * @param {string} sobject Root sObject API name
 * @param {Object[]} records Tree records
 * @returns {Object} Tree result
 * @property {boolean} hasErrors
 * @property {Object[]} results
 * @property {Object} raw Salesforce tree body
 * @throws {SALESFORCE_INVALID_INPUT} sobject or records are missing
 * @throws {SALESFORCE_NOT_CONFIGURED} instanceUrl is missing or invalid
 * @throws {AUTH_NOT_CONNECTED} Salesforce is not connected
 * @throws {SALESFORCE_REQUEST_FAILED} Salesforce rejected or could not complete the request
 */
async function createSObjectTree(sobject, records) {
  const result = await dataRequest(`/composite/tree/${encodeURIComponent(requireSObject(sobject))}`, "POST", {
    records: requireObjectList(records, "records", COLLECTION_RECORD_LIMIT),
  });
  return { hasErrors: result.hasErrors === true, results: asArray(result.results), raw: result };
}
