/**
 * @description Download generated video content. GET /api/v1/videos/{jobId}/content. The success body is response text.
 * @param {Object} input
 * @param {string} input.jobId
 * @param {number|null} [input.index]
 * @returns {string} OpenRouter response body
 * @throws {Error} OPENROUTER_INVALID_INPUT: <reason>
 * @throws {Error} OPENROUTER_REQUEST_FAILED: <status> <message>
 * @see https://openrouter.ai/docs/api/api-reference/video-generation/download-generated-video-content
 */
async function listVideosContent(input) {
  return openrouterOperation(input, {
  "method": "GET",
  "path": "/videos/{jobId}/content",
  "accept": "*/*",
  "query": [
    {
      "name": "index",
      "type": "integer",
      "nullable": true
    }
  ],
  "pathParams": [
    {
      "name": "jobId",
      "type": "string",
      "required": true
    }
  ]
});
}
