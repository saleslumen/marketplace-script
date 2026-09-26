/**
 * @description Deprecated. Verify Name Server Propagation. POST /v2/domains/name-servers/verify.
 * @param {Object} input
 * @param {string} [input.domainName]
 * @returns {Object|string} Zapmail response body
 * @throws {Error} ZAPMAIL_INVALID_INPUT: <reason> when a required input is missing or invalid
 * @throws {Error} ZAPMAIL_REQUEST_FAILED: <status> <message> when Zapmail returns a non-2xx status
 */
async function verifyNameServers(input) {
  const req = inputObject(input);
  const body = omit(req, ["serviceProvider", "x-workspace-key", "x-workspace-id"]);
  return zapmailRequest("/v2/domains/name-servers/verify", "POST", { body });
}
