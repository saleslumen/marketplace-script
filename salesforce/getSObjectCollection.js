/**
 * @description Get records of one object type. GET /services/data/vXX.X/composite/sobjects/sObject?ids=recordId,recordId&fields=field,field
 * @param {Object} input
 * @param {string} input.sObject Object API name
 * @param {string} input.ids Comma-separated record ids
 * @param {string} input.fields Comma-separated field names
 * @returns {Object[]} Salesforce records
 * @throws {SALESFORCE_INVALID_INPUT} sObject, ids, or fields is missing
 * @throws {SALESFORCE_NOT_CONFIGURED} instanceUrl is missing or invalid, or apiVersion is invalid
 * @throws {AUTH_NOT_CONNECTED} Salesforce is not connected
 * @throws {SALESFORCE_REQUEST_FAILED} Salesforce rejected or could not complete the request
 */
async function getSObjectCollection(input) {
  const req = requireInput(input);
  return dataRequest(`/composite/sobjects/${encodeURIComponent(requireSObject(req.sObject))}`, "GET", undefined, {
    ids: requireCommaSeparated(req.ids, "ids"),
    fields: requireCommaSeparated(req.fields, "fields"),
  });
}
