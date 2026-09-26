/**
 * @description Delete a file. DELETE /api/v1/files/{file_id}.
 * @param {Object} input
 * @param {string} input.file_id
 * @param {string} [input.workspace_id]
 * @param {string} [input.provider]
 * @returns {Object} OpenRouter response body
 * @throws {Error} OPENROUTER_INVALID_INPUT: <reason>
 * @throws {Error} OPENROUTER_REQUEST_FAILED: <status> <message>
 * @see https://openrouter.ai/docs/api/api-reference/files/delete-a-file
 */
async function deleteFile(input) {
  return openrouterOperation(input, {
  "method": "DELETE",
  "path": "/files/{file_id}",
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
