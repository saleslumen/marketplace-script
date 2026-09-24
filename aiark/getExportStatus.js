/**
 * @description Poll Export People with Email statistics for a trackId. Never resubmits the export.
 * @param {Object} input
 * @param {string} input.trackId - Track id from POST /v1/people/export.
 * @returns {Object} Job status.
 * @property {string} state - Vendor state, for example PENDING or DONE.
 * @throws {AIARK_API_KEY_MISSING} When no AI Ark API key is stored.
 * @throws {AIARK_REQUEST_FAILED} When AI Ark rejects or cannot complete the request.
 */
async function getExportStatus(input) {
  const req = input && typeof input === "object" ? input : {};
  const trackId = asString(req.trackId);
  if (!trackId) {
    return { ok: false, outcome: "EXPORT_FAILED", trackId: "", state: "", total: 0, found: 0, failure: "trackId is required" };
  }
  const classified = await aiarkRequest(`/v1/people/export/${encodeURIComponent(trackId)}/statistics`, "GET");
  const counts = statisticsCounts(classified);
  const state = statisticsState(classified);
  if (isStuckRefund(classified)) {
    return {
      ok: false,
      outcome: "EXPORT_FAILED",
      trackId,
      state: state || "REFUNDED",
      total: counts.total,
      found: counts.found,
      success: counts.success,
      failed: counts.failed,
      failure: classified.message || "Export trackId was auto-refunded (STUCK_*); resubmit without trackId",
    };
  }
  if (classified.notFound) {
    return { ok: false, outcome: "EXPORT_FAILED", trackId, state: "", total: 0, found: 0, failure: classified.message || "trackId not found or expired" };
  }
  if (classified.status < 200 || classified.status >= 300) throwClassified(classified);
  if (state === "DONE" && counts.total === 0 && counts.found === 0) {
    return {
      ok: false,
      outcome: "EXPORT_EMPTY",
      trackId,
      state,
      total: counts.total,
      found: counts.found,
      success: counts.success,
      failed: counts.failed,
      failure: isNoResultRefund(classified) ? classified.message : "Export finished with no people or emails",
    };
  }
  if (state === "DONE") {
    return { ok: true, outcome: "EXPORT_DONE", trackId, state, total: counts.total, found: counts.found, success: counts.success, failed: counts.failed, failure: "" };
  }
  return {
    ok: false,
    outcome: "EXPORT_PENDING",
    trackId,
    state: state || "PENDING",
    total: counts.total,
    found: counts.found,
    success: counts.success,
    failed: counts.failed,
    failure: "Export is still in progress; rerun with the same trackId",
  };
}
