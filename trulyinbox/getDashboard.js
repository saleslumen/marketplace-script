/**
 * @description Get account-wide warmup totals.
 * @returns {Object}
 * @throws {Error} TRULYINBOX_REQUEST_FAILED: <status> <message>
 */
async function getDashboard() {
  return trulyinboxRequest("GET", "/dashboard");
}
