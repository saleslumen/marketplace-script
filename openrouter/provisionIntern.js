/**
 * @description Provision an intern. POST /api/v1/interns/{internId}/provision.
 * @param {Object} input
 * @param {string} input.internId
 * @returns {Object} OpenRouter response body
 * @throws {Error} OPENROUTER_INVALID_INPUT: <reason>
 * @throws {Error} OPENROUTER_REQUEST_FAILED: <status> <message>
 * @see https://openrouter.ai/docs/api/api-reference/interns/provision-an-intern
 */
async function provisionIntern(input) {
  return openrouterOperation(input, {
  "method": "POST",
  "path": "/interns/{internId}/provision",
  "pathParams": [
    {
      "name": "internId",
      "type": "string",
      "required": true
    }
  ]
});
}
