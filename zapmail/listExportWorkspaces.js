/**
 * @description Fetch Workspaces by App. GET /v2/exports/fetch-workspaces.
 * @param {Object} input
 * @param {string} input.app
 * @param {string} [input.accountId]
 * @returns {Object|string} Zapmail response body
 * @throws {Error} ZAPMAIL_INVALID_INPUT: <reason> when a required input is missing or invalid
 * @throws {Error} ZAPMAIL_REQUEST_FAILED: <status> <message> when Zapmail returns a non-2xx status
 */
async function listExportWorkspaces(input) {
  const req = inputObject(input);
  requireField(req, "app", "string");
  return zapmailRequest(withQuery("/v2/exports/fetch-workspaces", req, ["app", "accountId"]), "GET");
}
