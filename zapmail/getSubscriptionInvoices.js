/**
 * @description get invoices for subscription. POST /v2/payment/invoices.
 * @param {Object} input
 * @param {string} input.subscriptionId
 * @returns {Object|string} Zapmail response body
 * @throws {Error} ZAPMAIL_INVALID_INPUT: <reason> when a required input is missing or invalid
 * @throws {Error} ZAPMAIL_REQUEST_FAILED: <status> <message> when Zapmail returns a non-2xx status
 */
async function getSubscriptionInvoices(input) {
  const req = inputObject(input);
  requireField(req, "subscriptionId", "string");
  const body = omit(req, ["serviceProvider", "x-workspace-key", "x-workspace-id"]);
  return zapmailRequest("/v2/payment/invoices", "POST", { body });
}
