/**
 * @description Get subscriptions. GET /v2/placement-tests/subscriptions.
 * @param {Object} input
 * @param {string} [input.x-workspace-key]
 * @returns {Object|string} Zapmail response body
 * @throws {Error} ZAPMAIL_INVALID_INPUT: <reason> when a required input is missing or invalid
 * @throws {Error} ZAPMAIL_REQUEST_FAILED: <status> <message> when Zapmail returns a non-2xx status
 */
async function listPlacementTestSubscriptions(input) {
  const req = inputObject(input);
  const workspaceKey = readHeader(req, "x-workspace-key", false);
  return zapmailRequest("/v2/placement-tests/subscriptions", "GET", { workspaceKey });
}
