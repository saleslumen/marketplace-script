/**
 * @description Update dns records. PUT /v2/dns.
 * @param {Object} input
 * @param {string} [input.x-workspace-key]
 * @param {"GOOGLE"|"MICROSOFT"} [input.serviceProvider]
 * @param {string} [input.assignedDomainId]
 * @param {string} [input.host]
 * @param {string} [input.value]
 * @param {string} [input.recordType]
 * @param {string} [input.dnsRecordId]
 * @param {string} [input.zoneId]
 * @returns {Object|string} Zapmail response body
 * @throws {Error} ZAPMAIL_INVALID_INPUT: <reason> when a required input is missing or invalid
 * @throws {Error} ZAPMAIL_REQUEST_FAILED: <status> <message> when Zapmail returns a non-2xx status
 */
async function updateDnsRecords(input) {
  const req = inputObject(input);
  const serviceProvider = readServiceProvider(req, false);
  const workspaceKey = readHeader(req, "x-workspace-key", false);
  const body = omit(req, ["serviceProvider", "x-workspace-key", "x-workspace-id"]);
  return zapmailRequest("/v2/dns", "PUT", { serviceProvider, workspaceKey, body });
}
