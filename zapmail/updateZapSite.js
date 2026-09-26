/**
 * @description Edit a Zapsite. PATCH /v2/zap-sites/{id}.
 * @param {Object} input
 * @param {string} input.id
 * @param {string} input.x-workspace-id
 * @param {"GOOGLE"|"MICROSOFT"} input.serviceProvider
 * @param {string} input.name
 * @param {string} input.notify_email
 * @param {Array} input.form_fields
 * @returns {Object|string} Zapmail response body
 * @throws {Error} ZAPMAIL_INVALID_INPUT: <reason> when a required input is missing or invalid
 * @throws {Error} ZAPMAIL_REQUEST_FAILED: <status> <message> when Zapmail returns a non-2xx status
 */
async function updateZapSite(input) {
  const req = inputObject(input);
  const id = requiredString(req, "id");
  const serviceProvider = readServiceProvider(req, true);
  const workspaceId = readHeader(req, "x-workspace-id", true);
  requireField(req, "name", "string");
  requireField(req, "notify_email", "string");
  requireField(req, "form_fields", "array");
  const body = omit(req, ["id", "serviceProvider", "x-workspace-key", "x-workspace-id"]);
  return zapmailRequest(`/v2/zap-sites/${encodeURIComponent(id)}`, "PATCH", { serviceProvider, workspaceId, body });
}
