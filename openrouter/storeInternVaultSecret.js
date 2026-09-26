/**
 * @description Store an intern secret. PUT /api/v1/vault/interns/{internId}/secrets/{name}.
 * @param {Object} input
 * @param {string} input.internId
 * @param {string} input.name
 * @param {string[]} input.hosts
 * @param {string} input.value
 * @returns {Object} OpenRouter response body
 * @throws {Error} OPENROUTER_INVALID_INPUT: <reason>
 * @throws {Error} OPENROUTER_REQUEST_FAILED: <status> <message>
 * @see https://openrouter.ai/docs/api/api-reference/vault/store-an-intern-secret
 */
async function storeInternVaultSecret(input) {
  return openrouterOperation(input, {
  "method": "PUT",
  "path": "/vault/interns/{internId}/secrets/{name}",
  "encoding": "json",
  "pathParams": [
    {
      "name": "internId",
      "type": "string",
      "required": true
    },
    {
      "name": "name",
      "type": "string",
      "required": true
    }
  ],
  "required": [
    {
      "name": "hosts",
      "type": "string-array",
      "required": true
    },
    {
      "name": "value",
      "type": "string",
      "required": true
    }
  ]
});
}
