/**
 * @description Create a context. POST /v1/contexts.
 * @param {Object} [input]
 * @param {string} [input.projectId]
 * @param {string} [input.name] - At most 128 characters
 * @returns {Object} id, publicKey, cipherAlgorithm, and initializationVectorSize
 * @throws {Error} BROWSERBASE_REQUEST_FAILED when input is invalid or Browserbase rejects the request
 */
async function createContext(input) {
  return browserbaseRequest("/v1/contexts", "POST", buildContextBody(input));
}
