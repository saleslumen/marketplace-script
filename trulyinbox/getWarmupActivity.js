/**
 * @description List warmup activity for one email account.
 * @param {Object} input
 * @param {number} input.workspaceId
 * @param {number} input.id
 * @param {number} [input.page]
 * @param {number} [input.limit]
 * @returns {Object}
 * @throws {Error} TRULYINBOX_INVALID_INPUT: <reason>
 * @throws {Error} TRULYINBOX_REQUEST_FAILED: <status> <message>
 */
async function getWarmupActivity(input) {
  const req = requireObjectInput(input);
  const workspaceId = readRequired(req, "workspaceId", "workspaceId", "number");
  const id = readRequired(req, "id", "id", "number");
  const query = trulyinboxQuery({
    page: optionalQueryNumber(req, "page"),
    limit: optionalQueryNumber(req, "limit"),
  });
  return trulyinboxRequest("GET", `${workspacePath(workspaceId, `/accounts/${encodeURIComponent(id)}/warmup/activity`)}${query}`);
}
