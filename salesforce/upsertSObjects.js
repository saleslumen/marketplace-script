/**
 * @description Upsert up to 200 records by an external id field. PATCH /services/data/vXX.X/composite/sobjects/SobjectName/ExternalIdFieldName. Each record supplies attributes.type.
 * @param {Object} input
 * @param {string} input.SobjectName Object API name
 * @param {string} input.ExternalIdFieldName External id field API name
 * @param {boolean} [input.allOrNone] Roll back the request when one record fails
 * @param {Object[]} input.records Records
 * @returns {Object[]} Salesforce UpsertResult list
 * @throws {SALESFORCE_INVALID_INPUT} SobjectName, ExternalIdFieldName, or records is missing
 * @throws {SALESFORCE_NOT_CONFIGURED} instanceUrl is missing or invalid, or apiVersion is invalid
 * @throws {AUTH_NOT_CONNECTED} Salesforce is not connected
 * @throws {SALESFORCE_REQUEST_FAILED} Salesforce rejected or could not complete the request
 */
async function upsertSObjects(input) {
  const req = requireInput(input);
  const path = `/composite/sobjects/${encodeURIComponent(requireApiName(req.SobjectName, "SobjectName"))}/${encodeURIComponent(requireApiName(req.ExternalIdFieldName, "ExternalIdFieldName"))}`;
  return dataRequest(path, "PATCH", collectionBody(req));
}
