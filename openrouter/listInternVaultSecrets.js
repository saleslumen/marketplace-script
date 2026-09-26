/**
 * @description List intern secrets. GET /api/v1/vault/interns/{internId}/secrets.
 * @param {Object} input
 * @param {string} input.internId
 * @param {number} [input.limit]
 * @param {number} [input.offset]
 * @returns {Object} OpenRouter response body
 * @throws {Error} OPENROUTER_INVALID_INPUT: <reason>
 * @throws {Error} OPENROUTER_REQUEST_FAILED: <status> <message>
 * @see https://openrouter.ai/docs/api/api-reference/vault/list-intern-secrets
 */
async function listInternVaultSecrets(input) {
  return openrouterOperation(input, {
  "method": "GET",
  "path": "/vault/interns/{internId}/secrets",
  "query": [
    {
      "name": "limit",
      "type": "integer"
    },
    {
      "name": "offset",
      "type": "integer"
    }
  ],
  "pathParams": [
    {
      "name": "internId",
      "type": "string",
      "required": true
    }
  ]
});
}
