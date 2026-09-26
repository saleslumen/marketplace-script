/**
 * @description API health check.
 * @returns {Object}
 * @throws {Error} TRULYINBOX_REQUEST_FAILED: <status> <message>
 */
async function health() {
  return trulyinboxRequest("GET", "/health");
}
