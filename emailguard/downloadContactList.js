/**
 * @description Download Contact List. GET /api/v1/contact-verification/download/{contact_list_uuid}.
 * @param {Object} input
 * @param {string} input.contact_list_uuid
 * @returns {Object|string} EmailGuard response body
 * @throws {Error} EMAILGUARD_INVALID_INPUT: contact_list_uuid is required when contact_list_uuid is missing
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function downloadContactList(input) {
  const req = inputObject(input);
  const contact_list_uuid = requireText(req, "contact_list_uuid");
  return emailguardRequest(`/api/v1/contact-verification/download/${encodeURIComponent(contact_list_uuid)}`, "GET");
}
