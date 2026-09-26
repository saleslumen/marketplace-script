/**
 * PUT /restful/v2/accounts/account_lock
 * @see https://www.dynadot.com/domain/api-document#set_account_lock_status
 * @param {Object} input
 * @param {boolean} input.lock
 * @returns {Promise<Object>}
 */
async function setAccountLockStatus(input) {
  return dynadotRest({
    method: "PUT",
    path: "/accounts/account_lock",
    fields: [
      { name: "lock", in: "body", required: true, type: "boolean" },
    ]
  }, input);
}
