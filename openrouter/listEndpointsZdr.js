/**
 * @description Preview the impact of ZDR on the available endpoints. GET /api/v1/endpoints/zdr.
 * @param {Object} [input]
 * @returns {Object} OpenRouter response body
 * @throws {Error} OPENROUTER_INVALID_INPUT: <reason>
 * @throws {Error} OPENROUTER_REQUEST_FAILED: <status> <message>
 * @see https://openrouter.ai/docs/api/api-reference/endpoints/preview-the-impact-of-zdr-on-the-available-endpoints
 */
async function listEndpointsZdr(input) {
  return openrouterOperation(input, {
  "method": "GET",
  "path": "/endpoints/zdr",
  "optionalInput": true
});
}
