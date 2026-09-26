/**
 * @description Copy workspace secrets to an intern. POST /api/v1/vault/interns/{internId}/secrets/copy.
 * @param {Object} input
 * @param {string} input.internId
 * @param {string[]} input.names
 * @returns {Object} OpenRouter response body
 * @throws {Error} OPENROUTER_INVALID_INPUT: <reason>
 * @throws {Error} OPENROUTER_REQUEST_FAILED: <status> <message>
 * @see https://openrouter.ai/docs/api/api-reference/vault/copy-workspace-secrets-to-an-intern
 */
async function copyVaultSecretsToIntern(input) {
  return openrouterOperation(input, {
  "method": "POST",
  "path": "/vault/interns/{internId}/secrets/copy",
  "encoding": "json",
  "pathParams": [
    {
      "name": "internId",
      "type": "string",
      "required": true
    }
  ],
  "required": [
    {
      "name": "names",
      "type": "string-array",
      "required": true
    }
  ]
});
}
