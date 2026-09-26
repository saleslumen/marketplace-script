/**
 * @description Retrieve all custom object schemas. GET /crm-object-schemas/{apiVersion}/schemas.
 * @param {Object} input
 * @param {boolean} [input.archived]
 * @param {boolean} [input.includeAssociationDefinitions]
 * @param {boolean} [input.includeAuditMetadata]
 * @param {boolean} [input.includePropertyDefinitions]
 * @returns {Object} HubSpot response body. An empty 2xx body is {}.
 * @throws {Error} HUBSPOT_INVALID_INPUT: <reason> when a required input is missing
 * @throws {Error} HUBSPOT_NOT_CONFIGURED when apiVersion is invalid
 * @throws {Error} AUTH_NOT_CONNECTED when HubSpot is not connected
 * @throws {Error} HUBSPOT_REQUEST_FAILED when HubSpot returns a non-2xx status
 */
async function retrieveSchemas(input) {
  const req = input === undefined ? {} : inputObject(input);
  return requestJson(`/crm-object-schemas/${configuredApiVersion()}/schemas`, "GET", undefined, queryFrom(req, ["archived", "includeAssociationDefinitions", "includeAuditMetadata", "includePropertyDefinitions"]));
}
