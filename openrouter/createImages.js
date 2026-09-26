/**
 * @description Generate an image. POST /api/v1/images. `stream: true` is rejected.
 * @param {Object} input
 * @param {string} [input.aspect_ratio]
 * @param {string} [input.background]
 * @param {Array} [input.input_references]
 * @param {string} input.model
 * @param {number} [input.n]
 * @param {number} [input.output_compression]
 * @param {string} [input.output_format]
 * @param {string} input.prompt
 * @param {Object} [input.provider]
 * @param {string} [input.quality]
 * @param {string} [input.resolution]
 * @param {number} [input.seed]
 * @param {string} [input.session_id]
 * @param {string} [input.size]
 * @param {boolean} [input.stream]
 * @param {Object} [input.trace]
 * @param {string} [input.user]
 * @returns {Object} OpenRouter response body
 * @throws {Error} OPENROUTER_INVALID_INPUT: <reason>
 * @throws {Error} OPENROUTER_REQUEST_FAILED: <status> <message>
 * @see https://openrouter.ai/docs/api/api-reference/images/generate-an-image
 */
async function createImages(input) {
  return openrouterOperation(input, {
  "method": "POST",
  "path": "/images",
  "rejectStream": true,
  "encoding": "json",
  "required": [
    {
      "name": "model",
      "type": "string",
      "required": true
    },
    {
      "name": "prompt",
      "type": "string",
      "required": true
    }
  ]
});
}
