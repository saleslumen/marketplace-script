/**
 * @description List email accounts in a workspace.
 * @param {Object} input
 * @param {number} input.workspaceId
 * @param {number} [input.page]
 * @param {number} [input.limit]
 * @param {string[]} [input.status]
 * @param {string[]} [input.provider]
 * @param {string} [input.q]
 * @param {string} [input.sortBy]
 * @param {string} [input.sortDir]
 * @param {string[]} [input.tags]
 * @param {string} [input.esp]
 * @param {number} [input.maxLimitMin]
 * @param {number} [input.maxLimitMax]
 * @param {string} [input.domain]
 * @param {string} [input.startDateFrom]
 * @param {string} [input.startDateTo]
 * @param {number} [input.deliverabilityMin]
 * @param {number} [input.deliverabilityMax]
 * @param {number} [input.espGoogleMin]
 * @param {number} [input.espGoogleMax]
 * @param {number} [input.espMicrosoftMin]
 * @param {number} [input.espMicrosoftMax]
 * @param {number} [input.espOthersMin]
 * @param {number} [input.espOthersMax]
 * @param {string[]} [input.outreachReadiness]
 * @param {number} [input.setupScoreMin]
 * @param {number} [input.setupScoreMax]
 * @returns {Object}
 * @throws {Error} TRULYINBOX_INVALID_INPUT: <reason>
 * @throws {Error} TRULYINBOX_REQUEST_FAILED: <status> <message>
 */
async function listEmailAccounts(input) {
  const req = requireObjectInput(input);
  const workspaceId = readRequired(req, "workspaceId", "workspaceId", "number");
  const query = trulyinboxQuery({
    page: optionalQueryNumber(req, "page"),
    limit: optionalQueryNumber(req, "limit"),
    status: optionalQueryStrings(req, "status"),
    provider: optionalQueryStrings(req, "provider"),
    q: optionalQueryString(req, "q"),
    sortBy: optionalQueryString(req, "sortBy"),
    sortDir: optionalQueryString(req, "sortDir"),
    tags: optionalQueryStrings(req, "tags"),
    esp: optionalQueryString(req, "esp"),
    maxLimitMin: optionalQueryNumber(req, "maxLimitMin"),
    maxLimitMax: optionalQueryNumber(req, "maxLimitMax"),
    domain: optionalQueryString(req, "domain"),
    startDateFrom: optionalQueryString(req, "startDateFrom"),
    startDateTo: optionalQueryString(req, "startDateTo"),
    deliverabilityMin: optionalQueryNumber(req, "deliverabilityMin"),
    deliverabilityMax: optionalQueryNumber(req, "deliverabilityMax"),
    espGoogleMin: optionalQueryNumber(req, "espGoogleMin"),
    espGoogleMax: optionalQueryNumber(req, "espGoogleMax"),
    espMicrosoftMin: optionalQueryNumber(req, "espMicrosoftMin"),
    espMicrosoftMax: optionalQueryNumber(req, "espMicrosoftMax"),
    espOthersMin: optionalQueryNumber(req, "espOthersMin"),
    espOthersMax: optionalQueryNumber(req, "espOthersMax"),
    outreachReadiness: optionalQueryStrings(req, "outreachReadiness"),
    setupScoreMin: optionalQueryNumber(req, "setupScoreMin"),
    setupScoreMax: optionalQueryNumber(req, "setupScoreMax"),
  });
  return trulyinboxRequest("GET", `${workspacePath(workspaceId, "/accounts")}${query}`);
}
