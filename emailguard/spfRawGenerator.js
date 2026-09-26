/**
 * @description SPF Raw Generator. POST /api/v1/email-authentication/spf-raw-generator.
 * @param {Object} input
 * @param {boolean} [input.redirect]
 * @param {string} [input.redirect_url]
 * @param {string} [input.failure_policy]
 * @param {string} [input.tag]
 * @param {string} [input.value]
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_INVALID_INPUT: redirect must be a boolean when redirect is not a boolean
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function spfRawGenerator(input) {
  const req = inputObject(input);
  const body = {};
  const redirect = optionalBoolean(req, "redirect");
  if (redirect !== undefined) body.redirect = redirect;
  const redirect_url = optionalText(req, "redirect_url");
  if (redirect_url !== undefined) body.redirect_url = redirect_url;
  const failure_policy = optionalText(req, "failure_policy");
  if (failure_policy !== undefined) body.failure_policy = failure_policy;
  const tag = optionalText(req, "tag");
  if (tag !== undefined) body.tag = tag;
  const value = optionalText(req, "value");
  if (value !== undefined) body.value = value;
  return emailguardRequest("/api/v1/email-authentication/spf-raw-generator", "POST", body);
}
