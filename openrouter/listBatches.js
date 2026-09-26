/**
 * @description List batches. GET /api/v1/batches.
 * @param {Object} [input]
 * @param {number} [input.limit]
 * @param {string} [input.after]
 * @param {string[]} [input.status]
 * @param {string} [input.created_after]
 * @param {string} [input.created_before]
 * @returns {Object} OpenRouter response body
 * @throws {Error} OPENROUTER_INVALID_INPUT: <reason>
 * @throws {Error} OPENROUTER_REQUEST_FAILED: <status> <message>
 * @see https://openrouter.ai/docs/api/api-reference/batch/list-batches
 */
async function listBatches(input) {
  return openrouterOperation(input, {
  "method": "GET",
  "path": "/batches",
  "optionalInput": true,
  "query": [
    {
      "name": "limit",
      "type": "integer"
    },
    {
      "name": "after",
      "type": "string"
    },
    {
      "name": "status",
      "type": "string-array"
    },
    {
      "name": "created_after",
      "type": "string"
    },
    {
      "name": "created_before",
      "type": "string"
    }
  ]
});
}
