/**
 * @description List email-account blacklist checks.
 * @returns {Object}
 */
async function listEmailAccountBlacklists() {
  return runAuthed("/api/v1/blacklist-checks/email-accounts", "GET", undefined, "EMAIL_ACCOUNT_BLACKLISTS", "EMAIL_ACCOUNT_BLACKLISTS_FAILED");
}
