/**
 * @description Read a batch of objects by internal ID, or unique property values. POST /crm/objects/{apiVersion}/{objectType}/batch/read. inputs is required. archived is a query parameter. idProperty, properties, and propertiesWithHistory belong on the body.
 * @param {Object} input
 * @param {string} input.objectType
 * @param {Object[]} input.inputs
 * @param {boolean} [input.archived]
 * @param {string} [input.idProperty]
 * @param {string[]} [input.properties]
 * @param {string[]} [input.propertiesWithHistory]
 * @returns {Object} HubSpot response body
 * @throws {Error} HUBSPOT_INVALID_INPUT: <reason> when a required input is missing
 * @throws {Error} HUBSPOT_NOT_CONFIGURED when apiVersion is invalid
 * @throws {Error} AUTH_NOT_CONNECTED when HubSpot is not connected
 * @throws {Error} HUBSPOT_REQUEST_FAILED when HubSpot returns a non-2xx status
 */
async function batchReadObjects(input) {
  const req = inputObject(input);
  const objectType = requiredPath(req, "objectType");
  requiredArray(req, "inputs");
  return requestJson(`/crm/objects/${configuredApiVersion()}/${encodeURIComponent(objectType)}/batch/read`, "POST", bodyFrom(req, ["objectType", "archived"]), queryFrom(req, ["archived"]));
}
