/**
 * @description Get up to 2000 records of one object type. POST /services/data/vXX.X/composite/sobjects/sObject
 * @param {Object} input
 * @param {string} input.sObject Object API name
 * @param {string[]} input.recordIds Record ids
 * @param {string[]} input.fieldNames Field names
 * @returns {Object[]} Salesforce records
 * @throws {SALESFORCE_INVALID_INPUT} sObject, recordIds, or fieldNames is missing, or recordIds is longer than 2000
 * @throws {SALESFORCE_NOT_CONFIGURED} instanceUrl is missing or invalid, or apiVersion is invalid
 * @throws {AUTH_NOT_CONNECTED} Salesforce is not connected
 * @throws {SALESFORCE_REQUEST_FAILED} Salesforce rejected or could not complete the request
 */
async function getSObjectCollectionWithBody(input) {
  const req = requireInput(input);
  return dataRequest(`/composite/sobjects/${encodeURIComponent(requireSObject(req.sObject))}`, "POST", {
    recordIds: requireStringArray(req.recordIds, "recordIds", COLLECTION_RETRIEVE_LIMIT),
    fieldNames: requireStringArray(req.fieldNames, "fieldNames"),
  });
}
