/**
 * @description Evaluate webhook payload shape and completed-issue claims without throwing for expected mismatches.
 * Requires a real Linear webhookId (no synthetic digest). Expected no-id / unrelated payloads return ok:false for ignore paths.
 * @param {Object} input
 * @param {Object|string} [input.payload] - Raw webhook body or nested data
 * @param {string} [input.teamId] - Expected team id
 * @param {string} [input.issueId]
 * @param {string} [input.webhookId] - Real Linear webhookId (required)
 * @param {string|number} [input.webhookTimestamp] - Linear webhookTimestamp for delivery uniqueness
 * @returns {Object}
 * @property {boolean} ok
 * @property {string} outcome
 * @property {string} issueId
 * @property {string} webhookId
 * @property {string} webhookDeliveryId
 * @property {string} failure
 */
async function evaluateWebhookIssueUpdate(input) {
  const req = input && typeof input === "object" ? input : {};
  let payload = req.payload;
  if (typeof payload === "string" && payload) {
    try {
      payload = JSON.parse(payload);
    } catch (_error) {
      return {
        ok: false,
        outcome: "INVALID_PAYLOAD",
        issueId: "",
        webhookId: "",
        webhookDeliveryId: "",
        failure: "Webhook payload is not valid JSON",
      };
    }
  }
  if (!payload || typeof payload !== "object") payload = {};
  const nested = payload.data && typeof payload.data === "object" ? payload.data : {};
  const type = asString(req.type || payload.type || nested.type);
  const action = asString(req.action || payload.action);
  const issueId = asString(
    req.issueId
      || nested.id
      || (nested.issue && nested.issue.id)
      || payload.id
      || (payload.issue && payload.issue.id),
  );
  const webhookId = asString(req.webhookId || payload.webhookId || nested.webhookId);
  const webhookTimestamp = asString(
    req.webhookTimestamp !== undefined && req.webhookTimestamp !== null
      ? req.webhookTimestamp
      : (payload.webhookTimestamp !== undefined && payload.webhookTimestamp !== null
        ? payload.webhookTimestamp
        : ""),
  );
  if (!webhookId) {
    return {
      ok: false,
      outcome: "MISSING_WEBHOOK_ID",
      issueId,
      webhookId: "",
      webhookDeliveryId: "",
      failure: "Real Linear webhookId is required; synthetic delivery ids are not allowed",
    };
  }
  const webhookDeliveryId = webhookTimestamp ? `${webhookId}:${webhookTimestamp}` : webhookId;
  let expectedTeamId = asString(req.teamId);
  if (!expectedTeamId) {
    try {
      expectedTeamId = (await getTeamId({})).teamId;
    } catch (_error) {
      return {
        ok: false,
        outcome: "MISSING_EXPECTED_TEAM",
        issueId,
        webhookId,
        webhookDeliveryId,
        failure: "Expected Linear team id is required (configuration teamId or input teamId)",
      };
    }
  }
  if (!expectedTeamId) {
    return {
      ok: false,
      outcome: "MISSING_EXPECTED_TEAM",
      issueId,
      webhookId,
      webhookDeliveryId,
      failure: "Expected Linear team id is required",
    };
  }
  if (type && type.toLowerCase() !== "issue") {
    return {
      ok: false,
      outcome: "IGNORED_TYPE",
      issueId,
      webhookId,
      webhookDeliveryId,
      failure: `Ignored webhook type ${type}`,
    };
  }
  if (action && !["update", "create"].includes(action.toLowerCase())) {
    return {
      ok: false,
      outcome: "IGNORED_ACTION",
      issueId,
      webhookId,
      webhookDeliveryId,
      failure: `Ignored webhook action ${action}`,
    };
  }
  if (!issueId) {
    return {
      ok: false,
      outcome: "MISSING_ISSUE",
      issueId: "",
      webhookId,
      webhookDeliveryId,
      failure: "Webhook issue id missing",
    };
  }
  const issue = await getIssue({ issueId });
  if (issue.teamId !== expectedTeamId) {
    return {
      ok: false,
      outcome: "TEAM_MISMATCH",
      issueId: issue.issueId,
      webhookId,
      webhookDeliveryId,
      teamId: issue.teamId,
      expectedTeamId,
      completed: issue.completed,
      failure: "Issue team does not match configured team",
    };
  }
  if (!issue.completed) {
    return {
      ok: false,
      outcome: "NOT_COMPLETED",
      issueId: issue.issueId,
      webhookId,
      webhookDeliveryId,
      teamId: issue.teamId,
      expectedTeamId,
      completed: false,
      stateType: issue.stateType,
      correlationId: issue.correlationId,
      failure: "Issue is not in a completed state",
    };
  }
  if (!issue.correlationId) {
    return {
      ok: false,
      outcome: "MISSING_CORRELATION_MARKER",
      issueId: issue.issueId,
      webhookId,
      webhookDeliveryId,
      teamId: issue.teamId,
      expectedTeamId,
      completed: true,
      stateType: issue.stateType,
      correlationId: "",
      failure: "Completed issue lacks sl-correlation marker; not a dedicated Google Admin trust issue",
    };
  }
  return {
    ok: true,
    outcome: "COMPLETED",
    issueId: issue.issueId,
    identifier: issue.identifier,
    url: issue.url,
    webhookId,
    webhookDeliveryId,
    teamId: issue.teamId,
    expectedTeamId,
    completed: true,
    stateType: issue.stateType,
    correlationId: issue.correlationId,
    failure: "",
  };
}
