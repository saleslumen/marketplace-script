/**
 * @description Describe layouts for one record type. GET /services/data/vXX.X/sobjects/sObject/describe/layouts/recordTypeId
 * @param {Object} input
 * @param {string} input.sObject Object API name
 * @param {string} input.recordTypeId Record type id
 * @returns {Object} Salesforce record type layouts
 * @throws {SALESFORCE_INVALID_INPUT} sObject or recordTypeId is missing
 * @throws {SALESFORCE_NOT_CONFIGURED} instanceUrl is missing or invalid, or apiVersion is invalid
 * @throws {AUTH_NOT_CONNECTED} Salesforce is not connected
 * @throws {SALESFORCE_REQUEST_FAILED} Salesforce rejected or could not complete the request
 */
async function describeRecordTypeLayouts(input) {
  const req = requireInput(input);
  return dataRequest(sObjectPath(req.sObject, `/describe/layouts/${encodeURIComponent(requireId(req.recordTypeId, "recordTypeId"))}`), "GET");
}
