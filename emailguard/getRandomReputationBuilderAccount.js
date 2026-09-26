/**
 * @description Get a random reputation-builder email account. GET /api/v1/email-accounts/reputation-builder-accounts/random.
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function getRandomReputationBuilderAccount() {
  return emailguardRequest("/api/v1/email-accounts/reputation-builder-accounts/random", "GET");
}
