/**
 * @description List email accounts for the authenticated workspace.
 * @returns {Object}
 */
async function listEmailAccounts() {
  return runAuthed("/api/v1/email-accounts", "GET", undefined, "EMAIL_ACCOUNTS", "EMAIL_ACCOUNTS_FAILED");
}
