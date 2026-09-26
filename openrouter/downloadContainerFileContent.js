/**
 * @description Download container file content. GET /api/v1/containers/{container_id}/files/{file_id}/content. The success body is response text.
 * @param {Object} input
 * @param {string} input.container_id
 * @param {string} input.file_id
 * @returns {string} OpenRouter response body
 * @throws {Error} OPENROUTER_INVALID_INPUT: <reason>
 * @throws {Error} OPENROUTER_REQUEST_FAILED: <status> <message>
 * @see https://openrouter.ai/docs/api/api-reference/containers/download-container-file-content
 */
async function downloadContainerFileContent(input) {
  return openrouterOperation(input, {
  "method": "GET",
  "path": "/containers/{container_id}/files/{file_id}/content",
  "accept": "*/*",
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
