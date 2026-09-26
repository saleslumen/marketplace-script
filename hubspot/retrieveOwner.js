/**
 * @description Retrieve an owner. GET /crm/owners/{apiVersion}/{ownerId}. idProperty selects id or userId.
 * @param {Object} input
 * @param {string} input.ownerId
 * @param {boolean} [input.archived]
 * @param {string} [input.idProperty]
 * @returns {Object} HubSpot response body. An empty 2xx body is {}.
 * @throws {Error} HUBSPOT_INVALID_INPUT: <reason> when a required input is missing
 * @throws {Error} HUBSPOT_NOT_CONFIGURED when apiVersion is invalid
 * @throws {Error} AUTH_NOT_CONNECTED when HubSpot is not connected
 * @throws {Error} HUBSPOT_REQUEST_FAILED when HubSpot returns a non-2xx status
 */
async function retrieveOwner(input) {
  const req = inputObject(input);
  const ownerId = requiredPath(req, "ownerId");
  return requestJson(`/crm/owners/${configuredApiVersion()}/${encodeURIComponent(ownerId)}`, "GET", undefined, queryFrom(req, ["archived", "idProperty"]));
}
