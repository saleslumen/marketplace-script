/**
 * @description Recompute Clients glance fields from all Operations rows for a client. Safe to call after concurrent writeStatus races.
 * @param {Object} input
 * @param {string} [input.recordId]
 * @param {string} [input.namespaceId]
 * @returns {Object}
 */
async function reconcileClientGlance(input) {
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
  const operations = current.operationRows || Object.values((current.operations && current.operations.byKey) || {});
  const glance = buildGlanceFields(operations, current.stage);
  const patched = await patchRecord(recordId, glance);
  const primary = choosePrimaryOperation(operations);
  return {
    recordId: patched.recordId,
    namespaceId: patched.namespaceId || current.namespaceId,
    status: asString(patched.status),
    stage: asString(patched.stage),
    progress: asString(patched.progress),
    correlationId: asString(patched.correlationId),
    linearIssueId: asString(patched.linearIssueId),
    browserbaseSessionId: asString(patched.browserbaseSessionId),
    webhookDeliveryId: asString(patched.webhookDeliveryId),
    failureExecutionId: asString(patched.failureExecutionId),
    trustAttemptCount: Number(patched.trustAttemptCount) || 0,
    primaryOperationKey: asString(primary && primary.key),
    operationCount: operations.length,
    updatedAt: asString(patched.updatedAt),
    success: true,
  };
}
