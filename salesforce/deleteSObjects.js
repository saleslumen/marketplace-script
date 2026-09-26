/**
 * @description Delete up to 200 records. DELETE /services/data/vXX.X/composite/sobjects?ids=recordId,recordId
 * @param {Object} input
 * @param {string} input.ids Comma-separated record ids
 * @param {boolean} [input.allOrNone] Roll back the request when one record fails
 * @returns {Object[]} Salesforce DeleteResult list
 * @throws {SALESFORCE_INVALID_INPUT} ids is missing or longer than 200
 * @throws {SALESFORCE_NOT_CONFIGURED} instanceUrl is missing or invalid, or apiVersion is invalid
 * @throws {AUTH_NOT_CONNECTED} Salesforce is not connected
 * @throws {SALESFORCE_REQUEST_FAILED} Salesforce rejected or could not complete the request
 */
async function deleteSObjects(input) {
  const req = requireInput(input);
  return dataRequest("/composite/sobjects", "DELETE", undefined, assignBoolean({ ids: requireCommaSeparated(req.ids, "ids", COLLECTION_RECORD_LIMIT) }, req, "allOrNone"));
}
