/**
 * @description Start or stop warmup for accounts selected by id, tag, or both.
 * @param {Object} input
 * @param {number[]} [input.emailAccountIds]
 * @param {string[]} [input.tags]
 * @param {string} input.action start or stop.
 * @returns {Object}
 * @throws {Error} TRULYINBOX_INVALID_INPUT: <reason>
 * @throws {Error} TRULYINBOX_REQUEST_FAILED: <status> <message>
 */
async function bulkWarmupAction(input) {
  const req = requireObjectInput(input);
  const body = {};
  if (req.emailAccountIds !== undefined) body.emailAccountIds = req.emailAccountIds;
  if (req.tags !== undefined) body.tags = req.tags;
  body.action = readRequired(req, "action", "action", "string");
  return trulyinboxRequest("POST", "/warmup-settings/bulk-action", body);
}
