/**
 * @description Delete an IMAP/SMTP email account.
 * @param {Object} input
 * @returns {Object}
 */
async function deleteEmailAccount(input) {
  const req = input && typeof input === "object" ? input : {};
  const email_account_uuid = asString(firstPresent(req, ["email_account_uuid", "emailAccountUuid", "id", "uuid"]));
  if (!email_account_uuid) return missingInput("email_account_uuid");
  let path = "/api/v1/email-accounts/delete/{email_account_uuid}";
  path = path.replace("{email_account_uuid}", encodeURIComponent(email_account_uuid));
  return runAuthed(path, "DELETE", undefined, "EMAIL_ACCOUNT_DELETED", "EMAIL_ACCOUNT_DELETE_FAILED");
}
