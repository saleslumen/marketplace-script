/**
 * @description Get an intern's daemon access. GET /api/v1/interns/{internId}/daemon-access.
 * @param {Object} input
 * @param {string} input.internId
 * @returns {Object} OpenRouter response body
 * @throws {Error} OPENROUTER_INVALID_INPUT: <reason>
 * @throws {Error} OPENROUTER_REQUEST_FAILED: <status> <message>
 * @see https://openrouter.ai/docs/api/api-reference/interns/get-an-interns-daemon-access
 */
async function getInternDaemonAccess(input) {
  return openrouterOperation(input, {
  "method": "GET",
  "path": "/interns/{internId}/daemon-access",
  "pathParams": [
    {
      "name": "internId",
      "type": "string",
      "required": true
    }
  ]
});
}
