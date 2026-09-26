/**
 * @description Get current API key. GET /api/v1/key.
 * @param {Object} [input]
 * @returns {Object} OpenRouter response body
 * @throws {Error} OPENROUTER_INVALID_INPUT: <reason>
 * @throws {Error} OPENROUTER_REQUEST_FAILED: <status> <message>
 * @see https://openrouter.ai/docs/api/api-reference/api-keys/get-current-api-key
 */
async function getCurrentKey(input) {
  return openrouterOperation(input, {
  "method": "GET",
  "path": "/key",
  "optionalInput": true
});
}
