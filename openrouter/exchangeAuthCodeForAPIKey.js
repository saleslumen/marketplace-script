/**
 * @description Exchange authorization code for API key. POST /api/v1/auth/keys.
 * @param {Object} input
 * @param {string} input.code
 * @param {string|null} [input.code_challenge_method]
 * @param {string} [input.code_verifier]
 * @returns {Object} OpenRouter response body
 * @throws {Error} OPENROUTER_INVALID_INPUT: <reason>
 * @throws {Error} OPENROUTER_REQUEST_FAILED: <status> <message>
 * @see https://openrouter.ai/docs/api/api-reference/oauth/exchange-authorization-code-for-api-key
 */
async function exchangeAuthCodeForAPIKey(input) {
  return openrouterOperation(input, {
  "method": "POST",
  "path": "/auth/keys",
  "encoding": "json",
  "required": [
    {
      "name": "code",
      "type": "string",
      "required": true
    }
  ]
});
}
