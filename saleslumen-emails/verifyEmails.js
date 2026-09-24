/**
 * @description Verify email addresses.
 * @param {Object} input
 * @param {Object} input.body Verification request.
 * @param {string[]} input.body.emails Addresses to verify.
 * @param {string[]} input.body.features Verification features: STANDARD, CATCH_ALL, or both.
 * @returns {string} Verification stream.
 * @throws {Error} The Emails service returned status 400 or higher.
 */
async function verifyEmails(input) {
  return Emails.verifyEmails(input);
}
