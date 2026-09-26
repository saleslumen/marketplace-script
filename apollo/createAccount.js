/**
 * @description Create an account. POST /accounts. https://docs.apollo.io/reference/create-an-account
 * @param {Object} input
 * @param {string} [input.name]
 * @param {string} [input.domain]
 * @param {string} [input.owner_id]
 * @param {string} [input.account_stage_id]
 * @param {string} [input.phone]
 * @param {string} [input.raw_address]
 * @param {Object} [input.typed_custom_fields]
 * @returns {Object} Apollo response body, including account.
 * @throws {Error} APOLLO_INVALID_INPUT when input is not an object or a provided value has the wrong type.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function createAccount(input) {
  const req = requireObject(input);
  const body = pickFields(req, [
    ["name", "string"],
    ["domain", "string"],
    ["owner_id", "string"],
    ["account_stage_id", "string"],
    ["phone", "string"],
    ["raw_address", "string"],
    ["typed_custom_fields", "object"],
  ]);
  return apolloRequest("/accounts", "POST", body);
}
