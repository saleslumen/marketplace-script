/**
 * @description Send a message.
 * @param {Object} input
 * @param {Object} input.body Send request.
 * @param {Object} input.body.message Message to send.
 * @param {string} input.body.message.raw Base64url-encoded RFC 2822 message.
 * @param {string} input.body.message.accountId Sending account address.
 * @param {string} input.body.requestId Idempotency identity.
 * @returns {Object} Sent message.
 * @throws {Error} The Emails service returned status 400 or higher.
 */
async function sendMessage(input) {
  return Emails.sendMessage(input);
}
