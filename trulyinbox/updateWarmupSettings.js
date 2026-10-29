/**
 * @description Update warmup settings for one email account.
 * @param {Object} input
 * @param {number} input.workspaceId
 * @param {number} input.id
 * @param {number} [input.warmupMaxLimit]
 * @param {string} [input.timezone]
 * @param {string} [input.dkimSelector]
 * @param {string} [input.senderName]
 * @param {string} [input.warmupFolder]
 * @param {string} [input.replyRateMode]
 * @param {number} [input.replyRate]
 * @param {string} [input.espMode]
 * @param {number} [input.espGooglePct]
 * @param {number} [input.espMicrosoftPct]
 * @param {number} [input.espOthersPct]
 * @param {string} [input.language]
 * @param {string} [input.industry]
 * @param {string[]} [input.topics]
 * @param {string} [input.contentMode]
 * @param {string} [input.customPrompt]
 * @param {Object[]} [input.schedule]
 * @param {number|null} [input.templateCollectionId]
 * @param {number} [input.templateRatioPercent]
 * @returns {Object}
 * @throws {Error} TRULYINBOX_INVALID_INPUT: <reason>
 * @throws {Error} TRULYINBOX_REQUEST_FAILED: <status> <message>
 */
async function updateWarmupSettings(input) {
  const req = requireObjectInput(input);
  const workspaceId = readRequired(req, "workspaceId", "workspaceId", "number");
  const id = readRequired(req, "id", "id", "number");
  const body = {};
  put(body, "warmupMaxLimit", readOptional(req, "warmupMaxLimit", "number"));
  put(body, "timezone", readOptional(req, "timezone", "string"));
  put(body, "dkimSelector", readOptional(req, "dkimSelector", "string"));
  put(body, "senderName", readOptional(req, "senderName", "string"));
  put(body, "warmupFolder", readOptional(req, "warmupFolder", "string"));
  put(body, "replyRateMode", readOptional(req, "replyRateMode", "string"));
  put(body, "replyRate", readOptional(req, "replyRate", "number"));
  put(body, "espMode", readOptional(req, "espMode", "string"));
  put(body, "espGooglePct", readOptional(req, "espGooglePct", "number"));
  put(body, "espMicrosoftPct", readOptional(req, "espMicrosoftPct", "number"));
  put(body, "espOthersPct", readOptional(req, "espOthersPct", "number"));
  put(body, "language", readOptional(req, "language", "string"));
  put(body, "industry", readOptional(req, "industry", "string"));
  put(body, "topics", readTypedArray(req, "topics", false, "string"));
  put(body, "contentMode", readOptional(req, "contentMode", "string"));
  put(body, "customPrompt", readOptional(req, "customPrompt", "string"));
  put(body, "schedule", readTypedArray(req, "schedule", false, "object"));
  put(body, "templateCollectionId", readNullableNumber(req, "templateCollectionId"));
  put(body, "templateRatioPercent", readOptional(req, "templateRatioPercent", "number"));
  return trulyinboxRequest("PATCH", workspacePath(workspaceId, `/accounts/${encodeURIComponent(id)}/warmup/settings`), body);
}
