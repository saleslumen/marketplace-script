/**
 * @description Retrieve multiple custom object schemas in a batch request. POST /crm-object-schemas/{apiVersion}/schemas/batch/read.
 * @param {Object} input
 * @param {boolean} input.includeAssociationDefinitions
 * @param {boolean} input.includeAuditMetadata
 * @param {boolean} input.includePropertyDefinitions
 * @param {Object[]} input.inputs
 * @returns {Object} HubSpot response body. An empty 2xx body is {}.
 * @throws {Error} HUBSPOT_INVALID_INPUT: <reason> when a required input is missing
 * @throws {Error} HUBSPOT_NOT_CONFIGURED when apiVersion is invalid
 * @throws {Error} AUTH_NOT_CONNECTED when HubSpot is not connected
 * @throws {Error} HUBSPOT_REQUEST_FAILED when HubSpot returns a non-2xx status
 */
async function batchReadSchemas(input) {
  const req = inputObject(input);
  requiredBoolean(req, "includeAssociationDefinitions");
  requiredBoolean(req, "includeAuditMetadata");
  requiredBoolean(req, "includePropertyDefinitions");
  requiredArray(req, "inputs");
  return requestJson(`/crm-object-schemas/${configuredApiVersion()}/schemas/batch/read`, "POST", bodyFrom(req, []));
}
