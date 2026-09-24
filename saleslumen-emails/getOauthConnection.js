/**
 * @description Get an OAuth connection.
 * @param {Object} input
 * @param {string} input.connection_id Connection id.
 * @returns {Object} OAuth connection.
 * @throws {Error} The Emails service returned status 400 or higher.
 */
async function getOauthConnection(input) {
  return Emails.getOauthConnection(input);
}
