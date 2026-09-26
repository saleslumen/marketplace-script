/**
 * @description Return the current rate-limit window.
 * @returns {Object}
 * @throws {Error} TRULYINBOX_REQUEST_FAILED: <status> <message>
 */
async function getRateLimitStatus() {
  return trulyinboxRequest("GET", "/rate-limit");
}
