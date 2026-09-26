/**
 * @description Create an attachment. mutation attachmentCreate(input: AttachmentCreateInput!). issueId, title, and url are required. https://github.com/linear/linear/blob/master/packages/sdk/src/schema.graphql
 * @param {Object} input
 * @param {Object} input.input AttachmentCreateInput
 * @param {string} input.input.issueId
 * @param {string} input.input.title
 * @param {string} input.input.url
 * @returns {Object} GraphQL data
 * @throws {Error} LINEAR_INVALID_INPUT when input, issueId, title, or url is missing
 * @throws {Error} LINEAR_REQUEST_FAILED: <status> <message> when Linear rejects the request
 */
async function attachmentCreate(input) {
  const req = requireObjectInput(input);
  const created = requireObject(req.input, "input");
  requireString(created.issueId, "input.issueId");
  requireString(created.title, "input.title");
  requireString(created.url, "input.url");
  return linearGraphql(
    "mutation AttachmentCreate($input: AttachmentCreateInput!) { attachmentCreate(input: $input) { " + ATTACHMENT_PAYLOAD + " } }",
    { input: created },
  );
}
