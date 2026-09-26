/**
 * @description Deprecated. schedule mailbox creation. POST /v2/mailboxes/schedule. The JSON body is a map of domain id to mailbox arrays.
 * @param {Object} input
 * @param {"GOOGLE"|"MICROSOFT"} input.serviceProvider
 * @returns {Object|string} Zapmail response body
 * @throws {Error} ZAPMAIL_INVALID_INPUT: <reason> when a required input is missing or invalid
 * @throws {Error} ZAPMAIL_REQUEST_FAILED: <status> <message> when Zapmail returns a non-2xx status
 */
async function scheduleMailboxCreation(input) {
  const req = inputObject(input);
  const serviceProvider = readServiceProvider(req, true);
  const body = omit(req, ["serviceProvider", "x-workspace-key", "x-workspace-id"]);
  return zapmailRequest("/v2/mailboxes/schedule", "POST", { serviceProvider, body });
}
