/**
 * @description Upsert one record by an external id. PATCH /services/data/vXX.X/sobjects/sObject/fieldName/fieldValue. Every property except sObject, fieldName, fieldValue, and updateOnly is a field value in the request body. An empty 2xx body is {}.
 * @param {Object} input
 * @param {string} input.sObject Object API name
 * @param {string} input.fieldName External id field API name
 * @param {string} input.fieldValue External id value
 * @param {boolean} [input.updateOnly] Do not create a record when the external id is missing
 * @returns {Object} Salesforce response body. An empty 2xx body is {}.
 * @throws {SALESFORCE_INVALID_INPUT} sObject, fieldName, or fieldValue is missing
 * @throws {SALESFORCE_NOT_CONFIGURED} instanceUrl is missing or invalid, or apiVersion is invalid
 * @throws {AUTH_NOT_CONNECTED} Salesforce is not connected
 * @throws {SALESFORCE_REQUEST_FAILED} Salesforce rejected or could not complete the request
 */
async function upsertSObject(input) {
  const req = requireInput(input);
  const path = sObjectPath(req.sObject, `/${encodeURIComponent(requireApiName(req.fieldName, "fieldName"))}/${encodeURIComponent(requireId(req.fieldValue, "fieldValue"))}`);
  return dataRequest(path, "PATCH", recordBody(req, ["sObject", "fieldName", "fieldValue", "updateOnly"]), assignBoolean({}, req, "updateOnly"));
}
