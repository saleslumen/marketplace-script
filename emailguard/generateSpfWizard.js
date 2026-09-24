/**
 * @description Generate an SPF record from selected providers.
 * @param {Object} input
 * @returns {Object}
 */
async function generateSpfWizard(input) {
  const req = input && typeof input === "object" ? input : {};
  const providers = asJsonList(firstPresent(req, ["providers"]));
  if (!providers.length) return missingInput("providers");
  const body = {};
  body.providers = providers;
  return runAuthed("/api/v1/email-authentication/spf-generator-wizard", "POST", body, "SPF_WIZARD", "SPF_WIZARD_FAILED");
}
