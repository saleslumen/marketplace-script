/**
 * @description Deprecated. Get Name servers to connect domain. POST /v2/domains/name-servers.
 * @param {Object} input
 * @param {string} [input.domainName]
 * @param {boolean} [input.maskForwarding]
 * @returns {Object|string} Zapmail response body
 * @throws {Error} ZAPMAIL_INVALID_INPUT: <reason> when a required input is missing or invalid
 * @throws {Error} ZAPMAIL_REQUEST_FAILED: <status> <message> when Zapmail returns a non-2xx status
 */
async function getNameServers(input) {
  const req = inputObject(input);
  const body = omit(req, ["serviceProvider", "x-workspace-key", "x-workspace-id"]);
  return zapmailRequest("/v2/domains/name-servers", "POST", { body });
}
