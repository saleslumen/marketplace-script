/**
 * @description Purchase Placement Test. POST /v2/placement-tests/purchase.
 * @param {Object} input
 * @param {string} [input.x-workspace-key]
 * @param {"GOOGLE"|"MICROSOFT"} [input.serviceProvider]
 * @param {string} input.placementType
 * @param {string} input.testName
 * @param {Array} input.mailboxIds
 * @param {Array} input.seedAccounts
 * @returns {Object|string} Zapmail response body
 * @throws {Error} ZAPMAIL_INVALID_INPUT: <reason> when a required input is missing or invalid
 * @throws {Error} ZAPMAIL_REQUEST_FAILED: <status> <message> when Zapmail returns a non-2xx status
 */
async function purchasePlacementTest(input) {
  const req = inputObject(input);
  const serviceProvider = readServiceProvider(req, false);
  const workspaceKey = readHeader(req, "x-workspace-key", false);
  requireField(req, "placementType", "string");
  requireField(req, "testName", "string");
  requireField(req, "mailboxIds", "array");
  requireField(req, "seedAccounts", "array");
  const body = omit(req, ["serviceProvider", "x-workspace-key", "x-workspace-id"]);
  return zapmailRequest("/v2/placement-tests/purchase", "POST", { serviceProvider, workspaceKey, body });
}
