/**
 * @description Promote a container file into workspace documents. POST /api/v1/containers/{container_id}/files/{file_id}/promote.
 * @param {Object} input
 * @param {string} input.container_id
 * @param {string} input.file_id
 * @returns {Object} OpenRouter response body
 * @throws {Error} OPENROUTER_INVALID_INPUT: <reason>
 * @throws {Error} OPENROUTER_REQUEST_FAILED: <status> <message>
 * @see https://openrouter.ai/docs/api/api-reference/containers/promote-a-container-file-into-workspace-documents
 */
async function promoteContainerFile(input) {
  return openrouterOperation(input, {
  "method": "POST",
  "path": "/containers/{container_id}/files/{file_id}/promote",
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
