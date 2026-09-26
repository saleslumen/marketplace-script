/**
 * @description Get the daily warmup report for one email account.
 * @param {Object} input
 * @param {number} input.emailAccountId
 * @param {string} [input.from] YYYY-MM-DD.
 * @param {string} [input.to] YYYY-MM-DD.
 * @returns {Object}
 * @throws {Error} TRULYINBOX_INVALID_INPUT: <reason>
 * @throws {Error} TRULYINBOX_REQUEST_FAILED: <status> <message>
 */
async function getSingleReport(input) {
  const req = requireObjectInput(input);
  const body = { emailAccountId: readRequired(req, "emailAccountId", "emailAccountId", "number") };
  if (req.from !== undefined) body.from = req.from;
  if (req.to !== undefined) body.to = req.to;
  return trulyinboxRequest("POST", "/reports", body);
}
