/**
 * @description Get one email account by id.
 * @param {Object} input
 * @returns {Object}
 */
async function getEmailAccount(input) {
  const req = input && typeof input === "object" ? input : {};
  const id = asString(firstPresent(req, ["id", "emailAccountId", "email_account_id", "uuid"]));
  if (!id) return missingInput("id");
  let path = "/api/v1/email-accounts/{id}";
  path = path.replace("{id}", encodeURIComponent(id));
  return runAuthed(path, "GET", undefined, "EMAIL_ACCOUNT", "EMAIL_ACCOUNT_FAILED");
}
