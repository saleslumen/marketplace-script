/**
 * @description Get Export Status. GET /v2/exports/status.
 * @param {Object} input
 * @param {number} input.exportId
 * @param {string} input.x-workspace-key
 * @returns {Object|string} Zapmail response body
 * @throws {Error} ZAPMAIL_INVALID_INPUT: <reason> when a required input is missing or invalid
 * @throws {Error} ZAPMAIL_REQUEST_FAILED: <status> <message> when Zapmail returns a non-2xx status
 */
async function getExportStatus(input) {
  const req = inputObject(input);
  requireField(req, "exportId", "integer");
  const workspaceKey = readHeader(req, "x-workspace-key", true);
  return zapmailRequest(withQuery("/v2/exports/status", req, ["exportId"]), "GET", { workspaceKey });
}
