/**
 * @description Check SPF, DKIM, DMARC, and MX for one email account.
 * @param {Object} input
 * @param {number} input.emailAccountId
 * @returns {Object}
 * @throws {Error} TRULYINBOX_INVALID_INPUT: <reason>
 * @throws {Error} TRULYINBOX_REQUEST_FAILED: <status> <message>
 */
async function getDnsHealth(input) {
  const req = requireObjectInput(input);
  const emailAccountId = readRequired(req, "emailAccountId", "emailAccountId", "number");
  return trulyinboxRequest("GET", `/dns-health/${encodeURIComponent(emailAccountId)}`);
}
