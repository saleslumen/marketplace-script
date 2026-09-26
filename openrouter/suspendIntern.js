/**
 * @description Suspend an intern. POST /api/v1/interns/{internId}/suspend.
 * @param {Object} input
 * @param {string} input.internId
 * @returns {Object} OpenRouter response body
 * @throws {Error} OPENROUTER_INVALID_INPUT: <reason>
 * @throws {Error} OPENROUTER_REQUEST_FAILED: <status> <message>
 * @see https://openrouter.ai/docs/api/api-reference/interns/suspend-an-intern
 */
async function suspendIntern(input) {
  return openrouterOperation(input, {
  "method": "POST",
  "path": "/interns/{internId}/suspend",
  "pathParams": [
    {
      "name": "internId",
      "type": "string",
      "required": true
    }
  ]
});
}
