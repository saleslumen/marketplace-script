/**
 * @description Update one record. PATCH /services/data/vXX.X/sobjects/sObject/id/. Every property except sObject, id, and the conditional headers is a field value in the request body. An empty 2xx body is {}.
 * @param {Object} input
 * @param {string} input.sObject Object API name
 * @param {string} input.id Record id
 * @param {string} [input.If-Match] Account ETag precondition
 * @param {string} [input.If-None-Match] Account ETag precondition
 * @param {string} [input.If-Modified-Since] Modification precondition
 * @param {string} [input.If-Unmodified-Since] Modification precondition
 * @returns {Object} Salesforce response body. An empty 2xx body is {}.
 * @throws {SALESFORCE_INVALID_INPUT} sObject or id is missing
 * @throws {SALESFORCE_NOT_CONFIGURED} instanceUrl is missing or invalid, or apiVersion is invalid
 * @throws {AUTH_NOT_CONNECTED} Salesforce is not connected
 * @throws {SALESFORCE_REQUEST_FAILED} Salesforce rejected or could not complete the request
 */
async function updateSObject(input) {
  const req = requireInput(input);
  const reserved = ["sObject", "id"].concat(CONDITIONAL_HEADERS);
  return dataRequest(sObjectPath(req.sObject, `/${encodeURIComponent(requireId(req.id))}/`), "PATCH", recordBody(req, reserved), undefined, conditionalHeaders(req));
}
