/**
 * @description List all video generation models. GET /api/v1/videos/models.
 * @param {Object} [input]
 * @returns {Object} OpenRouter response body
 * @throws {Error} OPENROUTER_INVALID_INPUT: <reason>
 * @throws {Error} OPENROUTER_REQUEST_FAILED: <status> <message>
 * @see https://openrouter.ai/docs/api/api-reference/video-generation/list-all-video-generation-models
 */
async function listVideosModels(input) {
  return openrouterOperation(input, {
  "method": "GET",
  "path": "/videos/models",
  "optionalInput": true
});
}
