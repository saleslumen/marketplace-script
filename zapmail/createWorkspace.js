/**
 * @description Create a Zapmail workspace for a client.
 * @param {Object} input
 * @param {string} input.name
 * @returns {Object}
 * @property {string} workspaceId
 * @property {string} name
 */
async function createWorkspace(input) {
  const req = input && typeof input === "object" ? input : {};
  const name = asString(req.name || req.customerName);
  if (!name) throw new Error("ZAPMAIL_REQUEST_FAILED: name is required");
  const body = { name };
  const response = await zapmailRequest("/v2/workspaces", "POST", body);
  const data = response.data || response;
  return {
    workspaceId: asString(data.id || data.workspaceId || data.workspace_id),
    name: asString(data.name || name),
  };
}
