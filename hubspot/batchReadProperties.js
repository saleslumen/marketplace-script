/**
 * @description Read a batch of properties. POST /crm/properties/{apiVersion}/{objectType}/batch/read. inputs is required. locale is a query parameter. archived belongs on the body.
 * @param {Object} input
 * @param {string} input.objectType
 * @param {Object[]} input.inputs
 * @param {string} [input.locale]
 * @param {boolean} [input.archived]
 * @returns {Object} HubSpot response body
 * @throws {Error} HUBSPOT_INVALID_INPUT: <reason> when a required input is missing
 * @throws {Error} HUBSPOT_NOT_CONFIGURED when apiVersion is invalid
 * @throws {Error} AUTH_NOT_CONNECTED when HubSpot is not connected
 * @throws {Error} HUBSPOT_REQUEST_FAILED when HubSpot returns a non-2xx status
 */
async function batchReadProperties(input) {
  const req = inputObject(input);
  const objectType = requiredPath(req, "objectType");
  requiredArray(req, "inputs");
  return requestJson(`/crm/properties/${configuredApiVersion()}/${encodeURIComponent(objectType)}/batch/read`, "POST", bodyFrom(req, ["objectType", "locale"]), queryFrom(req, ["locale"]));
}
