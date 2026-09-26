/**
 * @description Create call records. POST /phone_calls. https://docs.apollo.io/reference/create-call-records
 * @param {Object} input
 * @param {Object} input Query names include logged, user_id[], contact_id, account_id, to_number, from_number, status, start_time, end_time, duration, phone_call_purpose_id, phone_call_outcome_id, and note.
 * @returns {Object} Apollo response body.
 * @throws {Error} APOLLO_INVALID_INPUT when a required input is missing or a provided value has the wrong type.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function createCall(input) {
  const req = requireObject(input);
  const query = pickFields(req, [["logged", "boolean"], ["user_id[]", "string[]"], ["contact_id", "string"], ["account_id", "string"], ["to_number", "string"], ["from_number", "string"], ["status", "string"], ["start_time", "string"], ["end_time", "string"], ["duration", "integer"], ["phone_call_purpose_id", "string"], ["phone_call_outcome_id", "string"], ["note", "string"]]);
  return apolloRequest(`/phone_calls${buildQuery(query)}`, "POST");
}
