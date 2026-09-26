/**
 * @description List image generation models. GET /api/v1/images/models.
 * @param {Object} [input]
 * @returns {Object} OpenRouter response body
 * @throws {Error} OPENROUTER_INVALID_INPUT: <reason>
 * @throws {Error} OPENROUTER_REQUEST_FAILED: <status> <message>
 * @see https://openrouter.ai/docs/api/api-reference/images/list-image-generation-models
 */
async function listImageModels(input) {
  return openrouterOperation(input, {
  "method": "GET",
  "path": "/images/models",
  "optionalInput": true
});
}
