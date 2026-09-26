/**
 * @description Search for accounts. POST /accounts/search. https://docs.apollo.io/reference/search-for-accounts
 * @param {Object} input
 * @param {string} [input.q_organization_name]
 * @param {string[]} [input.account_stage_ids]
 * @param {string[]} [input.account_label_ids]
 * @param {string} [input.sort_by_field] account_last_activity_date, account_created_at, or account_updated_at.
 * @param {boolean} [input.sort_ascending]
 * @param {number} [input.page]
 * @param {number} [input.per_page]
 * @returns {Object} Apollo response body, including accounts.
 * @throws {Error} APOLLO_INVALID_INPUT when input is not an object or a provided value has the wrong type.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function searchAccounts(input) {
  const req = requireObject(input);
  const body = pickFields(req, [
    ["q_organization_name", "string"],
    ["account_stage_ids", "string[]"],
    ["account_label_ids", "string[]"],
    ["sort_by_field", "string"],
    ["sort_ascending", "boolean"],
    ["page", "integer"],
    ["per_page", "integer"],
  ]);
  return apolloRequest("/accounts/search", "POST", body);
}
