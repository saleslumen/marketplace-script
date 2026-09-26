/**
 * @description Delete an intern. DELETE /api/v1/interns/{internId}.
 * @param {Object} input
 * @param {string} input.internId
 * @param {boolean} [input.acknowledge_workspace_loss]
 * @returns {Object} OpenRouter response body
 * @throws {Error} OPENROUTER_INVALID_INPUT: <reason>
 * @throws {Error} OPENROUTER_REQUEST_FAILED: <status> <message>
 * @see https://openrouter.ai/docs/api/api-reference/interns/delete-an-intern
 */
async function deleteIntern(input) {
  return openrouterOperation(input, {
  "method": "DELETE",
  "path": "/interns/{internId}",
  "encoding": "json",
  "pathParams": [
    {
      "name": "internId",
      "type": "string",
      "required": true
    }
  ]
});
}
