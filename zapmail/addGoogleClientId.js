/**
 * @description Ask Zapmail to add Saleslumen's Google OAuth Client ID to domains.
 * @param {Object} input
 * @param {string} input.workspaceId
 * @param {string|string[]} input.domainIds
 * @param {string} input.clientId
 * @param {string} input.app
 */
async function addGoogleClientId(input) {
  const req = input && typeof input === "object" ? input : {};
  const workspaceId = asString(req.workspaceId);
  const domainIds = asCsvList(req.domainIds);
  const clientId = asString(req.clientId);
  const app = asString(req.app || req.appName);
  if (!workspaceId) throw new Error("ZAPMAIL_REQUEST_FAILED: workspaceId is required");
  if (!domainIds.length) throw new Error("ZAPMAIL_REQUEST_FAILED: domainIds is required");
  if (!clientId) throw new Error("ZAPMAIL_REQUEST_FAILED: clientId is required");
  if (!app) throw new Error("ZAPMAIL_REQUEST_FAILED: app is required");
  const response = await zapmailRequest("/v2/domains/add-client-id", "POST", { domainIds, clientId, app }, workspaceId);
  return { ok: true, message: asString(response.message) };
}
