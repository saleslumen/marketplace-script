/**
 * @description List versions of a preset. GET /api/v1/presets/{slug}/versions.
 * @param {Object} input
 * @param {string} input.slug
 * @param {number|null} [input.offset]
 * @param {number} [input.limit]
 * @returns {Object} OpenRouter response body
 * @throws {Error} OPENROUTER_INVALID_INPUT: <reason>
 * @throws {Error} OPENROUTER_REQUEST_FAILED: <status> <message>
 * @see https://openrouter.ai/docs/api/api-reference/presets/list-versions-of-a-preset
 */
async function listPresetVersions(input) {
  return openrouterOperation(input, {
  "method": "GET",
  "path": "/presets/{slug}/versions",
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
  ],
  "pathParams": [
    {
      "name": "slug",
      "type": "string",
      "required": true
    }
  ]
});
}
