/**
 * @description Merge one or more slug → workflow id entries into Clients `Namespace Workflow IDs`.
 * @param {Object} input
 * @param {string} [input.recordId]
 * @param {string} [input.namespaceId]
 * @param {string} [input.slug]
 * @param {string} [input.workflowId]
 * @param {Object} [input.workflowIds]
 * @returns {Object}
 */
async function mergeNamespaceWorkflowIds(input) {
  const req = input && typeof input === "object" ? input : {};
  let recordId = asString(req.recordId);
  const namespaceId = asString(req.namespaceId);
  if (!recordId && namespaceId) {
    const client = await getClient({ namespaceId });
    if (!client.found) throw new Error("AIRTABLE_REQUEST_FAILED: client not found for namespaceId");
    recordId = client.recordId;
  }
  if (!recordId) throw new Error("AIRTABLE_REQUEST_FAILED: recordId or namespaceId is required");
  const current = await getClient({ recordId });
  if (!current.found) throw new Error("AIRTABLE_REQUEST_FAILED: client not found");
  const merged = { ...(current.namespaceWorkflowIds || {}) };
  if (req.workflowIds && typeof req.workflowIds === "object" && !Array.isArray(req.workflowIds)) {
    Object.keys(req.workflowIds).forEach((key) => {
      const slug = asString(key);
      const workflowId = asString(req.workflowIds[key]);
      if (slug && workflowId) merged[slug] = workflowId;
    });
  }
  const singleSlug = asString(req.slug);
  const singleId = asString(req.workflowId);
  if (singleSlug && singleId) merged[singleSlug] = singleId;
  return setNamespaceWorkflowIds({ recordId, workflowIds: merged });
}
