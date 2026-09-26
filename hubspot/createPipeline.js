/**
 * @description Create pipeline. POST /crm/pipelines/{apiVersion}/{objectType}. displayOrder, label, and stages are required. Other input keys are the pipeline body.
 * @param {Object} input
 * @param {string} input.objectType
 * @param {number} input.displayOrder
 * @param {string} input.label
 * @param {Object[]} input.stages
 * @returns {Object} HubSpot response body. An empty 2xx body is {}.
 * @throws {Error} HUBSPOT_INVALID_INPUT: <reason> when a required input is missing
 * @throws {Error} HUBSPOT_NOT_CONFIGURED when apiVersion is invalid
 * @throws {Error} AUTH_NOT_CONNECTED when HubSpot is not connected
 * @throws {Error} HUBSPOT_REQUEST_FAILED when HubSpot returns a non-2xx status
 */
async function createPipeline(input) {
  const req = inputObject(input);
  const objectType = requiredPath(req, "objectType");
  requiredInteger(req, "displayOrder");
  requiredStringField(req, "label");
  presentArray(req, "stages");
  return requestJson(`/crm/pipelines/${configuredApiVersion()}/${encodeURIComponent(objectType)}`, "POST", bodyFrom(req, ["objectType"]));
}
