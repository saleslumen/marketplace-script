/**
 * @description Create deal. POST /opportunities. https://docs.apollo.io/reference/create-deal
 * @param {Object} input
 * @param {string} input.name
 * @param {string} [input.owner_id]
 * @param {string} [input.account_id]
 * @param {string} [input.amount]
 * @param {string} [input.opportunity_stage_id]
 * @param {string} [input.closed_date]
 * @param {Object} [input.typed_custom_fields]
 * @returns {Object} Apollo response body.
 * @throws {Error} APOLLO_INVALID_INPUT when name is missing.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function createDeal(input) {
  const req = requireObject(input);
  const body = { name: requireString(req, "name") };
  Object.assign(body, pickFields(req, [["owner_id", "string"], ["account_id", "string"], ["amount", "string"], ["opportunity_stage_id", "string"], ["closed_date", "string"], ["typed_custom_fields", "object"]]));
  return apolloRequest("/opportunities", "POST", body);
}
