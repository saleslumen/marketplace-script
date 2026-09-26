/**
 * @description Regenerate a Zapsite. POST /v2/zap-sites/{id}/regenerate.
 * @param {Object} input
 * @param {string} input.id
 * @param {string} input.x-workspace-id
 * @param {"GOOGLE"|"MICROSOFT"} input.serviceProvider
 * @param {string} input.notes
 * @returns {Object|string} Zapmail response body
 * @throws {Error} ZAPMAIL_INVALID_INPUT: <reason> when a required input is missing or invalid
 * @throws {Error} ZAPMAIL_REQUEST_FAILED: <status> <message> when Zapmail returns a non-2xx status
 */
async function regenerateZapSite(input) {
  const req = inputObject(input);
  const id = requiredString(req, "id");
  const serviceProvider = readServiceProvider(req, true);
  const workspaceId = readHeader(req, "x-workspace-id", true);
  requireField(req, "notes", "string");
  const body = omit(req, ["id", "serviceProvider", "x-workspace-key", "x-workspace-id"]);
  return zapmailRequest(`/v2/zap-sites/${encodeURIComponent(id)}/regenerate`, "POST", { serviceProvider, workspaceId, body });
}
