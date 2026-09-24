/**
 * @description Bulk start or stop warmup. Selectors emailAccountIds and tags are unioned and must resolve to 1–50 accounts.
 * @param {Object} input
 * @param {string} input.action - start or stop
 * @param {string|string[]|number[]} [input.emailAccountIds]
 * @param {string|string[]} [input.tags]
 * @returns {Object}
 */
async function bulkWarmupAction(input) {
  const req = input && typeof input === "object" ? input : {};
  const action = asString(req.action).toLowerCase();
  const emailAccountIds = asIdList(req.emailAccountIds);
  const tags = asCsvList(req.tags);
  if (!WARMUP_BULK_ACTIONS.includes(action)) {
    return { ok: false, outcome: "MISSING_WARMUP_ACTION", retryable: false, failure: "action must be start or stop" };
  }
  if (!emailAccountIds.length && !tags.length) {
    return {
      ok: false,
      outcome: "MISSING_BULK_WARMUP_SELECTION",
      retryable: false,
      failure: "emailAccountIds and/or tags is required",
    };
  }
  if (emailAccountIds.length > 50) {
    return { ok: false, outcome: "BULK_WARMUP_LIMIT", retryable: false, failure: "emailAccountIds is limited to 50 accounts" };
  }
  const body = { action };
  if (emailAccountIds.length) body.emailAccountIds = emailAccountIds;
  if (tags.length) body.tags = tags;
  const classified = classifyHttp(await trulyinboxRequestRaw("/warmup-settings/bulk-action", "POST", body));
  if (classified.status === 429 || classified.retryable) {
    return rateLimitedResult(classified, { results: [] });
  }
  if (classified.status < 200 || classified.status >= 300) {
    return {
      ok: false,
      outcome: "BULK_WARMUP_REJECTED",
      retryable: false,
      results: [],
      failure: classified.message || `Bulk warmup action failed (${classified.status})`,
    };
  }
  const results = (Array.isArray(classified.body.results) ? classified.body.results : []).map(mapBulkWarmupResult);
  return { ok: true, outcome: "BULK_WARMUP_APPLIED", retryable: false, action, results, failure: "" };
}
