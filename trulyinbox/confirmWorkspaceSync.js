/**
 * @description Start connecting the selected workspace mailboxes.
 * @param {Object} input
 * @param {string} input.workspaceId
 * @param {boolean} input.selectAll
 * @param {string[]} [input.selectedDomains]
 * @param {string[]} [input.deselect]
 * @param {string[]} [input.emailsToConnect]
 * @param {boolean} input.enableWarmup
 * @param {number[]} [input.emailAccountIdsToDelete]
 * @param {string} [input.tagName]
 * @returns {Object}
 * @throws {Error} TRULYINBOX_INVALID_INPUT: <reason>
 * @throws {Error} TRULYINBOX_REQUEST_FAILED: <status> <message>
 */
async function confirmWorkspaceSync(input) {
  const req = requireObjectInput(input);
  const workspaceId = readRequired(req, "workspaceId", "workspaceId", "string");
  const body = { selectAll: readRequired(req, "selectAll", "selectAll", "boolean") };
  if (req.selectedDomains !== undefined) body.selectedDomains = req.selectedDomains;
  if (req.deselect !== undefined) body.deselect = req.deselect;
  if (req.emailsToConnect !== undefined) body.emailsToConnect = req.emailsToConnect;
  body.enableWarmup = readRequired(req, "enableWarmup", "enableWarmup", "boolean");
  if (req.emailAccountIdsToDelete !== undefined) body.emailAccountIdsToDelete = req.emailAccountIdsToDelete;
  if (req.tagName !== undefined) body.tagName = req.tagName;
  return trulyinboxRequest("POST", `/workspaces/${encodeURIComponent(workspaceId)}/sync`, body);
}
