/**
 * @description Delete a batch. DELETE /api/v1/batches/{id}.
 * @param {Object} input
 * @param {string} input.id
 * @returns {Object} OpenRouter response body
 * @throws {Error} OPENROUTER_INVALID_INPUT: <reason>
 * @throws {Error} OPENROUTER_REQUEST_FAILED: <status> <message>
 * @see https://openrouter.ai/docs/api/api-reference/batch/delete-a-batch
 */
async function deleteBatch(input) {
  return openrouterOperation(input, {
  "method": "DELETE",
  "path": "/batches/{id}",
  "pathParams": [
    {
      "name": "id",
      "type": "string",
      "required": true
    }
  ]
});
}
