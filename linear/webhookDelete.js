/**
 * @description Delete a webhook. mutation webhookDelete(id: String!). https://linear.app/developers/webhooks
 * @param {Object} input
 * @param {string} input.id
 * @returns {Object} GraphQL data
 * @throws {Error} LINEAR_INVALID_INPUT when id is missing
 * @throws {Error} LINEAR_REQUEST_FAILED: <status> <message> when Linear rejects the request
 */
async function webhookDelete(input) {
  const req = requireObjectInput(input);
  requireString(req.id, "id");
  return linearGraphql(
    "mutation WebhookDelete($id: String!) { webhookDelete(id: $id) { " + DELETE_PAYLOAD + " } }",
    pickVariables(req, ["id"]),
  );
}
