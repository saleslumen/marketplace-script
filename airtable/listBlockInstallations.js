/**
 * @description List block installations in a base. GET /v0/meta/bases/{baseId}/blockInstallations.
 * @param {Object} input
 * @param {string} input.baseId
 * @returns {Array<{id: string, state: string, createdByUserId: string, createdTime: string, blockId: string}>}
 * @throws {Error} AIRTABLE_INVALID_INPUT when baseId is missing
 * @throws {Error} AIRTABLE_REQUEST_FAILED: <status> <message> when Airtable rejects the request
 */
async function listBlockInstallations(input) {
  const req = requireObjectInput(input);
  const baseId = requireId(req.baseId, "baseId");
  return airtableRequest(`/meta/bases/${encodeURIComponent(baseId)}/blockInstallations`, "GET");
}
