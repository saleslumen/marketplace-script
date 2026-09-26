/**
 * @description Update a property group. PATCH /crm/properties/{apiVersion}/{objectType}/groups/{groupName}. Other input keys are the documented body and are sent unchanged.
 * @param {Object} input
 * @param {string} input.objectType
 * @param {string} input.groupName
 * @param {number} [input.displayOrder]
 * @param {string} [input.label]
 * @returns {Object} HubSpot response body
 * @throws {Error} HUBSPOT_INVALID_INPUT: <reason> when a required input is missing
 * @throws {Error} HUBSPOT_NOT_CONFIGURED when apiVersion is invalid
 * @throws {Error} AUTH_NOT_CONNECTED when HubSpot is not connected
 * @throws {Error} HUBSPOT_REQUEST_FAILED when HubSpot returns a non-2xx status
 */
async function updatePropertyGroup(input) {
  const req = inputObject(input);
  const objectType = requiredPath(req, "objectType");
  const groupName = requiredPath(req, "groupName");
  return requestJson(`/crm/properties/${configuredApiVersion()}/${encodeURIComponent(objectType)}/groups/${encodeURIComponent(groupName)}`, "PATCH", bodyFrom(req, ["objectType", "groupName"]));
}
