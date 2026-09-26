/**
 * @description Get Mailboxes in a Subscription. POST /v2/subscriptions/mailboxes.
 * @param {Object} input
 * @param {"GOOGLE"|"MICROSOFT"} [input.serviceProvider]
 * @param {string} input.subscriptionId
 * @returns {Object|string} Zapmail response body
 * @throws {Error} ZAPMAIL_INVALID_INPUT: <reason> when a required input is missing or invalid
 * @throws {Error} ZAPMAIL_REQUEST_FAILED: <status> <message> when Zapmail returns a non-2xx status
 */
async function listSubscriptionMailboxes(input) {
  const req = inputObject(input);
  const serviceProvider = readServiceProvider(req, false);
  requireField(req, "subscriptionId", "string");
  const body = omit(req, ["serviceProvider", "x-workspace-key", "x-workspace-id"]);
  return zapmailRequest("/v2/subscriptions/mailboxes", "POST", { serviceProvider, body });
}
