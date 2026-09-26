/**
 * @description Create authorization code. POST /api/v1/auth/keys/code.
 * @param {Object} input
 * @param {string} input.callback_url
 * @param {string} [input.code_challenge]
 * @param {string} [input.code_challenge_method]
 * @param {string|null} [input.expires_at]
 * @param {string} [input.key_label]
 * @param {number} [input.limit]
 * @param {string} [input.spawn_agent]
 * @param {string} [input.spawn_cloud]
 * @param {string} [input.usage_limit_type]
 * @param {string} [input.workspace_id]
 * @returns {Object} OpenRouter response body
 * @throws {Error} OPENROUTER_INVALID_INPUT: <reason>
 * @throws {Error} OPENROUTER_REQUEST_FAILED: <status> <message>
 * @see https://openrouter.ai/docs/api/api-reference/oauth/create-authorization-code
 */
async function createAuthKeysCode(input) {
  return openrouterOperation(input, {
  "method": "POST",
  "path": "/auth/keys/code",
  "encoding": "json",
  "required": [
    {
      "name": "callback_url",
      "type": "string",
      "required": true
    }
  ]
});
}
