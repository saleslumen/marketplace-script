/**
 * @description Archive up to 100 CRM records via POST /crm/objects/{apiVersion}/{objectType}/batch/archive. inputs is an array of objects, each with id. HubSpot archives; this API does not hard-delete.
 * @param {string} objectType Object type path
 * @param {Object[]} inputs Batch archive inputs
 * @returns {Object} Batch result
 * @throws {HUBSPOT_INVALID_INPUT} objectType or inputs are missing or inputs exceeds 100
 * @throws {HUBSPOT_NOT_CONFIGURED} apiVersion is invalid
 * @throws {AUTH_NOT_CONNECTED} HubSpot is not connected
 * @throws {HUBSPOT_REQUEST_FAILED} HubSpot rejected or could not complete the request
 */
async function archiveRecords(objectType, inputs) {
  return requestJson(objectsPath(objectType, "/batch/archive"), "POST", { inputs: requireInputs(inputs) });
}
