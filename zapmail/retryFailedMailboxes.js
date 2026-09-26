/**
 * @description retry creation of failed mailboxes. PUT /v2/mailboxes/retry-failed.
 * @param {Object} input
 * @param {"GOOGLE"|"MICROSOFT"} input.serviceProvider
 * @param {Array} input.domainIds
 * @returns {Object|string} Zapmail response body
 * @throws {Error} ZAPMAIL_INVALID_INPUT: <reason> when a required input is missing or invalid
 * @throws {Error} ZAPMAIL_REQUEST_FAILED: <status> <message> when Zapmail returns a non-2xx status
 */
async function retryFailedMailboxes(input) {
  const req = inputObject(input);
  const serviceProvider = readServiceProvider(req, true);
  requireField(req, "domainIds", "array");
  const body = omit(req, ["serviceProvider", "x-workspace-key", "x-workspace-id"]);
  return zapmailRequest("/v2/mailboxes/retry-failed", "PUT", { serviceProvider, body });
}
