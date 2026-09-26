/**
 * @description Submit a rerank request. POST /api/v1/rerank.
 * @param {Object} input
 * @param {Array} input.documents
 * @param {string} input.model
 * @param {Object|null} [input.provider]
 * @param {string} input.query
 * @param {string} [input.session_id]
 * @param {number} [input.top_n]
 * @param {Object} [input.trace]
 * @param {string} [input.user]
 * @returns {Object} OpenRouter response body
 * @throws {Error} OPENROUTER_INVALID_INPUT: <reason>
 * @throws {Error} OPENROUTER_REQUEST_FAILED: <status> <message>
 * @see https://openrouter.ai/docs/api/api-reference/rerank/submit-a-rerank-request
 */
async function createRerank(input) {
  return openrouterOperation(input, {
  "method": "POST",
  "path": "/rerank",
  "encoding": "json",
  "required": [
    {
      "name": "documents",
      "type": "array",
      "required": true
    },
    {
      "name": "model",
      "type": "string",
      "required": true
    },
    {
      "name": "query",
      "type": "string",
      "required": true
    }
  ]
});
}
