/**
 * @description Create one record.
 * @param {string} sobject API name such as Account
 * @param {Object} fields Field map
 * @returns {Object} Create result
 * @property {string} id
 * @property {boolean} success
 * @property {Object} raw Salesforce create body
 * @throws {SALESFORCE_INVALID_INPUT} sobject is missing
 * @throws {SALESFORCE_NOT_CONFIGURED} instanceUrl is missing or invalid
 * @throws {AUTH_NOT_CONNECTED} Salesforce is not connected
 * @throws {SALESFORCE_REQUEST_FAILED} Salesforce rejected or could not complete the request
 */
async function createSObject(sobject, fields) {
  const result = await dataRequest(`/sobjects/${encodeURIComponent(requireSObject(sobject))}`, "POST", asFields(fields));
  return { id: asString(result.id), success: result.success !== false, raw: result };
}
