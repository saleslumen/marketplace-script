/**
 * @description Get a specific version of a preset. GET /api/v1/presets/{slug}/versions/{version}.
 * @param {Object} input
 * @param {string} input.slug
 * @param {string} input.version
 * @returns {Object} OpenRouter response body
 * @throws {Error} OPENROUTER_INVALID_INPUT: <reason>
 * @throws {Error} OPENROUTER_REQUEST_FAILED: <status> <message>
 * @see https://openrouter.ai/docs/api/api-reference/presets/get-a-specific-version-of-a-preset
 */
async function getPresetVersion(input) {
  return openrouterOperation(input, {
  "method": "GET",
  "path": "/presets/{slug}/versions/{version}",
  "pathParams": [
    {
      "name": "slug",
      "type": "string",
      "required": true
    },
    {
      "name": "version",
      "type": "string",
      "required": true
    }
  ]
});
}
