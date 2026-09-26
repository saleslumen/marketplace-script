/**
 * @description View API usage stats and rate limits. POST /usage_stats/api_usage_stats. https://docs.apollo.io/reference/view-api-usage-stats
 * @returns {Object} Apollo response body.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function getApiUsageStats() {
  return apolloRequest("/usage_stats/api_usage_stats", "POST");
}
