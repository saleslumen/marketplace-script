/**
 * @description Create Stage. POST /crm/pipelines/{apiVersion}/{objectType}/{pipelineId}/stages. displayOrder, label, and metadata are required. Other input keys are the stage body.
 * @param {Object} input
 * @param {string} input.objectType
 * @param {string} input.pipelineId
 * @param {number} input.displayOrder
 * @param {string} input.label
 * @param {Object} input.metadata
 * @returns {Object} HubSpot response body. An empty 2xx body is {}.
 * @throws {Error} HUBSPOT_INVALID_INPUT: <reason> when a required input is missing
 * @throws {Error} HUBSPOT_NOT_CONFIGURED when apiVersion is invalid
 * @throws {Error} AUTH_NOT_CONNECTED when HubSpot is not connected
 * @throws {Error} HUBSPOT_REQUEST_FAILED when HubSpot returns a non-2xx status
 */
async function createPipelineStage(input) {
  const req = inputObject(input);
  const objectType = requiredPath(req, "objectType");
  const pipelineId = requiredPath(req, "pipelineId");
  requiredInteger(req, "displayOrder");
  requiredStringField(req, "label");
  requiredObjectField(req, "metadata");
  return requestJson(`/crm/pipelines/${configuredApiVersion()}/${encodeURIComponent(objectType)}/${encodeURIComponent(pipelineId)}/stages`, "POST", bodyFrom(req, ["objectType", "pipelineId"]));
}
