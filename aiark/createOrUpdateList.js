/**
 * @description Create or update a list. POST /v1/lists.
 * @param {Object} input
 * @param {string} [input.id] - Existing list id. Omit to create a list.
 * @param {"people_id"|"company_id"} [input.type] - Required when creating.
 * @param {string[]} input.values - At most 10000 ids.
 * @param {"APPEND"|"REPLACE"} [input.mode]
 * @returns {Object} AI Ark response body
 * @throws {Error} AIARK_INVALID_INPUT when a required input is missing or invalid
 * @throws {Error} AIARK_REQUEST_FAILED: <status> <message> when AI Ark rejects the request
 */
async function createOrUpdateList(input) {
  return aiarkRequest("/v1/lists", "POST", requireListBody(input));
}
