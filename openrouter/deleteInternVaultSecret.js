/**
 * @description Delete an intern secret. DELETE /api/v1/vault/interns/{internId}/secrets/{name}. An empty success body is returned as {}.
 * @param {Object} input
 * @param {string} input.internId
 * @param {string} input.name
 * @returns {Object} OpenRouter response body
 * @throws {Error} OPENROUTER_INVALID_INPUT: <reason>
 * @throws {Error} OPENROUTER_REQUEST_FAILED: <status> <message>
 * @see https://openrouter.ai/docs/api/api-reference/vault/delete-an-intern-secret
 */
async function deleteInternVaultSecret(input) {
  return openrouterOperation(input, {
  "method": "DELETE",
  "path": "/vault/interns/{internId}/secrets/{name}",
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
  ]
});
}
