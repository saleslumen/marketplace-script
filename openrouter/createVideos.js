/**
 * @description Submit a video generation request. POST /api/v1/videos.
 * @param {Object} input
 * @param {string} [input.aspect_ratio]
 * @param {string} [input.callback_url]
 * @param {number} [input.creativity]
 * @param {number} [input.duration]
 * @param {Array} [input.frame_images]
 * @param {boolean} [input.generate_audio]
 * @param {Array} [input.input_references]
 * @param {string} input.model
 * @param {string} [input.previous_job_id]
 * @param {string} [input.prompt]
 * @param {Object} [input.provider]
 * @param {string} [input.resolution]
 * @param {number} [input.seed]
 * @param {string} [input.session_id]
 * @param {string} [input.size]
 * @param {Object} [input.trace]
 * @param {number} [input.upscale_factor]
 * @param {string} [input.user]
 * @returns {Object} OpenRouter response body
 * @throws {Error} OPENROUTER_INVALID_INPUT: <reason>
 * @throws {Error} OPENROUTER_REQUEST_FAILED: <status> <message>
 * @see https://openrouter.ai/docs/api/api-reference/video-generation/submit-a-video-generation-request
 */
async function createVideos(input) {
  return openrouterOperation(input, {
  "method": "POST",
  "path": "/videos",
  "encoding": "json",
  "required": [
    {
      "name": "model",
      "type": "string",
      "required": true
    }
  ]
});
}
