/**
 * @description Daily token totals for top 50 models. GET /api/v1/datasets/rankings-daily.
 * @param {Object} [input]
 * @param {string} [input.start_date]
 * @param {string} [input.end_date]
 * @param {string} [input.period]
 * @param {string} [input.modality]
 * @param {string} [input.context_bucket]
 * @param {string} [input.category]
 * @param {string} [input.language_type]
 * @returns {Object} OpenRouter response body
 * @throws {Error} OPENROUTER_INVALID_INPUT: <reason>
 * @throws {Error} OPENROUTER_REQUEST_FAILED: <status> <message>
 * @see https://openrouter.ai/docs/api/api-reference/datasets/daily-token-totals-for-top-50-models
 */
async function getRankingsDaily(input) {
  return openrouterOperation(input, {
  "method": "GET",
  "path": "/datasets/rankings-daily",
  "optionalInput": true,
  "query": [
    {
      "name": "start_date",
      "type": "string"
    },
    {
      "name": "end_date",
      "type": "string"
    },
    {
      "name": "period",
      "type": "string"
    },
    {
      "name": "modality",
      "type": "string"
    },
    {
      "name": "context_bucket",
      "type": "string"
    },
    {
      "name": "category",
      "type": "string"
    },
    {
      "name": "language_type",
      "type": "string"
    }
  ]
});
}
