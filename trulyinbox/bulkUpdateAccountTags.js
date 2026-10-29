/**
 * @description Assign or unassign tags in bulk.
 * @param {Object} input
 * @param {number} input.workspaceId
 * @param {number[]} input.ids
 * @param {string[]} [input.addTags]
 * @param {string[]} [input.removeTags]
 * @returns {Object}
 * @throws {Error} TRULYINBOX_INVALID_INPUT: <reason>
 * @throws {Error} TRULYINBOX_REQUEST_FAILED: <status> <message>
 */
async function bulkUpdateAccountTags(input) {
  const req = requireObjectInput(input);
  const workspaceId = readRequired(req, "workspaceId", "workspaceId", "number");
  const body = { ids: readTypedArray(req, "ids", true, "number") };
  put(body, "addTags", readTypedArray(req, "addTags", false, "string"));
  put(body, "removeTags", readTypedArray(req, "removeTags", false, "string"));
  return trulyinboxRequest("POST", workspacePath(workspaceId, "/accounts/bulk/tags"), body);
}
