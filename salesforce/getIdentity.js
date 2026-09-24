/**
 * @description Return the connected Salesforce user from instance userinfo.
 * @returns {Object} Identity
 * @property {string} userId
 * @property {string} organizationId
 * @property {string} username
 * @property {string} displayName
 * @property {string} email
 * @property {string} instanceUrl
 * @property {Object} raw Salesforce userinfo body
 * @throws {SALESFORCE_NOT_CONFIGURED} instanceUrl is missing or invalid
 * @throws {AUTH_NOT_CONNECTED} Salesforce is not connected
 * @throws {SALESFORCE_REQUEST_FAILED} Salesforce rejected or could not complete the request
 */
async function getIdentity() {
  const identity = await requestJson("/services/oauth2/userinfo", "GET");
  return {
    userId: asString(identity.user_id),
    organizationId: asString(identity.organization_id),
    username: asString(identity.preferred_username || identity.username),
    displayName: asString(identity.name),
    email: asString(identity.email),
    instanceUrl: asString(identity.urls && identity.urls.custom_domain) || configuredInstanceUrl(),
    raw: identity,
  };
}
