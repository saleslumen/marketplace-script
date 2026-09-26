/**
 * @description Update Billing Details. PUT /v2/billing.
 * @param {Object} input
 * @param {string} [input.x-workspace-key]
 * @param {"GOOGLE"|"MICROSOFT"} [input.serviceProvider]
 * @param {string} input.firstName
 * @param {string} input.lastName
 * @param {string} input.company
 * @param {string} input.addressLineOne
 * @param {string} input.addressLineTwo
 * @param {*} input.addressLineThree
 * @param {string} input.city
 * @param {string} input.state
 * @param {string} input.country
 * @param {string} input.postalCode
 * @param {string} input.phoneCc
 * @param {string} input.phone
 * @param {string} input.workspaceId
 * @returns {Object|string} Zapmail response body
 * @throws {Error} ZAPMAIL_INVALID_INPUT: <reason> when a required input is missing or invalid
 * @throws {Error} ZAPMAIL_REQUEST_FAILED: <status> <message> when Zapmail returns a non-2xx status
 */
async function updateBillingDetails(input) {
  const req = inputObject(input);
  const serviceProvider = readServiceProvider(req, false);
  const workspaceKey = readHeader(req, "x-workspace-key", false);
  requireField(req, "firstName", "string");
  requireField(req, "lastName", "string");
  requireField(req, "company", "string");
  requireField(req, "addressLineOne", "string");
  requireField(req, "addressLineTwo", "string");
  requireField(req, "addressLineThree", "null");
  requireField(req, "city", "string");
  requireField(req, "state", "string");
  requireField(req, "country", "string");
  requireField(req, "postalCode", "string");
  requireField(req, "phoneCc", "string");
  requireField(req, "phone", "string");
  requireField(req, "workspaceId", "string");
  const body = omit(req, ["serviceProvider", "x-workspace-key", "x-workspace-id"]);
  return zapmailRequest("/v2/billing", "PUT", { serviceProvider, workspaceKey, body });
}
