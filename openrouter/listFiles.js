/**
 * @description List files. GET /api/v1/files.
 * @param {Object} [input]
 * @param {number} [input.limit]
 * @param {string} [input.cursor]
 * @param {string} [input.workspace_id]
 * @param {string} [input.provider]
 * @param {string} [input.after]
 * @param {string} [input.after_id]
 * @param {string} [input.before_id]
 * @param {string} [input.order]
 * @returns {Object} OpenRouter response body
 * @throws {Error} OPENROUTER_INVALID_INPUT: <reason>
 * @throws {Error} OPENROUTER_REQUEST_FAILED: <status> <message>
 * @see https://openrouter.ai/docs/api/api-reference/files/list-files
 */
async function listFiles(input) {
  return openrouterOperation(input, {
  "method": "GET",
  "path": "/files",
  "optionalInput": true,
  "query": [
    {
      "name": "limit",
      "type": "integer"
    },
    {
      "name": "cursor",
      "type": "string"
    },
    {
      "name": "workspace_id",
      "type": "string"
    },
    {
      "name": "provider",
      "type": "string"
    },
    {
      "name": "after",
      "type": "string"
    },
    {
      "name": "after_id",
      "type": "string"
    },
    {
      "name": "before_id",
      "type": "string"
    },
    {
      "name": "order",
      "type": "string"
    }
  ]
});
}
