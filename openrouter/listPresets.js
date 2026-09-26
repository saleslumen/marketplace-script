/**
 * @description List presets. GET /api/v1/presets.
 * @param {Object} [input]
 * @param {number|null} [input.offset]
 * @param {number} [input.limit]
 * @returns {Object} OpenRouter response body
 * @throws {Error} OPENROUTER_INVALID_INPUT: <reason>
 * @throws {Error} OPENROUTER_REQUEST_FAILED: <status> <message>
 * @see https://openrouter.ai/docs/api/api-reference/presets/list-presets
 */
async function listPresets(input) {
  return openrouterOperation(input, {
  "method": "GET",
  "path": "/presets",
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
