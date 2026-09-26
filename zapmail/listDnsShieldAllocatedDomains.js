/**
 * @description Get Allocated Domains for Subscription. GET /v2/dns-shield/allocated-domains.
 * @param {Object} input
 * @param {string} input.subscriptionId
 * @param {string} [input.x-workspace-key]
 * @param {"GOOGLE"|"MICROSOFT"} [input.serviceProvider]
 * @returns {Object|string} Zapmail response body
 * @throws {Error} ZAPMAIL_INVALID_INPUT: <reason> when a required input is missing or invalid
 * @throws {Error} ZAPMAIL_REQUEST_FAILED: <status> <message> when Zapmail returns a non-2xx status
 */
async function listDnsShieldAllocatedDomains(input) {
  const req = inputObject(input);
  requireField(req, "subscriptionId", "string");
  const serviceProvider = readServiceProvider(req, false);
  const workspaceKey = readHeader(req, "x-workspace-key", false);
  return zapmailRequest(withQuery("/v2/dns-shield/allocated-domains", req, ["subscriptionId"]), "GET", { serviceProvider, workspaceKey });
}
