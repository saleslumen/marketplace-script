/**
 * @description Update deal. PATCH /opportunities/{opportunity_id}. https://docs.apollo.io/reference/update-deal
 * @param {Object} input
 * @param {string} input.opportunity_id
 * @param {string} [input.owner_id]
 * @param {string} [input.name]
 * @param {string} [input.amount]
 * @param {string} [input.opportunity_stage_id]
 * @param {string} [input.closed_date]
 * @param {Object} [input.typed_custom_fields]
 * @returns {Object} Apollo response body.
 * @throws {Error} APOLLO_INVALID_INPUT when opportunity_id is missing.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function updateDeal(input) {
  const req = requireObject(input);
  const opportunityId = requireString(req, "opportunity_id");
  const body = pickFields(req, [["owner_id", "string"], ["name", "string"], ["amount", "string"], ["opportunity_stage_id", "string"], ["closed_date", "string"], ["typed_custom_fields", "object"]]);
  return apolloRequest(`/opportunities/${encodeURIComponent(opportunityId)}`, "PATCH", body);
}
