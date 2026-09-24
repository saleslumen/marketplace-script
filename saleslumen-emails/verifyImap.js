/**
 * @description Test an IMAP connection.
 * @param {Object} input
 * @param {Object} input.body IMAP connection.
 * @param {string} input.body.server_host IMAP host.
 * @param {number} input.body.port IMAP port.
 * @param {string} input.body.username Login username.
 * @param {string} input.body.password Login password.
 * @returns {Object} IMAP probe result.
 * @throws {Error} The Emails service returned status 400 or higher.
 */
async function verifyImap(input) {
  return Emails.verifyImap(input);
}
