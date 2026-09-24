/**
 * @description Update up to 100 CRM records via POST /crm/objects/{apiVersion}/{objectType}/batch/update. inputs is an array of objects, each with id and properties.
 * @param {string} objectType Object type path
 * @param {Object[]} inputs Batch update inputs
 * @returns {Object} Batch result
 * @throws {HUBSPOT_INVALID_INPUT} objectType or inputs are missing or inputs exceeds 100
 * @throws {HUBSPOT_NOT_CONFIGURED} apiVersion is invalid
 * @throws {AUTH_NOT_CONNECTED} HubSpot is not connected
 * @throws {HUBSPOT_REQUEST_FAILED} HubSpot rejected or could not complete the request
 */
async function updateRecords(objectType, inputs) {
  return requestJson(objectsPath(objectType, "/batch/update"), "POST", { inputs: requireInputs(inputs) });
}
