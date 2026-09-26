/**
 * @description Update an intern. PATCH /api/v1/interns/{internId}.
 * @param {Object} input
 * @param {string} input.internId
 * @param {string|null} [input.description]
 * @param {string|null} [input.instructions]
 * @param {string|null} [input.model]
 * @param {string} [input.name]
 * @returns {Object} OpenRouter response body
 * @throws {Error} OPENROUTER_INVALID_INPUT: <reason>
 * @throws {Error} OPENROUTER_REQUEST_FAILED: <status> <message>
 * @see https://openrouter.ai/docs/api/api-reference/interns/update-an-intern
 */
async function updateIntern(input) {
  return openrouterOperation(input, {
  "method": "PATCH",
  "path": "/interns/{internId}",
  "encoding": "json",
  "pathParams": [
    {
      "name": "internId",
      "type": "string",
      "required": true
    }
  ]
});
}
