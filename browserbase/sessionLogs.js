/**
 * @description Session logs. GET /v1/sessions/{id}/logs.
 * @param {Object} input
 * @param {string} input.id
 * @returns {Object[]} session logs
 * @throws {Error} BROWSERBASE_REQUEST_FAILED when id is missing or Browserbase rejects the request
 */
async function sessionLogs(input) {
  const located = requirePathId(input);
  return browserbaseRequest(`/v1/sessions/${encodeURIComponent(located.id)}/logs`, "GET");
}
