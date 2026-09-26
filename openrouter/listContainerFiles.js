/**
 * @description List container files. GET /api/v1/containers/{container_id}/files.
 * @param {Object} input
 * @param {string} input.container_id
 * @param {number} [input.limit]
 * @param {string} [input.after]
 * @returns {Object} OpenRouter response body
 * @throws {Error} OPENROUTER_INVALID_INPUT: <reason>
 * @throws {Error} OPENROUTER_REQUEST_FAILED: <status> <message>
 * @see https://openrouter.ai/docs/api/api-reference/containers/list-container-files
 */
async function listContainerFiles(input) {
  return openrouterOperation(input, {
  "method": "GET",
  "path": "/containers/{container_id}/files",
  "query": [
    {
      "name": "limit",
      "type": "integer"
    },
    {
      "name": "after",
      "type": "string"
    }
  ],
  "pathParams": [
    {
      "name": "container_id",
      "type": "string",
      "required": true
    }
  ]
});
}
