/**
 * @description Bulk update accounts. POST /accounts/bulk_update. https://docs.apollo.io/reference/bulk-update-accounts
 * @param {Object} input
 * @param {string[]} [input.account_ids]
 * @param {Object[]} [input.account_attributes] Each object requires id.
 * @param {string} [input.name]
 * @param {string} [input.owner_id]
 * @param {string} [input.account_stage_id]
 * @param {boolean} [input.async] Not supported with account_attributes.
 * @returns {Object} Apollo response body.
 * @throws {Error} APOLLO_INVALID_INPUT when account_ids and account_attributes are both missing, or async is set with account_attributes.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function bulkUpdateAccounts(input) {
  const req = requireObject(input);
  const idsPresent = req.account_ids !== undefined;
  const attributesPresent = req.account_attributes !== undefined;
  if (!idsPresent && !attributesPresent) invalid("account_ids or account_attributes is required");
  if (req.async === true && attributesPresent) invalid("async is not supported with account_attributes");
  const body = {};
  if (idsPresent) {
    const accountIds = checkValue("account_ids", req.account_ids, "string[]");
    if (!accountIds.length) invalid("account_ids is required");
    body.account_ids = accountIds;
  }
  if (attributesPresent) body.account_attributes = requireIdObjects(req.account_attributes, "account_attributes");
  const rest = pickFields(req, [["name", "string"], ["owner_id", "string"], ["account_stage_id", "string"], ["async", "boolean"]]);
  Object.assign(body, rest);
  return apolloRequest("/accounts/bulk_update", "POST", body);
}
