/**
 * @description Upload a file. POST /api/v1/files. `file` is the file contents.
 * @param {Object} input
 * @param {string} [input.workspace_id]
 * @param {string} [input.provider]
 * @param {string} input.file
 * @returns {Object} OpenRouter response body
 * @throws {Error} OPENROUTER_INVALID_INPUT: <reason>
 * @throws {Error} OPENROUTER_REQUEST_FAILED: <status> <message>
 * @see https://openrouter.ai/docs/api/api-reference/files/upload-a-file
 */
async function uploadFile(input) {
  return openrouterOperation(input, {
  "method": "POST",
  "path": "/files",
  "encoding": "multipart",
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
  "required": [
    {
      "name": "file",
      "type": "string",
      "required": true
    }
  ]
});
}
