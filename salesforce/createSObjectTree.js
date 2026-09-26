/**
 * @description Create sObject trees, up to 200 records. POST /services/data/vXX.X/composite/tree/sObjectName
 * @param {Object} input
 * @param {string} input.sObjectName Root object API name
 * @param {Object[]} input.records Tree records
 * @returns {Object} Salesforce tree response
 * @throws {SALESFORCE_INVALID_INPUT} sObjectName or records is missing
 * @throws {SALESFORCE_NOT_CONFIGURED} instanceUrl is missing or invalid, or apiVersion is invalid
 * @throws {AUTH_NOT_CONNECTED} Salesforce is not connected
 * @throws {SALESFORCE_REQUEST_FAILED} Salesforce rejected or could not complete the request
 */
async function createSObjectTree(input) {
  const req = requireInput(input);
  return dataRequest(`/composite/tree/${encodeURIComponent(requireApiName(req.sObjectName, "sObjectName"))}`, "POST", { records: requireObjectList(req.records, "records", COLLECTION_RECORD_LIMIT) });
}
