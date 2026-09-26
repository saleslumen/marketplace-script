/**
 * @description Top apps by token usage. GET /api/v1/datasets/app-rankings.
 * @param {Object} [input]
 * @param {string} [input.category]
 * @param {string} [input.subcategory]
 * @param {string} [input.sort]
 * @param {string} [input.start_date]
 * @param {string} [input.end_date]
 * @param {number} [input.limit]
 * @param {number|null} [input.offset]
 * @returns {Object} OpenRouter response body
 * @throws {Error} OPENROUTER_INVALID_INPUT: <reason>
 * @throws {Error} OPENROUTER_REQUEST_FAILED: <status> <message>
 * @see https://openrouter.ai/docs/api/api-reference/datasets/top-apps-by-token-usage
 */
async function getAppRankings(input) {
  return openrouterOperation(input, {
  "method": "GET",
  "path": "/datasets/app-rankings",
  "optionalInput": true,
  "query": [
    {
      "name": "category",
      "type": "string"
    },
    {
      "name": "subcategory",
      "type": "string"
    },
    {
      "name": "sort",
      "type": "string"
    },
    {
      "name": "start_date",
      "type": "string"
    },
    {
      "name": "end_date",
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
