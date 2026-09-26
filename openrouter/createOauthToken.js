/**
 * @description Exchange a workload identity token. POST /api/v1/oauth/token.
 * @param {Object} input
 * @param {string} input.federation_policy_id
 * @param {string} input.grant_type
 * @param {string} [input.requested_token_type]
 * @param {string} [input.scope]
 * @param {string} input.subject_token
 * @param {string} input.subject_token_type
 * @returns {Object} OpenRouter response body
 * @throws {Error} OPENROUTER_INVALID_INPUT: <reason>
 * @throws {Error} OPENROUTER_REQUEST_FAILED: <status> <message>
 * @see https://openrouter.ai/docs/api/api-reference/oauth/exchange-a-workload-identity-token
 */
async function createOauthToken(input) {
  return openrouterOperation(input, {
  "method": "POST",
  "path": "/oauth/token",
  "encoding": "form",
  "required": [
    {
      "name": "federation_policy_id",
      "type": "string",
      "required": true
    },
    {
      "name": "grant_type",
      "type": "string",
      "required": true
    },
    {
      "name": "subject_token",
      "type": "string",
      "required": true
    },
    {
      "name": "subject_token_type",
      "type": "string",
      "required": true
    }
  ]
});
}
