/**
 * @description Get stored prompt, completion, and error content for a generation. GET /api/v1/generation/content.
 * @param {Object} input
 * @param {string} input.id
 * @returns {Object} OpenRouter response body
 * @throws {Error} OPENROUTER_INVALID_INPUT: <reason>
 * @throws {Error} OPENROUTER_REQUEST_FAILED: <status> <message>
 * @see https://openrouter.ai/docs/api/api-reference/generations/get-stored-prompt-completion-and-error-content-for-a-generation
 */
async function listGenerationContent(input) {
  return openrouterOperation(input, {
  "method": "GET",
  "path": "/generation/content",
  "query": [
    {
      "name": "id",
      "type": "string",
      "required": true
    }
  ]
});
}
