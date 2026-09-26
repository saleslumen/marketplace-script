/**
 * @description Update pipeline (Replace). PUT /crm/pipelines/{apiVersion}/{objectType}/{pipelineId}. displayOrder, label, and stages are required. validateDealStageUsagesBeforeDelete and validateReferencesBeforeDelete are query parameters.
 * @param {Object} input
 * @param {string} input.objectType
 * @param {string} input.pipelineId
 * @param {number} input.displayOrder
 * @param {string} input.label
 * @param {Object[]} input.stages
 * @returns {Object} HubSpot response body. An empty 2xx body is {}.
 * @throws {Error} HUBSPOT_INVALID_INPUT: <reason> when a required input is missing
 * @throws {Error} HUBSPOT_NOT_CONFIGURED when apiVersion is invalid
 * @throws {Error} AUTH_NOT_CONNECTED when HubSpot is not connected
 * @throws {Error} HUBSPOT_REQUEST_FAILED when HubSpot returns a non-2xx status
 */
async function replacePipeline(input) {
  const req = inputObject(input);
  const objectType = requiredPath(req, "objectType");
  const pipelineId = requiredPath(req, "pipelineId");
  requiredInteger(req, "displayOrder");
  requiredStringField(req, "label");
  presentArray(req, "stages");
  const omit = ["objectType", "pipelineId", "validateDealStageUsagesBeforeDelete", "validateReferencesBeforeDelete"];
  return requestJson(`/crm/pipelines/${configuredApiVersion()}/${encodeURIComponent(objectType)}/${encodeURIComponent(pipelineId)}`, "PUT", bodyFrom(req, omit), queryFrom(req, ["validateDealStageUsagesBeforeDelete", "validateReferencesBeforeDelete"]));
}
