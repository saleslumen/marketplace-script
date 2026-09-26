/**
 * @description Update an account. PATCH /accounts/{account_id}. https://docs.apollo.io/reference/update-an-account
 * @param {Object} input
 * @param {string} input.account_id
 * @param {string} [input.name]
 * @param {string} [input.domain]
 * @param {string} [input.owner_id]
 * @param {string} [input.account_stage_id]
 * @param {string} [input.raw_address]
 * @param {string} [input.phone]
 * @param {Object} [input.typed_custom_fields]
 * @returns {Object} Apollo response body, including account.
 * @throws {Error} APOLLO_INVALID_INPUT when account_id is missing or a provided value has the wrong type.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function updateAccount(input) {
  const req = requireObject(input);
  const accountId = requireString(req, "account_id");
  const body = pickFields(req, [
    ["name", "string"],
    ["domain", "string"],
    ["owner_id", "string"],
    ["account_stage_id", "string"],
    ["raw_address", "string"],
    ["phone", "string"],
    ["typed_custom_fields", "object"],
  ]);
  return apolloRequest(`/accounts/${encodeURIComponent(accountId)}`, "PATCH", body);
}
