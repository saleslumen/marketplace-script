/**
 * @description Register a Google or Microsoft provider workspace.
 * @param {Object} input
 * @param {number} input.workspaceId
 * @param {string} input.provider
 * @param {string} [input.adminEmail] Required when provider is google.
 * @param {string} [input.tenantId] Required when provider is microsoft.
 * @param {string} [input.state] Required when provider is microsoft.
 * @returns {Object}
 * @throws {Error} TRULYINBOX_INVALID_INPUT: <reason>
 * @throws {Error} TRULYINBOX_REQUEST_FAILED: <status> <message>
 */
async function registerProviderWorkspace(input) {
  const req = requireObjectInput(input);
  const workspaceId = readRequired(req, "workspaceId", "workspaceId", "number");
  const provider = readRequired(req, "provider", "provider", "string");
  const body = { provider };
  if (provider === "google") body.adminEmail = readRequired(req, "adminEmail", "adminEmail", "string");
  else put(body, "adminEmail", readOptional(req, "adminEmail", "string"));
  if (provider === "microsoft") {
    body.tenantId = readRequired(req, "tenantId", "tenantId", "string");
    body.state = readRequired(req, "state", "state", "string");
  } else {
    put(body, "tenantId", readOptional(req, "tenantId", "string"));
    put(body, "state", readOptional(req, "state", "string"));
  }
  return trulyinboxRequest("POST", workspacePath(workspaceId, "/provider-workspaces"), body);
}
