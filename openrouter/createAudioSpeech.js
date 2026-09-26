/**
 * @description Create speech. POST /api/v1/audio/speech. The success body is response text.
 * @param {Object} input
 * @param {string} input.input
 * @param {Array} [input.input_references]
 * @param {string} input.model
 * @param {Object} [input.provider]
 * @param {string} [input.response_format]
 * @param {string} [input.session_id]
 * @param {number} [input.speed]
 * @param {Object} [input.trace]
 * @param {string} [input.user]
 * @param {string} [input.voice]
 * @returns {string} OpenRouter response body
 * @throws {Error} OPENROUTER_INVALID_INPUT: <reason>
 * @throws {Error} OPENROUTER_REQUEST_FAILED: <status> <message>
 * @see https://openrouter.ai/docs/api/api-reference/tts/create-speech
 */
async function createAudioSpeech(input) {
  return openrouterOperation(input, {
  "method": "POST",
  "path": "/audio/speech",
  "accept": "*/*",
  "encoding": "json",
  "required": [
    {
      "name": "input",
      "type": "string",
      "required": true
    },
    {
      "name": "model",
      "type": "string",
      "required": true
    }
  ]
});
}
