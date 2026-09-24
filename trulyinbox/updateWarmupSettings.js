/**
 * @description Update warmup settings using documented PATCH fields only.
 * @param {Object} input
 * @param {string} input.emailAccountId
 * @returns {Object}
 */
async function updateWarmupSettings(input) {
  const req = input && typeof input === "object" ? input : {};
  const emailAccountId = asString(req.emailAccountId || req.id);
  if (!emailAccountId) {
    return { ok: false, outcome: "MISSING_EMAIL_ACCOUNT", retryable: false, failure: "emailAccountId is required" };
  }
  const body = {};
  if (asString(req.strategy)) body.strategy = asString(req.strategy);
  if (req.maxSendingLimit !== undefined && req.maxSendingLimit !== "") body.maxSendingLimit = asNumber(req.maxSendingLimit, 0);
  if (req.warmUpInitialSendingLimit !== undefined && req.warmUpInitialSendingLimit !== "") {
    body.warmUpInitialSendingLimit = asNumber(req.warmUpInitialSendingLimit, 0);
  }
  if (req.increaseEmailsByNumber !== undefined && req.increaseEmailsByNumber !== "") {
    body.increaseEmailsByNumber = asNumber(req.increaseEmailsByNumber, 0);
  }
  if (req.replyRate !== undefined && req.replyRate !== "") body.replyRate = asNumber(req.replyRate, 0);
  if (asString(req.timeZone)) body.timeZone = asString(req.timeZone);
  if (Array.isArray(req.timeSlots)) body.timeSlots = req.timeSlots;
  if (asString(req.warmupLanguage)) body.warmupLanguage = asString(req.warmupLanguage);
  if (req.upcomingContentConfig && typeof req.upcomingContentConfig === "object") {
    body.upcomingContentConfig = req.upcomingContentConfig;
  }
  const hasGoogle = req.googleVolume !== undefined && req.googleVolume !== "";
  const hasMicrosoft = req.microsoftVolume !== undefined && req.microsoftVolume !== "";
  const hasOthers = req.othersVolume !== undefined && req.othersVolume !== "";
  if (hasGoogle || hasMicrosoft || hasOthers) {
    if (!(hasGoogle && hasMicrosoft && hasOthers)) {
      return {
        ok: false,
        outcome: "WARMUP_VOLUME_INCOMPLETE",
        retryable: false,
        emailAccountId,
        failure: "googleVolume, microsoftVolume, and othersVolume must be sent together and sum to 100",
      };
    }
    body.googleVolume = asNumber(req.googleVolume, 0);
    body.microsoftVolume = asNumber(req.microsoftVolume, 0);
    body.othersVolume = asNumber(req.othersVolume, 0);
  }
  if (!Object.keys(body).length) {
    return { ok: false, outcome: "MISSING_WARMUP_PATCH", retryable: false, emailAccountId, failure: "At least one documented warmup setting is required" };
  }
  const classified = classifyHttp(await trulyinboxRequestRaw(`/warmup-settings/${encodeURIComponent(emailAccountId)}`, "PATCH", body));
  if (classified.status === 429 || classified.retryable) {
    return { ok: false, outcome: "RATE_LIMITED", retryable: true, emailAccountId, failure: classified.message || "TrulyInbox rate limited (20 req/min)" };
  }
  if (classified.status < 200 || classified.status >= 300) {
    return {
      ok: false,
      outcome: "WARMUP_SETTINGS_UPDATE_FAILED",
      retryable: false,
      emailAccountId,
      failure: classified.message || `Warmup settings update failed (${classified.status})`,
    };
  }
  return {
    ok: true,
    outcome: "WARMUP_SETTINGS_UPDATED",
    retryable: false,
    failure: "",
    ...mapWarmupSettings(classified.body),
  };
}
