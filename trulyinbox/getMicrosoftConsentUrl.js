/**
 * @description Get the Microsoft admin-consent URL for tenant-wide bulk connect.
 * @param {Object} [input]
 * @param {string} [input.domain]
 * @returns {Object}
 * @throws {Error} TRULYINBOX_INVALID_INPUT: <reason>
 * @throws {Error} TRULYINBOX_REQUEST_FAILED: <status> <message>
 */
async function getMicrosoftConsentUrl(input) {
  const req = input === undefined ? {} : requireObjectInput(input);
  const query = trulyinboxQuery({ domain: optionalQueryString(req, "domain") });
  return trulyinboxRequest("GET", `/workspaces/microsoft/consent-url${query}`);
}
