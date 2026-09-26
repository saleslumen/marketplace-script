/**
 * @description Retrieve audit logs. GET /crm/pipelines/{apiVersion}/{objectType}/{pipelineId}/audit.
 * @param {Object} input
 * @param {string} input.objectType
 * @param {string} input.pipelineId
 * @returns {Object} HubSpot response body. An empty 2xx body is {}.
 * @throws {Error} HUBSPOT_INVALID_INPUT: <reason> when a required input is missing
 * @throws {Error} HUBSPOT_NOT_CONFIGURED when apiVersion is invalid
 * @throws {Error} AUTH_NOT_CONNECTED when HubSpot is not connected
 * @throws {Error} HUBSPOT_REQUEST_FAILED when HubSpot returns a non-2xx status
 */
async function retrievePipelineAudit(input) {
  const req = inputObject(input);
  const objectType = requiredPath(req, "objectType");
  const pipelineId = requiredPath(req, "pipelineId");
  return requestJson(`/crm/pipelines/${configuredApiVersion()}/${encodeURIComponent(objectType)}/${encodeURIComponent(pipelineId)}/audit`, "GET");
}
