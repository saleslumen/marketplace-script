/**
 * @description Upload one attachment up to 5 MB. POST https://content.airtable.com/v0/{baseId}/{recordId}/{attachmentFieldIdOrName}/uploadAttachment.
 * @param {Object} input
 * @param {string} input.baseId
 * @param {string} input.recordId
 * @param {string} input.attachmentFieldIdOrName
 * @param {string} input.contentType - Non-empty and at most 255 characters
 * @param {string} input.file - Base64 file bytes, at most 5 MB decoded
 * @param {string} input.filename
 * @returns {Object} id, createdTime, and fields keyed by field id
 * @throws {Error} AIRTABLE_INVALID_INPUT when a required input or documented limit is violated
 * @throws {Error} AIRTABLE_REQUEST_FAILED: <status> <message> when Airtable rejects the request
 */
async function uploadAttachment(input) {
  const req = requireObjectInput(input);
  const baseId = requireId(req.baseId, "baseId");
  const recordId = requireId(req.recordId, "recordId");
  const attachmentFieldIdOrName = requireId(req.attachmentFieldIdOrName, "attachmentFieldIdOrName");
  const body = { contentType: requireContentType(req.contentType), file: requireBase64File(req.file), filename: requireId(req.filename, "filename") };
  const path = `/${encodeURIComponent(baseId)}/${encodeURIComponent(recordId)}/${encodeURIComponent(attachmentFieldIdOrName)}/uploadAttachment`;
  return airtableRequest(path, "POST", body, { origin: AIRTABLE_CONTENT_BASE });
}
