/**
 * @description Create a preset from a responses request body. POST /api/v1/presets/{slug}/responses. `stream: true` is rejected.
 * @param {Object} input
 * @param {string} input.slug
 * @param {boolean|null} [input.background]
 * @param {Object} [input.cache_control]
 * @param {Object} [input.debug]
 * @param {number|null} [input.frequency_penalty]
 * @param {Object} [input.image_config]
 * @param {string[]|null} [input.include]
 * @param {string|Array} [input.input]
 * @param {string|null} [input.instructions]
 * @param {number|null} [input.max_output_tokens]
 * @param {number|null} [input.max_tool_calls]
 * @param {Object|null} [input.metadata]
 * @param {string[]} [input.modalities]
 * @param {string} [input.model]
 * @param {string[]} [input.models]
 * @param {boolean|null} [input.parallel_tool_calls]
 * @param {Array} [input.plugins]
 * @param {number|null} [input.presence_penalty]
 * @param {*} [input.previous_response_id]
 * @param {Object|null} [input.prompt]
 * @param {string|null} [input.prompt_cache_key]
 * @param {Object|null} [input.prompt_cache_options]
 * @param {Object|null} [input.provider]
 * @param {Object|null} [input.reasoning]
 * @param {string|null} [input.route]
 * @param {string|null} [input.safety_identifier]
 * @param {string|null} [input.service_tier]
 * @param {string} [input.session_id]
 * @param {Array} [input.stop_server_tools_when]
 * @param {boolean} [input.store]
 * @param {boolean} [input.stream]
 * @param {number|null} [input.temperature]
 * @param {Object} [input.text]
 * @param {string|Object} [input.tool_choice]
 * @param {Array} [input.tools]
 * @param {number} [input.top_k]
 * @param {number|null} [input.top_logprobs]
 * @param {number|null} [input.top_p]
 * @param {Object} [input.trace]
 * @param {string|null} [input.truncation]
 * @param {string} [input.user]
 * @returns {Object} OpenRouter response body
 * @throws {Error} OPENROUTER_INVALID_INPUT: <reason>
 * @throws {Error} OPENROUTER_REQUEST_FAILED: <status> <message>
 * @see https://openrouter.ai/docs/api/api-reference/presets/create-a-preset-from-a-responses-request-body
 */
async function createPresetsResponses(input) {
  return openrouterOperation(input, {
  "method": "POST",
  "path": "/presets/{slug}/responses",
  "rejectStream": true,
  "encoding": "json",
  "pathParams": [
    {
      "name": "slug",
      "type": "string",
      "required": true
    }
  ]
});
}
