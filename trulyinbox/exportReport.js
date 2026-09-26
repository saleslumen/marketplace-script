/**
 * @description Email a warmup report as CSV.
 * @param {Object} input
 * @param {number[]} [input.emailAccountIds]
 * @param {string} input.from YYYY-MM-DD.
 * @param {string} input.to YYYY-MM-DD.
 * @returns {Object}
 * @throws {Error} TRULYINBOX_INVALID_INPUT: <reason>
 * @throws {Error} TRULYINBOX_REQUEST_FAILED: <status> <message>
 */
async function exportReport(input) {
  const req = requireObjectInput(input);
  const body = {};
  if (req.emailAccountIds !== undefined) body.emailAccountIds = req.emailAccountIds;
  body.from = readRequired(req, "from", "from", "string");
  body.to = readRequired(req, "to", "to", "string");
  return trulyinboxRequest("POST", "/reports/export", body);
}
