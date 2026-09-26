/**
 * @description OpenRouter access token signing keys. GET /api/v1/oauth/jwks.
 * @param {Object} [input]
 * @returns {Object} OpenRouter response body
 * @throws {Error} OPENROUTER_INVALID_INPUT: <reason>
 * @throws {Error} OPENROUTER_REQUEST_FAILED: <status> <message>
 * @see https://openrouter.ai/docs/api/api-reference/oauth/openrouter-access-token-signing-keys
 */
async function listOauthJwks(input) {
  return openrouterOperation(input, {
  "method": "GET",
  "path": "/oauth/jwks",
  "optionalInput": true
});
}
