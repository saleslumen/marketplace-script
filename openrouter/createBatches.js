/**
 * @description Create a batch. POST /api/v1/batches.
 * @param {Object} input
 * @param {string} [input.completion_window]
 * @param {string} input.endpoint
 * @param {string} input.model
 * @param {Object|null} [input.provider]
 * @param {Array} input.requests
 * @returns {Object} OpenRouter response body
 * @throws {Error} OPENROUTER_INVALID_INPUT: <reason>
 * @throws {Error} OPENROUTER_REQUEST_FAILED: <status> <message>
 * @see https://openrouter.ai/docs/api/api-reference/batch/create-a-batch
 */
async function createBatches(input) {
  return openrouterOperation(input, {
  "method": "POST",
  "path": "/batches",
  "encoding": "json",
  "required": [
    {
      "name": "endpoint",
      "type": "string",
      "required": true
    },
    {
      "name": "model",
      "type": "string",
      "required": true
    },
    {
      "name": "requests",
      "type": "array",
      "required": true
    }
  ]
});
}
