/**
 * @description Start an export. POST /crm/exports/{apiVersion}/export/async. listId is the LIST export field. publicCrmSearchRequest is the VIEW export field. Other input keys are the export body.
 * @param {Object} input
 * @param {string[]} input.associatedObjectType
 * @param {string[]} input.exportInternalValuesOptions
 * @param {string} input.exportName
 * @param {string} input.exportType
 * @param {string} input.format
 * @param {boolean} input.includeLabeledAssociations
 * @param {boolean} input.includePrimaryDisplayPropertyForAssociatedObjects
 * @param {string} input.language
 * @param {string[]} input.objectProperties
 * @param {string} input.objectType
 * @param {boolean} input.overrideAssociatedObjectsPerDefinitionPerRowLimit
 * @returns {Object} HubSpot response body. An empty 2xx body is {}.
 * @throws {Error} HUBSPOT_INVALID_INPUT: <reason> when a required input is missing
 * @throws {Error} HUBSPOT_NOT_CONFIGURED when apiVersion is invalid
 * @throws {Error} AUTH_NOT_CONNECTED when HubSpot is not connected
 * @throws {Error} HUBSPOT_REQUEST_FAILED when HubSpot returns a non-2xx status
 */
async function startExport(input) {
  const req = inputObject(input);
  presentArray(req, "associatedObjectType");
  presentArray(req, "exportInternalValuesOptions");
  requiredStringField(req, "exportName");
  requiredStringField(req, "exportType");
  requiredStringField(req, "format");
  requiredBoolean(req, "includeLabeledAssociations");
  requiredBoolean(req, "includePrimaryDisplayPropertyForAssociatedObjects");
  requiredStringField(req, "language");
  presentArray(req, "objectProperties");
  requiredStringField(req, "objectType");
  requiredBoolean(req, "overrideAssociatedObjectsPerDefinitionPerRowLimit");
  return requestJson(`/crm/exports/${configuredApiVersion()}/export/async`, "POST", bodyFrom(req, []));
}
