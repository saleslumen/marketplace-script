/**
 * @description List interns. GET /api/v1/interns.
 * @param {Object} [input]
 * @param {number} [input.limit]
 * @param {string[]} [input.status]
 * @param {string} [input.starting_after]
 * @param {string} [input.workspace_id]
 * @returns {Object} OpenRouter response body
 * @throws {Error} OPENROUTER_INVALID_INPUT: <reason>
 * @throws {Error} OPENROUTER_REQUEST_FAILED: <status> <message>
 * @see https://openrouter.ai/docs/api/api-reference/interns/list-interns
 */
async function listInterns(input) {
  return openrouterOperation(input, {
  "method": "GET",
  "path": "/interns",
  "optionalInput": true,
  "query": [
    {
      "name": "limit",
      "type": "integer"
    },
    {
      "name": "status",
      "type": "string-array"
    },
    {
      "name": "starting_after",
      "type": "string"
    },
    {
      "name": "workspace_id",
      "type": "string"
    }
  ]
});
}
