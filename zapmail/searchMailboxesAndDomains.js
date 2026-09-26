/**
 * @description Global mailbox-domain search. GET /v2/global/mailbox-domain-search.
 * @param {Object} input
 * @param {string} [input.contains]
 * @param {number} input.page
 * @param {number} input.limit
 * @returns {Object|string} Zapmail response body
 * @throws {Error} ZAPMAIL_INVALID_INPUT: <reason> when a required input is missing or invalid
 * @throws {Error} ZAPMAIL_REQUEST_FAILED: <status> <message> when Zapmail returns a non-2xx status
 */
async function searchMailboxesAndDomains(input) {
  const req = inputObject(input);
  requireField(req, "page", "integer");
  requireField(req, "limit", "integer");
  return zapmailRequest(withQuery("/v2/global/mailbox-domain-search", req, ["contains", "page", "limit"]), "GET");
}
