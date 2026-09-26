/**
 * @description Get an intern. GET /api/v1/interns/{internId}.
 * @param {Object} input
 * @param {string} input.internId
 * @returns {Object} OpenRouter response body
 * @throws {Error} OPENROUTER_INVALID_INPUT: <reason>
 * @throws {Error} OPENROUTER_REQUEST_FAILED: <status> <message>
 * @see https://openrouter.ai/docs/api/api-reference/interns/get-an-intern
 */
async function getIntern(input) {
  return openrouterOperation(input, {
  "method": "GET",
  "path": "/interns/{internId}",
  "pathParams": [
    {
      "name": "internId",
      "type": "string",
      "required": true
    }
  ]
});
}
