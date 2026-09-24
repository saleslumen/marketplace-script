/**
 * @description Archive one CRM record via DELETE /crm/objects/{apiVersion}/{objectType}/{id}. HubSpot archives to the recycling bin; this API does not hard-delete.
 * @param {string} objectType Object type path
 * @param {string} id Record id
 * @returns {Object} Archive result
 * @property {string} id
 * @property {boolean} success
 * @throws {HUBSPOT_INVALID_INPUT} objectType or id is missing
 * @throws {HUBSPOT_NOT_CONFIGURED} apiVersion is invalid
 * @throws {AUTH_NOT_CONNECTED} HubSpot is not connected
 * @throws {HUBSPOT_REQUEST_FAILED} HubSpot rejected or could not complete the request
 */
async function archiveRecord(objectType, id) {
  const recordId = requireId(id);
  await requestJson(objectsPath(objectType, `/${encodeURIComponent(recordId)}`), "DELETE");
  return { id: recordId, success: true };
}
