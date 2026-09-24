/**
 * @description Discover an email for a person at a domain.
 * @param {Object} [input]
 * @param {string} [input.domain] Target domain.
 * @param {string} [input.name] Person name.
 * @returns {Object} Discovery result.
 * @throws {Error} The Emails service returned status 400 or higher.
 */
async function findEmails(input) {
  return Emails.findEmails(input);
}
