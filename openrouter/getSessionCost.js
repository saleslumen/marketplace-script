/**
 * @description Cost per session by harness and model. GET /api/v1/datasets/session-cost.
 * @param {Object} [input]
 * @param {string} [input.app_slug]
 * @param {string} [input.model]
 * @param {string} [input.turn_range]
 * @param {number} [input.limit]
 * @param {number|null} [input.offset]
 * @returns {Object} OpenRouter response body
 * @throws {Error} OPENROUTER_INVALID_INPUT: <reason>
 * @throws {Error} OPENROUTER_REQUEST_FAILED: <status> <message>
 * @see https://openrouter.ai/docs/api/api-reference/datasets/cost-per-session-by-harness-and-model
 */
async function getSessionCost(input) {
  return openrouterOperation(input, {
  "method": "GET",
  "path": "/datasets/session-cost",
  "optionalInput": true,
  "query": [
    {
      "name": "app_slug",
      "type": "string"
    },
    {
      "name": "model",
      "type": "string"
    },
    {
      "name": "turn_range",
      "type": "string"
    },
    {
      "name": "limit",
      "type": "integer"
    },
    {
      "name": "offset",
      "type": "integer",
      "nullable": true
    }
  ]
});
}
