/**
 * @description Create an InboxKit workspace for a client.
 * @param {Object} input
 * @param {string} input.name
 * @param {string} [input.webhookUrl]
 * @returns {Object}
 * @property {string} workspaceId
 * @property {string} name
 */
async function createWorkspace(input) {
  const req = input && typeof input === "object" ? input : {};
  const name = asString(req.name || req.customerName);
  if (!name) throw new Error("INBOXKIT_REQUEST_FAILED: name is required");
  const body = { name };
  if (asString(req.webhookUrl)) body.webhook_url = asString(req.webhookUrl);
  const response = await inboxKitRequest("/v1/api/workspaces", "POST", body);
  if (response.error) throw new Error(`INBOXKIT_REQUEST_FAILED: ${asString(response.message) || "create workspace failed"}`);
  const data = response.data || response;
  return {
    workspaceId: asString(data.uid || data.id || data.workspace_id),
    name: asString(data.name || name),
    raw: data,
  };
}
