/**
 * @description Replace the Clients `Namespace Workflow IDs` JSON map (slug → workflow id). Non-secret; written at provision.
 * @param {Object} input
 * @param {string} [input.recordId]
 * @param {string} [input.namespaceId]
 * @param {Object} input.workflowIds - { [slug]: workflowId }
 * @returns {Object}
 */
async function setNamespaceWorkflowIds(input) {
  const req = input && typeof input === "object" ? input : {};
  const map = req.workflowIds && typeof req.workflowIds === "object" && !Array.isArray(req.workflowIds) ? req.workflowIds : req.map;
  if (!map || typeof map !== "object" || Array.isArray(map)) {
    throw new Error("AIRTABLE_REQUEST_FAILED: workflowIds map is required");
  }
  const normalized = {};
  Object.keys(map).forEach((key) => {
    const slug = asString(key);
    const workflowId = asString(map[key]);
    if (slug && workflowId) normalized[slug] = workflowId;
  });
  let recordId = asString(req.recordId);
  const namespaceId = asString(req.namespaceId);
  if (!recordId && namespaceId) {
    const client = await getClient({ namespaceId });
    if (!client.found) throw new Error("AIRTABLE_REQUEST_FAILED: client not found for namespaceId");
    recordId = client.recordId;
  }
  if (!recordId) throw new Error("AIRTABLE_REQUEST_FAILED: recordId or namespaceId is required");
  const patched = await patchRecord(recordId, {
    [FIELD.namespaceWorkflowIds]: JSON.stringify(normalized),
    [FIELD.updatedAt]: utcNowIso(),
  });
  return {
    success: true,
    recordId: patched.recordId || recordId,
    namespaceId: patched.namespaceId || namespaceId,
    workflowIds: normalized,
    count: Object.keys(normalized).length,
  };
}
