/**
 * @description Update account owner for multiple accounts. POST /accounts/update_owners. https://docs.apollo.io/reference/update-account-ownership
 * @param {Object} input
 * @param {string[]} input.account_ids[]
 * @param {string} input.owner_id
 * @returns {Object} Apollo response body.
 * @throws {Error} APOLLO_INVALID_INPUT when account_ids[] or owner_id is missing.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function updateAccountOwners(input) {
  const req = requireObject(input);
  requireStringList(req, "account_ids[]");
  requireString(req, "owner_id");
  const query = pickFields(req, [["account_ids[]", "string[]"], ["owner_id", "string"]]);
  return apolloRequest(`/accounts/update_owners${buildQuery(query)}`, "POST");
}
