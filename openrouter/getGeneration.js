/**
 * @description Get request & usage metadata for a generation. GET /api/v1/generation.
 * @param {Object} input
 * @param {string} input.id
 * @returns {Object} OpenRouter response body
 * @throws {Error} OPENROUTER_INVALID_INPUT: <reason>
 * @throws {Error} OPENROUTER_REQUEST_FAILED: <status> <message>
 * @see https://openrouter.ai/docs/api/api-reference/generations/get-request-&-usage-metadata-for-a-generation
 */
async function getGeneration(input) {
  return openrouterOperation(input, {
  "method": "GET",
  "path": "/generation",
  "query": [
    {
      "name": "id",
      "type": "string",
      "required": true
    }
  ]
});
}
