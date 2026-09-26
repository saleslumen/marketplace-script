/**
 * @description Get a preset. GET /api/v1/presets/{slug}.
 * @param {Object} input
 * @param {string} input.slug
 * @returns {Object} OpenRouter response body
 * @throws {Error} OPENROUTER_INVALID_INPUT: <reason>
 * @throws {Error} OPENROUTER_REQUEST_FAILED: <status> <message>
 * @see https://openrouter.ai/docs/api/api-reference/presets/get-a-preset
 */
async function getPreset(input) {
  return openrouterOperation(input, {
  "method": "GET",
  "path": "/presets/{slug}",
  "pathParams": [
    {
      "name": "slug",
      "type": "string",
      "required": true
    }
  ]
});
}
