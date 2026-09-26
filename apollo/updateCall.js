/**
 * @description Update call records. PUT /phone_calls/{id}. https://docs.apollo.io/reference/update-call-records
 * @param {Object} input
 * @param {string} input.id
 * @param {Object} input Same call query names as create call records.
 * @returns {Object} Apollo response body.
 * @throws {Error} APOLLO_INVALID_INPUT when id is missing.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function updateCall(input) {
  const req = requireObject(input);
  const id = requireString(req, "id");
  const query = pickFields(req, [["logged", "boolean"], ["user_id[]", "string[]"], ["contact_id", "string"], ["account_id", "string"], ["to_number", "string"], ["from_number", "string"], ["status", "string"], ["start_time", "string"], ["end_time", "string"], ["duration", "integer"], ["phone_call_purpose_id", "string"], ["phone_call_outcome_id", "string"], ["note", "string"]]);
  return apolloRequest(`/phone_calls/${encodeURIComponent(id)}${buildQuery(query)}`, "PUT");
}
