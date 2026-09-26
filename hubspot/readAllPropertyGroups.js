/**
 * @description Read all property groups. GET /crm/properties/{apiVersion}/{objectType}/groups.
 * @param {Object} input
 * @param {string} input.objectType
 * @param {string} [input.locale]
 * @returns {Object} HubSpot response body
 * @throws {Error} HUBSPOT_INVALID_INPUT: <reason> when a required input is missing
 * @throws {Error} HUBSPOT_NOT_CONFIGURED when apiVersion is invalid
 * @throws {Error} AUTH_NOT_CONNECTED when HubSpot is not connected
 * @throws {Error} HUBSPOT_REQUEST_FAILED when HubSpot returns a non-2xx status
 */
async function readAllPropertyGroups(input) {
  const req = inputObject(input);
  const objectType = requiredPath(req, "objectType");
  return requestJson(`/crm/properties/${configuredApiVersion()}/${encodeURIComponent(objectType)}/groups`, "GET", undefined, queryFrom(req, ["locale"]));
}
