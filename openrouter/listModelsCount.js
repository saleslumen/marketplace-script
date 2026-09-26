/**
 * @description Get total count of available models. GET /api/v1/models/count.
 * @param {Object} [input]
 * @param {string} [input.output_modalities]
 * @returns {Object} OpenRouter response body
 * @throws {Error} OPENROUTER_INVALID_INPUT: <reason>
 * @throws {Error} OPENROUTER_REQUEST_FAILED: <status> <message>
 * @see https://openrouter.ai/docs/api/api-reference/models/get-total-count-of-available-models
 */
async function listModelsCount(input) {
  return openrouterOperation(input, {
  "method": "GET",
  "path": "/models/count",
  "optionalInput": true,
  "query": [
    {
      "name": "output_modalities",
      "type": "string"
    }
  ]
});
}
