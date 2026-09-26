/**
 * @description Submit a Decisions request. POST https://openrouter.ai/api/alpha/decisions.
 * @param {Object} input
 * @param {string} input.model
 * @param {Object|null} [input.provider]
 * @param {Object} input.questions
 * @param {string} [input.session_id]
 * @param {string|Object|Array} input.state
 * @param {Object} [input.trace]
 * @param {string} [input.user]
 * @returns {Object} OpenRouter response body
 * @throws {Error} OPENROUTER_INVALID_INPUT: <reason>
 * @throws {Error} OPENROUTER_REQUEST_FAILED: <status> <message>
 * @see https://openrouter.ai/docs/api/api-reference/alphadecisions/submit-a-decisions-request
 */
async function submitDecisionsRequest(input) {
  return openrouterOperation(input, {
  "method": "POST",
  "path": "/api/alpha/decisions",
  "origin": "https://openrouter.ai",
  "encoding": "json",
  "required": [
    {
      "name": "model",
      "type": "string",
      "required": true
    },
    {
      "name": "questions",
      "type": "object",
      "required": true
    },
    {
      "name": "state",
      "type": "string|object|array",
      "required": true
    }
  ]
});
}
