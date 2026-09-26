/**
 * @description List workspace secrets. GET /api/v1/vault/secrets.
 * @param {Object} [input]
 * @param {number} [input.limit]
 * @param {number} [input.offset]
 * @returns {Object} OpenRouter response body
 * @throws {Error} OPENROUTER_INVALID_INPUT: <reason>
 * @throws {Error} OPENROUTER_REQUEST_FAILED: <status> <message>
 * @see https://openrouter.ai/docs/api/api-reference/vault/list-workspace-secrets
 */
async function listVaultSecrets(input) {
  return openrouterOperation(input, {
  "method": "GET",
  "path": "/vault/secrets",
  "optionalInput": true,
  "query": [
    {
      "name": "limit",
      "type": "integer"
    },
    {
      "name": "offset",
      "type": "integer"
    }
  ]
});
}
