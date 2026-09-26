/**
 * @description Task classification market share. GET /api/v1/classifications/task.
 * @param {Object} [input]
 * @param {string} [input.window]
 * @returns {Object} OpenRouter response body
 * @throws {Error} OPENROUTER_INVALID_INPUT: <reason>
 * @throws {Error} OPENROUTER_REQUEST_FAILED: <status> <message>
 * @see https://openrouter.ai/docs/api/api-reference/classifications/task-classification-market-share
 */
async function getTaskClassifications(input) {
  return openrouterOperation(input, {
  "method": "GET",
  "path": "/classifications/task",
  "optionalInput": true,
  "query": [
    {
      "name": "window",
      "type": "string"
    }
  ]
});
}
