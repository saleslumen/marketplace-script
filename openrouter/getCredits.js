/**
 * @description Get remaining credits. GET /api/v1/credits. OpenRouter documents this operation as requiring a management key. This app sends the connected API key.
 * @param {Object} [input]
 * @returns {Object} OpenRouter response body
 * @throws {Error} OPENROUTER_INVALID_INPUT: <reason>
 * @throws {Error} OPENROUTER_REQUEST_FAILED: <status> <message>
 * @see https://openrouter.ai/docs/api/api-reference/credits/get-remaining-credits
 */
async function getCredits(input) {
  return openrouterOperation(input, {
  "method": "GET",
  "path": "/credits",
  "optionalInput": true
});
}
