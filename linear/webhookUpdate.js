/**
 * @description Update a webhook. mutation webhookUpdate(id: String!, input: WebhookUpdateInput!). https://github.com/linear/linear/blob/master/packages/sdk/src/schema.graphql
 * @param {Object} input
 * @param {string} input.id
 * @param {Object} input.input WebhookUpdateInput
 * @returns {Object} GraphQL data
 * @throws {Error} LINEAR_INVALID_INPUT when id or input is missing
 * @throws {Error} LINEAR_REQUEST_FAILED: <status> <message> when Linear rejects the request
 */
async function webhookUpdate(input) {
  const req = requireObjectInput(input);
  requireString(req.id, "id");
  requireObject(req.input, "input");
  return linearGraphql(
    "mutation WebhookUpdate($id: String!, $input: WebhookUpdateInput!) { webhookUpdate(id: $id, input: $input) { " + WEBHOOK_PAYLOAD + " } }",
    pickVariables(req, ["id", "input"]),
  );
}
