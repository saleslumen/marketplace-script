/**
 * @description Return HubSpot account details for the connected hub from GET /account-info/{apiVersion}/details. The private app access token is sent as a bearer token. The call does not introspect the token.
 * @returns {Object} Account
 * @property {number} portalId
 * @property {string} portalName
 * @property {string} accountType
 * @property {string} timeZone
 * @property {string} companyCurrency
 * @property {string[]} additionalCurrencies
 * @property {string} utcOffset
 * @property {number} utcOffsetMilliseconds
 * @property {string} uiDomain
 * @property {string} dataHostingLocation
 * @property {number} createdAt Unix timestamp in milliseconds
 * @property {Object} raw HubSpot account-info body
 * @throws {HUBSPOT_NOT_CONFIGURED} apiVersion is invalid
 * @throws {AUTH_NOT_CONNECTED} HubSpot is not connected
 * @throws {HUBSPOT_REQUEST_FAILED} HubSpot rejected or could not complete the request
 */
async function getAccount() {
  const account = await requestJson(accountPath(), "GET");
  return {
    portalId: Number(account.portalId) || 0,
    portalName: asString(account.portalName),
    accountType: asString(account.accountType),
    timeZone: asString(account.timeZone),
    companyCurrency: asString(account.companyCurrency),
    additionalCurrencies: asArray(account.additionalCurrencies),
    utcOffset: asString(account.utcOffset),
    utcOffsetMilliseconds: Number(account.utcOffsetMilliseconds) || 0,
    uiDomain: asString(account.uiDomain),
    dataHostingLocation: asString(account.dataHostingLocation),
    createdAt: Number(account.createdAt) || 0,
    raw: account,
  };
}
