/**
 * @description Start an intern run without waiting for it. POST /api/v1/interns/{internId}/invoke.
 * @param {Object} input
 * @param {string} input.internId
 * @param {string} input.input
 * @param {string} [input.session_id]
 * @returns {Object} OpenRouter response body
 * @throws {Error} OPENROUTER_INVALID_INPUT: <reason>
 * @throws {Error} OPENROUTER_REQUEST_FAILED: <status> <message>
 * @see https://openrouter.ai/docs/api/api-reference/interns/start-an-intern-run-without-waiting-for-it
 */
async function invokeIntern(input) {
  return openrouterOperation(input, {
  "method": "POST",
  "path": "/interns/{internId}/invoke",
  "encoding": "json",
  "pathParams": [
    {
      "name": "internId",
      "type": "string",
      "required": true
    }
  ],
  "required": [
    {
      "name": "input",
      "type": "string",
      "required": true
    }
  ]
});
}
