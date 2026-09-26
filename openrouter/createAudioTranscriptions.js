/**
 * @description Create a transcription. POST /api/v1/audio/transcriptions. Send JSON with `input_audio`, or multipart with `file`. `file` and `input_audio` cannot both be set.
 * @param {Object} input
 * @param {Object} [input.input_audio]
 * @param {string} [input.language]
 * @param {string} input.model
 * @param {Object} [input.provider]
 * @param {string} [input.response_format]
 * @param {string} [input.session_id]
 * @param {number} [input.temperature]
 * @param {string[]} [input.timestamp_granularities]
 * @param {Object} [input.trace]
 * @param {string} [input.user]
 * @param {string} [input.file]
 * @param {string[]} [input.timestamp_granularities[]]
 * @returns {Object} OpenRouter response body
 * @throws {Error} OPENROUTER_INVALID_INPUT: <reason>
 * @throws {Error} OPENROUTER_REQUEST_FAILED: <status> <message>
 * @see https://openrouter.ai/docs/api/api-reference/stt/create-transcription
 */
async function createAudioTranscriptions(input) {
  const req = requireObject(input);
  const hasFile = Object.prototype.hasOwnProperty.call(req, "file") && req.file !== undefined && req.file !== null;
  const hasAudio = Object.prototype.hasOwnProperty.call(req, "input_audio") && req.input_audio !== undefined && req.input_audio !== null;
  if (hasFile && hasAudio) throw invalidInput("file and input_audio cannot both be set");
  if (!hasFile && !hasAudio) throw invalidInput("input_audio or file is required");
  if (hasFile) return openrouterOperation(input, {
  "method": "POST",
  "path": "/audio/transcriptions",
  "encoding": "multipart",
  "required": [
    {
      "name": "file",
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
  return openrouterOperation(input, {
  "method": "POST",
  "path": "/audio/transcriptions",
  "encoding": "json",
  "required": [
    {
      "name": "input_audio",
      "type": "object",
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
