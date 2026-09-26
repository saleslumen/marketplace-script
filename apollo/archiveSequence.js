/**
 * @description Archive a sequence. POST /emailer_campaigns/{sequence_id}/archive. https://docs.apollo.io/reference/archive-sequence
 * @param {Object} input
 * @param {string} input.sequence_id
 * @returns {Object} Apollo response body.
 * @throws {Error} APOLLO_INVALID_INPUT when sequence_id is missing.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function archiveSequence(input) {
  const req = requireObject(input);
  const sequenceId = requireString(req, "sequence_id");
  return apolloRequest(`/emailer_campaigns/${encodeURIComponent(sequenceId)}/archive`, "POST");
}
