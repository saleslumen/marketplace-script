/**
 * @description Delete stage. DELETE /crm/pipelines/{apiVersion}/{objectType}/{pipelineId}/stages/{stageId}. validateReferencesBeforeDelete is an optional query parameter.
 * @param {Object} input
 * @param {string} input.objectType
 * @param {string} input.pipelineId
 * @param {string} input.stageId
 * @returns {Object} HubSpot response body. An empty 2xx body is {}.
 * @throws {Error} HUBSPOT_INVALID_INPUT: <reason> when a required input is missing
 * @throws {Error} HUBSPOT_NOT_CONFIGURED when apiVersion is invalid
 * @throws {Error} AUTH_NOT_CONNECTED when HubSpot is not connected
 * @throws {Error} HUBSPOT_REQUEST_FAILED when HubSpot returns a non-2xx status
 */
async function deletePipelineStage(input) {
  const req = inputObject(input);
  const objectType = requiredPath(req, "objectType");
  const pipelineId = requiredPath(req, "pipelineId");
  const stageId = requiredPath(req, "stageId");
  return requestJson(`/crm/pipelines/${configuredApiVersion()}/${encodeURIComponent(objectType)}/${encodeURIComponent(pipelineId)}/stages/${encodeURIComponent(stageId)}`, "DELETE", undefined, queryFrom(req, ["validateReferencesBeforeDelete"]));
}
