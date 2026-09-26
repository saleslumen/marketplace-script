/**
 * @description Archive. DELETE /crm/objects/{apiVersion}/{objectType}/{objectId}.
 * @param {Object} input
 * @param {string} input.objectType
 * @param {string} input.objectId
 * @returns {Object} HubSpot response body. An empty 2xx body is {}.
 * @throws {Error} HUBSPOT_INVALID_INPUT: <reason> when a required input is missing
 * @throws {Error} HUBSPOT_NOT_CONFIGURED when apiVersion is invalid
 * @throws {Error} AUTH_NOT_CONNECTED when HubSpot is not connected
 * @throws {Error} HUBSPOT_REQUEST_FAILED when HubSpot returns a non-2xx status
 */
async function archiveObject(input) {
  const req = inputObject(input);
  const objectType = requiredPath(req, "objectType");
  const objectId = requiredPath(req, "objectId");
  return requestJson(`/crm/objects/${configuredApiVersion()}/${encodeURIComponent(objectType)}/${encodeURIComponent(objectId)}`, "DELETE");
}
