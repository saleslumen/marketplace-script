/**
 * @description Create an OAuth connection.
 * @param {Object} input
 * @param {Object} input.body Connection request.
 * @param {string} input.body.provider Mailbox provider: google or microsoft.
 * @param {string} [input.body.login_hint] Address forwarded to the provider picker.
 * @returns {Object} OAuth connection.
 * @throws {Error} The Emails service returned status 400 or higher.
 */
async function createOauthConnection(input) {
  return Emails.createOauthConnection(input);
}
