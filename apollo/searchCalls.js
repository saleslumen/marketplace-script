/**
 * @description Search for calls. GET /phone_calls/search. https://docs.apollo.io/reference/search-for-calls
 * @param {Object} input
 * @param {Object} input Query names include date_range[min], date_range[max], duration[min], duration[max], inbound, user_ids[], q_keywords, page, and per_page.
 * @returns {Object} Apollo response body.
 * @throws {Error} APOLLO_INVALID_INPUT when a required input is missing or a provided value has the wrong type.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function searchCalls(input) {
  const req = requireObject(input);
  const query = pickFields(req, [["date_range[max]", "string"], ["date_range[min]", "string"], ["duration[max]", "integer"], ["duration[min]", "integer"], ["inbound", "string"], ["user_ids[]", "string[]"], ["contact_label_ids[]", "string[]"], ["phone_call_purpose_ids[]", "string[]"], ["phone_call_outcome_ids[]", "string[]"], ["q_keywords", "string"], ["page", "string"], ["per_page", "string"]]);
  return apolloRequest(`/phone_calls/search${buildQuery(query)}`, "GET");
}
