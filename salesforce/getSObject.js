/**
 * @description Get one record. GET /services/data/vXX.X/sobjects/sObject/id/
 * @param {Object} input
 * @param {string} input.sObject Object API name
 * @param {string} input.id Record id
 * @param {string} [input.fields] Comma-separated field list
 * @param {string} [input.If-Match] Account ETag precondition
 * @param {string} [input.If-None-Match] Account ETag precondition
 * @param {string} [input.If-Modified-Since] Modification precondition
 * @param {string} [input.If-Unmodified-Since] Modification precondition
 * @returns {Object} Salesforce record
 * @throws {SALESFORCE_INVALID_INPUT} sObject or id is missing
 * @throws {SALESFORCE_NOT_CONFIGURED} instanceUrl is missing or invalid, or apiVersion is invalid
 * @throws {AUTH_NOT_CONNECTED} Salesforce is not connected
 * @throws {SALESFORCE_REQUEST_FAILED} Salesforce rejected or could not complete the request
 */
async function getSObject(input) {
  const req = requireInput(input);
  const fields = optionalText(req.fields, "fields");
  return dataRequest(sObjectPath(req.sObject, `/${encodeURIComponent(requireId(req.id))}/`), "GET", undefined, fields === undefined ? undefined : { fields }, conditionalHeaders(req));
}
