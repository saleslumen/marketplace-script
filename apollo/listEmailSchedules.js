/**
 * @description List email schedules. GET /emailer_schedules. https://docs.apollo.io/reference/list-email-schedules
 * @returns {Object} Apollo response body.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function listEmailSchedules() {
  return apolloRequest("/emailer_schedules", "GET");
}
