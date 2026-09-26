/**
 * @description Bulk create accounts. POST /accounts/bulk_create. https://docs.apollo.io/reference/bulk-create-accounts
 * @param {Object} input
 * @param {Object[]} input.accounts 1 to 100 accounts.
 * @param {string[]} [input.append_label_names]
 * @param {boolean} [input.run_dedupe]
 * @returns {Object} Apollo response body.
 * @throws {Error} APOLLO_INVALID_INPUT when accounts is missing or longer than 100.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function bulkCreateAccounts(input) {
  const req = requireObject(input);
  const body = { accounts: requireObjectArray(req.accounts, "accounts", 1, 100) };
  if (req.append_label_names !== undefined) body.append_label_names = checkValue("append_label_names", req.append_label_names, "string[]");
  if (req.run_dedupe !== undefined) body.run_dedupe = checkValue("run_dedupe", req.run_dedupe, "boolean");
  return apolloRequest("/accounts/bulk_create", "POST", body);
}
