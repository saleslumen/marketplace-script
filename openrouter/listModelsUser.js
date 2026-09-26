/**
 * @description List models filtered by user provider preferences, privacy settings, and guardrails. GET /api/v1/models/user.
 * @param {Object} [input]
 * @param {number|null} [input.offset]
 * @param {number} [input.limit]
 * @param {string} [input.output_modalities]
 * @returns {Object} OpenRouter response body
 * @throws {Error} OPENROUTER_INVALID_INPUT: <reason>
 * @throws {Error} OPENROUTER_REQUEST_FAILED: <status> <message>
 * @see https://openrouter.ai/docs/api/api-reference/models/list-models-filtered-by-user-provider-preferences-privacy-settings-and-guardrails
 */
async function listModelsUser(input) {
  return openrouterOperation(input, {
  "method": "GET",
  "path": "/models/user",
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
    },
    {
      "name": "output_modalities",
      "type": "string"
    }
  ]
});
}
