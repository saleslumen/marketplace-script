/**
 * @description List all providers. GET /api/v1/providers.
 * @param {Object} [input]
 * @returns {Object} OpenRouter response body
 * @throws {Error} OPENROUTER_INVALID_INPUT: <reason>
 * @throws {Error} OPENROUTER_REQUEST_FAILED: <status> <message>
 * @see https://openrouter.ai/docs/api/api-reference/providers/list-all-providers
 */
async function listProviders(input) {
  return openrouterOperation(input, {
  "method": "GET",
  "path": "/providers",
  "optionalInput": true
});
}
