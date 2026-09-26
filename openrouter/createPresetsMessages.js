/**
 * @description Create a preset from a messages request body. POST /api/v1/presets/{slug}/messages. `stream: true` is rejected.
 * @param {Object} input
 * @param {string} input.slug
 * @param {Object} [input.cache_control]
 * @param {Object|null} [input.context_management]
 * @param {Array|null} [input.fallbacks]
 * @param {number} [input.max_tokens]
 * @param {Array|null} input.messages
 * @param {Object} [input.metadata]
 * @param {string} input.model
 * @param {string[]} [input.models]
 * @param {Object} [input.output_config]
 * @param {Array} [input.plugins]
 * @param {Object|null} [input.provider]
 * @param {string|null} [input.route]
 * @param {Array|null} [input.safeguards]
 * @param {string} [input.service_tier]
 * @param {string} [input.session_id]
 * @param {string|null} [input.speed]
 * @param {string[]} [input.stop_sequences]
 * @param {Array} [input.stop_server_tools_when]
 * @param {boolean} [input.stream]
 * @param {string|Array} [input.system]
 * @param {number} [input.temperature]
 * @param {Object} [input.thinking]
 * @param {Object} [input.tool_choice]
 * @param {Array} [input.tools]
 * @param {number} [input.top_k]
 * @param {number} [input.top_p]
 * @param {Object} [input.trace]
 * @param {string} [input.user]
 * @returns {Object} OpenRouter response body
 * @throws {Error} OPENROUTER_INVALID_INPUT: <reason>
 * @throws {Error} OPENROUTER_REQUEST_FAILED: <status> <message>
 * @see https://openrouter.ai/docs/api/api-reference/presets/create-a-preset-from-a-messages-request-body
 */
async function createPresetsMessages(input) {
  return openrouterOperation(input, {
  "method": "POST",
  "path": "/presets/{slug}/messages",
  "rejectStream": true,
  "encoding": "json",
  "pathParams": [
    {
      "name": "slug",
      "type": "string",
      "required": true
    }
  ],
  "required": [
    {
      "name": "messages",
      "type": "array",
      "required": true,
      "nullable": true
    },
    {
      "name": "model",
      "type": "string",
      "required": true
    }
  ]
});
}
