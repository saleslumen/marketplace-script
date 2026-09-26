/**
 * @description Update a session. POST /v1/sessions/{id}. status is REQUEST_RELEASE.
 * @param {Object} input
 * @param {string} input.id
 * @param {"REQUEST_RELEASE"} input.status
 * @returns {Object} the Browserbase session
 * @throws {Error} BROWSERBASE_REQUEST_FAILED when input is invalid or Browserbase rejects the request
 */
async function updateSession(input) {
  const located = requirePathId(input);
  if (!defined(located.req, "status")) fail("status is required");
  const status = requireEnum(located.req.status, "status", ["REQUEST_RELEASE"]);
  return browserbaseRequest(`/v1/sessions/${encodeURIComponent(located.id)}`, "POST", { status });
}
