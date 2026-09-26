/**
 * @description Get a single-use Microsoft mailbox consent URL.
 * @param {Object} input
 * @param {string} input.email
 * @returns {Object}
 * @throws {Error} TRULYINBOX_INVALID_INPUT: <reason>
 * @throws {Error} TRULYINBOX_REQUEST_FAILED: <status> <message>
 */
async function getMicrosoftSingleConsentUrl(input) {
  const req = requireObjectInput(input);
  const query = trulyinboxQuery({ email: readRequired(req, "email", "email", "string") });
  return trulyinboxRequest("GET", `/email-accounts/microsoft/consent-url${query}`);
}
