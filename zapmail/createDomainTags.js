/**
 * @description Create Domain Tags. POST /v2/domains/tags.
 * @param {Array<{name: string, tagColor: string}>} input
 * @param {string} [input.x-workspace-key]
 * @returns {Object|string} Zapmail response body
 * @throws {Error} ZAPMAIL_INVALID_INPUT: <reason> when a required input is missing or invalid
 * @throws {Error} ZAPMAIL_REQUEST_FAILED: <status> <message> when Zapmail returns a non-2xx status
 */
async function createDomainTags(input) {
  if (!Array.isArray(input)) throw new Error("ZAPMAIL_INVALID_INPUT: request body must be an array");
  const workspaceKey = readHeader(input, "x-workspace-key", false);
  return zapmailRequest("/v2/domains/tags", "POST", { workspaceKey, body: input });
}
