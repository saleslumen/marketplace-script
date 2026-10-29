/**
 * @description API health check. Unauthenticated. Returns the TrulyInbox response body.
 * @returns {Object}
 * @throws {Error} TRULYINBOX_REQUEST_FAILED: <status> <message>
 */
async function health() {
  return trulyinboxRequest("GET", "/v2/health", undefined, false);
}
