/**
 * @description Get one Browserbase session. Safe fields only—no connectUrl or proxy secrets.
 * @param {Object} input
 * @param {string} input.sessionId
 * @returns {Object}
 * @property {boolean} found
 * @property {string} sessionId
 * @property {string} operatorUrl
 * @property {string} status
 */
async function getSession(input) {
  const sessionId = asString(input && (input.sessionId || input.id));
  if (!sessionId) throw new Error("BROWSERBASE_REQUEST_FAILED: sessionId is required");
  try {
    const session = await browserbaseRequest(`/v1/sessions/${encodeURIComponent(sessionId)}`, "GET");
    return {
      found: true,
      sessionId: asString(session.id || sessionId),
      operatorUrl: operatorSessionUrl(asString(session.id || sessionId)),
      status: asString(session.status),
      projectId: asString(session.projectId),
      ended: ["COMPLETED", "ERROR", "TIMED_OUT"].includes(asString(session.status)),
    };
  } catch (error) {
    const message = asString(error && error.message);
    if (message.includes("(404)")) {
      return { found: false, sessionId, operatorUrl: "", status: "NOT_FOUND", ended: true };
    }
    throw error;
  }
}
