/**
 * @description SPF Generator Wizard. POST /api/v1/email-authentication/spf-generator-wizard.
 * @param {Object} input
 * @param {Array} input.providers
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_INVALID_INPUT: providers is required when providers is missing
 * @throws {Error} EMAILGUARD_INVALID_INPUT: providers must be an array when providers is not an array
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function spfGeneratorWizard(input) {
  const req = inputObject(input);
  const body = {};
  body.providers = requireArray(req, "providers");
  return emailguardRequest("/api/v1/email-authentication/spf-generator-wizard", "POST", body);
}
