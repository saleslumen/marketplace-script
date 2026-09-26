/**
 * @description Retrieve export status. GET /crm/exports/{apiVersion}/export/async/tasks/{taskId}/status.
 * @param {Object} input
 * @param {string} input.taskId
 * @returns {Object} HubSpot response body. An empty 2xx body is {}.
 * @throws {Error} HUBSPOT_INVALID_INPUT: <reason> when a required input is missing
 * @throws {Error} HUBSPOT_NOT_CONFIGURED when apiVersion is invalid
 * @throws {Error} AUTH_NOT_CONNECTED when HubSpot is not connected
 * @throws {Error} HUBSPOT_REQUEST_FAILED when HubSpot returns a non-2xx status
 */
async function retrieveExportStatus(input) {
  const req = inputObject(input);
  const taskId = requiredPath(req, "taskId");
  return requestJson(`/crm/exports/${configuredApiVersion()}/export/async/tasks/${encodeURIComponent(taskId)}/status`, "GET");
}
