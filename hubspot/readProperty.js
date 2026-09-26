/**
 * @description Read a property. GET /crm/properties/{apiVersion}/{objectType}/{propertyName}.
 * @param {Object} input
 * @param {string} input.objectType
 * @param {string} input.propertyName
 * @param {boolean} [input.archived]
 * @param {string} [input.dataSensitivity]
 * @param {string} [input.locale]
 * @param {string} [input.properties]
 * @returns {Object} HubSpot response body
 * @throws {Error} HUBSPOT_INVALID_INPUT: <reason> when a required input is missing
 * @throws {Error} HUBSPOT_NOT_CONFIGURED when apiVersion is invalid
 * @throws {Error} AUTH_NOT_CONNECTED when HubSpot is not connected
 * @throws {Error} HUBSPOT_REQUEST_FAILED when HubSpot returns a non-2xx status
 */
async function readProperty(input) {
  const req = inputObject(input);
  const objectType = requiredPath(req, "objectType");
  const propertyName = requiredPath(req, "propertyName");
  return requestJson(`/crm/properties/${configuredApiVersion()}/${encodeURIComponent(objectType)}/${encodeURIComponent(propertyName)}`, "GET", undefined, queryFrom(req, ["archived", "dataSensitivity", "locale", "properties"]));
}
