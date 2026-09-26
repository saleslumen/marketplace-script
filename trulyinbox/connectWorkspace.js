/**
 * @description Register a Google Workspace or Microsoft tenant for bulk connect.
 * @param {Object} input
 * @param {string} input.provider google or microsoft.
 * @param {string} [input.adminEmail] Required when provider is google.
 * @param {string} [input.tenantId] Required when provider is microsoft.
 * @returns {Object}
 * @throws {Error} TRULYINBOX_INVALID_INPUT: <reason>
 * @throws {Error} TRULYINBOX_REQUEST_FAILED: <status> <message>
 */
async function connectWorkspace(input) {
  const req = requireObjectInput(input);
  const provider = readRequired(req, "provider", "provider", "string");
  if (provider === "google") readRequired(req, "adminEmail", "adminEmail", "string");
  if (provider === "microsoft") readRequired(req, "tenantId", "tenantId", "string");
  const body = { provider };
  if (req.adminEmail !== undefined) body.adminEmail = req.adminEmail;
  if (req.tenantId !== undefined) body.tenantId = req.tenantId;
  return trulyinboxRequest("POST", "/workspaces", body);
}
