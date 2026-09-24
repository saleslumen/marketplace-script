/**
 * @description Get a random reputation-builder email account.
 * @returns {Object}
 */
async function getRandomReputationBuilderAccount() {
  return runAuthed("/api/v1/email-accounts/reputation-builder-accounts/random", "GET", undefined, "REPUTATION_BUILDER_ACCOUNT", "REPUTATION_BUILDER_ACCOUNT_FAILED");
}
