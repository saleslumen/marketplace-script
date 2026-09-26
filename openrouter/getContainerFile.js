/**
 * @description Retrieve a container file. GET /api/v1/containers/{container_id}/files/{file_id}.
 * @param {Object} input
 * @param {string} input.container_id
 * @param {string} input.file_id
 * @returns {Object} OpenRouter response body
 * @throws {Error} OPENROUTER_INVALID_INPUT: <reason>
 * @throws {Error} OPENROUTER_REQUEST_FAILED: <status> <message>
 * @see https://openrouter.ai/docs/api/api-reference/containers/retrieve-a-container-file
 */
async function getContainerFile(input) {
  return openrouterOperation(input, {
  "method": "GET",
  "path": "/containers/{container_id}/files/{file_id}",
  "pathParams": [
    {
      "name": "container_id",
      "type": "string",
      "required": true
    },
    {
      "name": "file_id",
      "type": "string",
      "required": true
    }
  ]
});
}
