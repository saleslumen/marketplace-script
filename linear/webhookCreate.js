/**
 * @description Create a webhook. mutation webhookCreate(input: WebhookCreateInput!). url, resourceTypes, and either teamId or allPublicTeams are required. https://linear.app/developers/webhooks
 * @param {Object} input
 * @param {Object} input.input WebhookCreateInput
 * @param {string} input.input.url
 * @param {string[]} input.input.resourceTypes
 * @param {string} [input.input.teamId]
 * @param {boolean} [input.input.allPublicTeams]
 * @returns {Object} GraphQL data
 * @throws {Error} LINEAR_INVALID_INPUT when url, resourceTypes, or the team scope is missing
 * @throws {Error} LINEAR_REQUEST_FAILED: <status> <message> when Linear rejects the request
 */
async function webhookCreate(input) {
  const req = requireObjectInput(input);
  const created = requireObject(req.input, "input");
  requireString(created.url, "input.url");
  if (!Array.isArray(created.resourceTypes)) throw new Error("LINEAR_INVALID_INPUT: input.resourceTypes is required");
  created.resourceTypes.forEach((item, index) => {
    if (typeof item !== "string" || item.trim() === "") throw new Error("LINEAR_INVALID_INPUT: input.resourceTypes[" + index + "] is required");
  });
  const hasTeam = typeof created.teamId === "string" && created.teamId.trim() !== "";
  if (!hasTeam && created.allPublicTeams !== true) throw new Error("LINEAR_INVALID_INPUT: input.teamId or input.allPublicTeams is required");
  return linearGraphql(
    "mutation WebhookCreate($input: WebhookCreateInput!) { webhookCreate(input: $input) { " + WEBHOOK_PAYLOAD + " } }",
    { input: created },
  );
}
