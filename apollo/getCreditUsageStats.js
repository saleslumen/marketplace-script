/**
 * @description View credit usage stats. POST /usage_stats/credit_usage_stats. https://docs.apollo.io/reference/view-credit-usage-stats
 * @returns {Object} Apollo response body, including credit_usage_stats.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function getCreditUsageStats() {
  return apolloRequest("/usage_stats/credit_usage_stats", "POST");
}
