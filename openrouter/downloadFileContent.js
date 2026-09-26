/**
 * @description Download file content. GET /api/v1/files/{file_id}/content. The success body is response text.
 * @param {Object} input
 * @param {string} input.file_id
 * @param {string} [input.workspace_id]
 * @param {string} [input.provider]
 * @returns {string} OpenRouter response body
 * @throws {Error} OPENROUTER_INVALID_INPUT: <reason>
 * @throws {Error} OPENROUTER_REQUEST_FAILED: <status> <message>
 * @see https://openrouter.ai/docs/api/api-reference/files/download-file-content
 */
async function downloadFileContent(input) {
  return openrouterOperation(input, {
  "method": "GET",
  "path": "/files/{file_id}/content",
  "accept": "*/*",
  "query": [
    {
      "name": "workspace_id",
      "type": "string"
    },
    {
      "name": "provider",
      "type": "string"
    }
  ],
  "pathParams": [
    {
      "name": "file_id",
      "type": "string",
      "required": true
    }
  ]
});
}
