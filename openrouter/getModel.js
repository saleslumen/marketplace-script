/**
 * @description Get a model by its slug. GET /api/v1/model/{author}/{slug}.
 * @param {Object} input
 * @param {string} input.author
 * @param {string} input.slug
 * @returns {Object} OpenRouter response body
 * @throws {Error} OPENROUTER_INVALID_INPUT: <reason>
 * @throws {Error} OPENROUTER_REQUEST_FAILED: <status> <message>
 * @see https://openrouter.ai/docs/api/api-reference/models/get-a-model-by-its-slug
 */
async function getModel(input) {
  return openrouterOperation(input, {
  "method": "GET",
  "path": "/model/{author}/{slug}",
  "pathParams": [
    {
      "name": "author",
      "type": "string",
      "required": true
    },
    {
      "name": "slug",
      "type": "string",
      "required": true
    }
  ]
});
}
