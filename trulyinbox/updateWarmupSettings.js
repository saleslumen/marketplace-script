/**
 * @description Update warmup settings for one email account.
 * @param {Object} input
 * @param {number} input.emailAccountId
 * @param {string} [input.strategy]
 * @param {number} [input.maxSendingLimit]
 * @param {number} [input.warmUpInitialSendingLimit]
 * @param {number} [input.increaseEmailsByNumber]
 * @param {number} [input.replyRate]
 * @param {string} [input.timeZone]
 * @param {Object[]} [input.timeSlots]
 * @param {string} [input.warmupLanguage]
 * @param {Object} [input.upcomingContentConfig]
 * @param {number} [input.googleVolume]
 * @param {number} [input.microsoftVolume]
 * @param {number} [input.othersVolume]
 * @returns {Object}
 * @throws {Error} TRULYINBOX_INVALID_INPUT: <reason>
 * @throws {Error} TRULYINBOX_REQUEST_FAILED: <status> <message>
 */
async function updateWarmupSettings(input) {
  const req = requireObjectInput(input);
  const emailAccountId = readRequired(req, "emailAccountId", "emailAccountId", "number");
  const body = {};
  [
    "strategy",
    "maxSendingLimit",
    "warmUpInitialSendingLimit",
    "increaseEmailsByNumber",
    "replyRate",
    "timeZone",
    "timeSlots",
    "warmupLanguage",
    "upcomingContentConfig",
    "googleVolume",
    "microsoftVolume",
    "othersVolume",
  ].forEach((key) => {
    if (req[key] !== undefined) body[key] = req[key];
  });
  return trulyinboxRequest("PATCH", `/warmup-settings/${encodeURIComponent(emailAccountId)}`, body);
}
