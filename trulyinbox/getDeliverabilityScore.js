/**
 * @description Get warmup deliverability rates for one email account and date range.
 * @param {Object} input
 * @param {number} input.emailAccountId
 * @param {string} input.startDate YYYY-MM-DD.
 * @param {string} input.endDate YYYY-MM-DD.
 * @param {string[]} [input.esps] gmail, outlook, or other.
 * @returns {Object}
 * @throws {Error} TRULYINBOX_INVALID_INPUT: <reason>
 * @throws {Error} TRULYINBOX_REQUEST_FAILED: <status> <message>
 */
async function getDeliverabilityScore(input) {
  const req = requireObjectInput(input);
  const emailAccountId = readRequired(req, "emailAccountId", "emailAccountId", "number");
  const body = {
    startDate: readRequired(req, "startDate", "startDate", "string"),
    endDate: readRequired(req, "endDate", "endDate", "string"),
  };
  if (req.esps !== undefined) body.esps = req.esps;
  return trulyinboxRequest("POST", `/deliverability-score/${encodeURIComponent(emailAccountId)}`, body);
}
