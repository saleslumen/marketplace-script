/**
 * @description Poll video generation status. GET /api/v1/videos/{jobId}.
 * @param {Object} input
 * @param {string} input.jobId
 * @returns {Object} OpenRouter response body
 * @throws {Error} OPENROUTER_INVALID_INPUT: <reason>
 * @throws {Error} OPENROUTER_REQUEST_FAILED: <status> <message>
 * @see https://openrouter.ai/docs/api/api-reference/video-generation/poll-video-generation-status
 */
async function getVideos(input) {
  return openrouterOperation(input, {
  "method": "GET",
  "path": "/videos/{jobId}",
  "pathParams": [
    {
      "name": "jobId",
      "type": "string",
      "required": true
    }
  ]
});
}
