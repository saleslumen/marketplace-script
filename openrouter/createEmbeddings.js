/**
 * @description Submit an embedding request. POST /api/v1/embeddings.
 * @param {Object} input
 * @param {number} [input.dimensions]
 * @param {string} [input.encoding_format]
 * @param {string|string[]} input.input
 * @param {string} [input.input_type]
 * @param {string} input.model
 * @param {Object|null} [input.provider]
 * @param {string} [input.session_id]
 * @param {Object} [input.trace]
 * @param {string} [input.user]
 * @returns {Object} OpenRouter response body
 * @throws {Error} OPENROUTER_INVALID_INPUT: <reason>
 * @throws {Error} OPENROUTER_REQUEST_FAILED: <status> <message>
 * @see https://openrouter.ai/docs/api/api-reference/embeddings/submit-an-embedding-request
 */
async function createEmbeddings(input) {
  return openrouterOperation(input, {
  "method": "POST",
  "path": "/embeddings",
  "encoding": "json",
  "required": [
    {
      "name": "input",
      "type": "string|string-array",
      "required": true
    },
    {
      "name": "model",
      "type": "string",
      "required": true
    }
  ]
});
}
