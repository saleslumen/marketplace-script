/**
 * @description Deploy a Zapsite. GET /v2/zap-sites/{id}/deploy.
 * @param {Object} input
 * @param {string} input.id
 * @param {string} input.x-workspace-id
 * @param {"GOOGLE"|"MICROSOFT"} input.serviceProvider
 * @param {Array} input.domainIds
 * @param {boolean} input.indexing
 * @param {boolean} input.tracking
 * @param {boolean} input.form_enabled
 * @returns {Object|string} Zapmail response body
 * @throws {Error} ZAPMAIL_INVALID_INPUT: <reason> when a required input is missing or invalid
 * @throws {Error} ZAPMAIL_REQUEST_FAILED: <status> <message> when Zapmail returns a non-2xx status
 */
async function deployZapSite(input) {
  const req = inputObject(input);
  const id = requiredString(req, "id");
  const serviceProvider = readServiceProvider(req, true);
  const workspaceId = readHeader(req, "x-workspace-id", true);
  requireField(req, "domainIds", "array");
  requireField(req, "indexing", "boolean");
  requireField(req, "tracking", "boolean");
  requireField(req, "form_enabled", "boolean");
  const body = omit(req, ["id", "serviceProvider", "x-workspace-key", "x-workspace-id"]);
  return zapmailRequest(`/v2/zap-sites/${encodeURIComponent(id)}/deploy`, "GET", { serviceProvider, workspaceId, body });
}
