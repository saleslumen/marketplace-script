/**
 * @description Check whether a webhook delivery id was already recorded for an in-flight or completed operation.
 * Suppress SUCCEEDED with the same delivery id. Suppress RUNNING only when the same delivery id is recorded
 * and connectExecutionId is already set (StartExecution succeeded). RUNNING without connectExecutionId is
 * not suppressed so crash recovery can retry StartExecution. RETRYING / BLOCKED_HUMAN / FAILED never suppress.
 * @param {Object} input
 * @param {string} [input.recordId]
 * @param {string} [input.correlationId]
 * @param {string} [input.workflow]
 * @param {string} input.webhookDeliveryId
 * @returns {Object}
 * @property {boolean} duplicate
 */
async function evaluateWebhookDeliveryDedupe(input) {
  const req = input && typeof input === "object" ? input : {};
  const webhookDeliveryId = asString(req.webhookDeliveryId);
  if (!webhookDeliveryId) {
    return { duplicate: false, reason: "MISSING_DELIVERY_ID", webhookDeliveryId: "" };
  }
  const recordId = asString(req.recordId);
  const correlationId = asString(req.correlationId);
  const linearIssueId = asString(req.linearIssueId);
  const client = recordId
    ? await getClient({ recordId, correlationId, linearIssueId })
    : await getClient({ linearIssueId, correlationId });
  if (!client.found) return { duplicate: false, reason: "CLIENT_NOT_FOUND", webhookDeliveryId };
  const byKey = client.operations && client.operations.byKey ? client.operations.byKey : {};
  const key = operationKey(
    client.recordId,
    correlationId || client.operationCorrelationId || client.correlationId,
    asString(req.workflow),
  );
  let op = key && byKey[key] ? byKey[key] : null;
  if (!op && linearIssueId) op = findOperation(client.operations, { linearIssueId, correlationId });
  if (!op && correlationId) op = findOperation(client.operations, { correlationId });
  const prior = asString(op && op.webhookDeliveryId) || asString(client.operationWebhookDeliveryId) || asString(client.webhookDeliveryId);
  const operationStatus = asString(op && op.status).toUpperCase();
  const connectExecutionId = asString(op && op.connectExecutionId) || asString(client.operationConnectExecutionId);
  const sameDelivery = Boolean(prior && prior === webhookDeliveryId);
  const suppressCompleted = sameDelivery && operationStatus === "SUCCEEDED";
  const suppressRunningWithConnect = sameDelivery && operationStatus === "RUNNING" && Boolean(connectExecutionId);
  const duplicate = suppressCompleted || suppressRunningWithConnect;
  let reason = "NEW_DELIVERY";
  if (duplicate && suppressCompleted) reason = "DUPLICATE_COMPLETED";
  else if (duplicate && suppressRunningWithConnect) reason = "DUPLICATE_RUNNING_CONNECT_STARTED";
  else if (sameDelivery && operationStatus === "RUNNING" && !connectExecutionId) reason = "SAME_DELIVERY_RUNNING_BEFORE_CONNECT";
  else if (sameDelivery) reason = "SAME_DELIVERY_RETRYABLE_STATUS";
  return {
    duplicate,
    webhookDeliveryId,
    priorWebhookDeliveryId: prior,
    operationStatus,
    connectExecutionId,
    reason,
  };
}
