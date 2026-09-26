/**
 * @description List all embeddings models. GET /api/v1/embeddings/models.
 * @param {Object} [input]
 * @param {number|null} [input.offset]
 * @param {number} [input.limit]
 * @returns {Object} OpenRouter response body
 * @throws {Error} OPENROUTER_INVALID_INPUT: <reason>
 * @throws {Error} OPENROUTER_REQUEST_FAILED: <status> <message>
 * @see https://openrouter.ai/docs/api/api-reference/embeddings/list-all-embeddings-models
 */
async function listEmbeddingsModels(input) {
  return openrouterOperation(input, {
  "method": "GET",
  "path": "/embeddings/models",
  "optionalInput": true,
  "query": [
    {
      "name": "offset",
      "type": "integer",
      "nullable": true
    },
    {
      "name": "limit",
      "type": "integer"
    }
  ]
});
}
