/**
 * @description Delete a workspace secret. DELETE /api/v1/vault/secrets/{name}. An empty success body is returned as {}.
 * @param {Object} input
 * @param {string} input.name
 * @returns {Object} OpenRouter response body
 * @throws {Error} OPENROUTER_INVALID_INPUT: <reason>
 * @throws {Error} OPENROUTER_REQUEST_FAILED: <status> <message>
 * @see https://openrouter.ai/docs/api/api-reference/vault/delete-a-workspace-secret
 */
async function deleteVaultSecret(input) {
  return openrouterOperation(input, {
  "method": "DELETE",
  "path": "/vault/secrets/{name}",
  "pathParams": [
    {
      "name": "name",
      "type": "string",
      "required": true
    }
  ]
});
}
