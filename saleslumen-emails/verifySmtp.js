/**
 * @description Test an SMTP connection.
 * @param {Object} input
 * @param {Object} input.body SMTP connection.
 * @param {string} input.body.server_host SMTP host.
 * @param {number} input.body.port SMTP port.
 * @param {string} input.body.username Login username.
 * @param {string} input.body.password Login password.
 * @returns {Object} SMTP probe result.
 * @throws {Error} The Emails service returned status 400 or higher.
 */
async function verifySmtp(input) {
  return Emails.verifySmtp(input);
}
