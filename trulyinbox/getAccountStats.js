/**
 * @description Get warmup stats for one email account.
 * @param {Object} input
 * @param {number} input.workspaceId
 * @param {number} input.id
 * @param {number} [input.days]
 * @returns {Object}
 * @throws {Error} TRULYINBOX_INVALID_INPUT: <reason>
 * @throws {Error} TRULYINBOX_REQUEST_FAILED: <status> <message>
 */
async function getAccountStats(input) {
  const req = requireObjectInput(input);
  const workspaceId = readRequired(req, "workspaceId", "workspaceId", "number");
  const id = readRequired(req, "id", "id", "number");
  const query = trulyinboxQuery({ days: optionalQueryNumber(req, "days") });
  return trulyinboxRequest("GET", `${workspacePath(workspaceId, `/accounts/${encodeURIComponent(id)}/analytics/stats`)}${query}`);
}
