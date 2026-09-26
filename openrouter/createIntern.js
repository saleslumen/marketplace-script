/**
 * @description Create an intern. POST /api/v1/interns.
 * @param {Object} input
 * @param {string} [input.Idempotency-Key]
 * @param {string|null} [input.description]
 * @param {string|null} [input.instructions]
 * @param {string} input.name
 * @param {boolean} [input.provision]
 * @param {string} [input.vault_id]
 * @param {string} [input.workspace_id]
 * @returns {Object} OpenRouter response body
 * @throws {Error} OPENROUTER_INVALID_INPUT: <reason>
 * @throws {Error} OPENROUTER_REQUEST_FAILED: <status> <message>
 * @see https://openrouter.ai/docs/api/api-reference/interns/create-an-intern
 */
async function createIntern(input) {
  return openrouterOperation(input, {
  "method": "POST",
  "path": "/interns",
  "encoding": "json",
  "headers": [
    {
      "name": "Idempotency-Key",
      "type": "string"
    }
  ],
  "required": [
    {
      "name": "name",
      "type": "string",
      "required": true
    }
  ]
});
}
