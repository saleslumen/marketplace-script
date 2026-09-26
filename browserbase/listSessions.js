/**
 * @description List sessions. GET /v1/sessions.
 * @param {Object} [input]
 * @param {"PENDING"|"RUNNING"|"ERROR"|"TIMED_OUT"|"COMPLETED"} [input.status]
 * @param {string} [input.q] - User metadata query
 * @returns {Object[]} sessions
 * @throws {Error} BROWSERBASE_REQUEST_FAILED when input is invalid or Browserbase rejects the request
 */
async function listSessions(input) {
  const req = optionalInput(input);
  const parts = [];
  if (defined(req, "status")) pushQuery(parts, "status", requireEnum(req.status, "status", SESSION_STATUSES));
  if (defined(req, "q")) pushQuery(parts, "q", requireString(req.q, "q"));
  return browserbaseRequest(`/v1/sessions${queryString(parts)}`, "GET");
}
