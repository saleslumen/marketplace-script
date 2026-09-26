/**
 * @description List endpoints for an image model. GET /api/v1/images/models/{author}/{slug}/endpoints.
 * @param {Object} input
 * @param {string} input.author
 * @param {string} input.slug
 * @returns {Object} OpenRouter response body
 * @throws {Error} OPENROUTER_INVALID_INPUT: <reason>
 * @throws {Error} OPENROUTER_REQUEST_FAILED: <status> <message>
 * @see https://openrouter.ai/docs/api/api-reference/images/list-endpoints-for-an-image-model
 */
async function listImageModelEndpoints(input) {
  return openrouterOperation(input, {
  "method": "GET",
  "path": "/images/models/{author}/{slug}/endpoints",
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
