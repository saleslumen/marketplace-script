/**
 * @description Compare persisted trust attempt count to a limit for workflow branching.
 * @param {Object} input
 * @param {string} [input.recordId]
 * @param {string|number} [input.trustAttemptCount]
 * @param {string|number} [input.maxTrustAttempts]
 * @returns {Object}
 */
async function evaluateTrustAttemptLimit(input) {
  const req = input && typeof input === "object" ? input : {};
  let trustAttemptCount = Number(req.trustAttemptCount);
  const recordId = asString(req.recordId);
  const correlationId = asString(req.correlationId);
  if (!Number.isFinite(trustAttemptCount) && recordId) {
    const client = await getClient({ recordId, correlationId });
    const key = operationKey(client.recordId, correlationId, asString(req.workflow));
    const op = key && client.operations && client.operations.byKey ? client.operations.byKey[key] : null;
    trustAttemptCount = Number((op && op.trustAttemptCount) || client.operationTrustAttemptCount || client.trustAttemptCount) || 0;
  }
  if (!Number.isFinite(trustAttemptCount)) trustAttemptCount = 0;
  const maxTrustAttempts = Math.max(1, Number(req.maxTrustAttempts) || 3);
  return {
    underLimit: trustAttemptCount < maxTrustAttempts,
    trustAttemptCount,
    maxTrustAttempts,
    atLimit: trustAttemptCount >= maxTrustAttempts,
  };
}
