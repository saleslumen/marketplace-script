/**
 * @description Delete one record by id.
 * @param {string} sobject API name such as Account
 * @param {string} id Record id
 * @returns {Object} Delete result
 * @property {string} id
 * @property {boolean} success
 * @throws {SALESFORCE_INVALID_INPUT} sobject or id is missing
 * @throws {SALESFORCE_NOT_CONFIGURED} instanceUrl is missing or invalid
 * @throws {AUTH_NOT_CONNECTED} Salesforce is not connected
 * @throws {SALESFORCE_REQUEST_FAILED} Salesforce rejected or could not complete the request
 */
async function deleteSObject(sobject, id) {
  const recordId = requireId(id);
  await dataRequest(`/sobjects/${encodeURIComponent(requireSObject(sobject))}/${encodeURIComponent(recordId)}`, "DELETE");
  return { id: recordId, success: true };
}
