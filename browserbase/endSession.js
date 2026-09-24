/**
 * @description End a Browserbase session. Ending an already-ended session is safe.
 * @param {Object} input
 * @param {string} input.sessionId
 * @returns {Object}
 * @property {string} sessionId
 * @property {string} status
 * @property {boolean} ended
 */
async function endSession(input) {
  const sessionId = asString(input && (input.sessionId || input.id));
  if (!sessionId) {
    return { sessionId: "", status: "MISSING", ended: true, alreadyEnded: true };
  }
  const current = await getSession({ sessionId });
  if (!current.found || current.ended) {
    return { sessionId, status: current.status || "COMPLETED", ended: true, alreadyEnded: true };
  }
  const updated = await browserbaseRequest(`/v1/sessions/${encodeURIComponent(sessionId)}`, "POST", {
    status: "REQUEST_RELEASE",
  });
  return {
    sessionId,
    status: asString(updated.status) || "COMPLETED",
    ended: true,
    alreadyEnded: false,
    operatorUrl: operatorSessionUrl(sessionId),
  };
}
