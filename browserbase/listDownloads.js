/**
 * @description List downloads. GET /v1/downloads.
 * @param {Object} input
 * @param {string} input.sessionId
 * @param {string} [input.filename]
 * @param {string} [input.mimeType]
 * @param {number} [input.minSize]
 * @param {number} [input.maxSize]
 * @param {string} [input.createdAfter] - RFC 3339 date-time
 * @param {string} [input.createdBefore] - RFC 3339 date-time
 * @param {number} [input.limit] - Integer from 1 to 100
 * @param {number} [input.offset] - Integer greater than or equal to 0
 * @returns {Object} downloads, total, limit, and offset
 * @throws {Error} BROWSERBASE_REQUEST_FAILED when input is invalid or Browserbase rejects the request
 */
async function listDownloads(input) {
  return browserbaseRequest(`/v1/downloads${buildDownloadsQuery(input)}`, "GET");
}
