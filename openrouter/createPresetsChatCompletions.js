/**
 * @description Create a preset from a chat-completions request body. POST /api/v1/presets/{slug}/chat/completions. `stream: true` is rejected.
 * @param {Object} input
 * @param {string} input.slug
 * @param {Object} [input.cache_control]
 * @param {Object} [input.debug]
 * @param {number|null} [input.frequency_penalty]
 * @param {Object} [input.image_config]
 * @param {Object|null} [input.logit_bias]
 * @param {boolean|null} [input.logprobs]
 * @param {number|null} [input.max_completion_tokens]
 * @param {number|null} [input.max_tokens]
 * @param {Array} input.messages
 * @param {Object} [input.metadata]
 * @param {number|null} [input.min_p]
 * @param {string[]} [input.modalities]
 * @param {string} [input.model]
 * @param {string[]} [input.models]
 * @param {boolean|null} [input.parallel_tool_calls]
 * @param {Array} [input.plugins]
 * @param {Object|null} [input.prediction]
 * @param {number|null} [input.presence_penalty]
 * @param {string|null} [input.prompt_cache_key]
 * @param {Object|null} [input.prompt_cache_options]
 * @param {Object|null} [input.provider]
 * @param {Object} [input.reasoning]
 * @param {string|null} [input.reasoning_effort]
 * @param {number|null} [input.repetition_penalty]
 * @param {Object} [input.response_format]
 * @param {string|null} [input.route]
 * @param {number|null} [input.seed]
 * @param {string|null} [input.service_tier]
 * @param {string} [input.session_id]
 * @param {string|string[]|null} [input.stop]
 * @param {Array} [input.stop_server_tools_when]
 * @param {boolean} [input.stream]
 * @param {Object|null} [input.stream_options]
 * @param {number|null} [input.temperature]
 * @param {string|Object} [input.tool_choice]
 * @param {Array} [input.tools]
 * @param {number|null} [input.top_a]
 * @param {number|null} [input.top_k]
 * @param {number|null} [input.top_logprobs]
 * @param {number|null} [input.top_p]
 * @param {Object} [input.trace]
 * @param {string} [input.user]
 * @returns {Object} OpenRouter response body
 * @throws {Error} OPENROUTER_INVALID_INPUT: <reason>
 * @throws {Error} OPENROUTER_REQUEST_FAILED: <status> <message>
 * @see https://openrouter.ai/docs/api/api-reference/presets/create-a-preset-from-a-chat-completions-request-body
 */
async function createPresetsChatCompletions(input) {
  return openrouterOperation(input, {
  "method": "POST",
  "path": "/presets/{slug}/chat/completions",
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
      "required": true
    }
  ]
});
}
