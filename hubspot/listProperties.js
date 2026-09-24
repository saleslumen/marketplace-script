/**
 * @description List CRM property definitions for an object type via GET /crm/properties/{apiVersion}/{objectType}. objectType is a HubSpot path such as contacts, companies, deals, tickets, or an object type id.
 * @param {string} objectType Object type path
 * @returns {Object} Property collection
 * @throws {HUBSPOT_INVALID_INPUT} objectType is missing
 * @throws {HUBSPOT_NOT_CONFIGURED} apiVersion is invalid
 * @throws {AUTH_NOT_CONNECTED} HubSpot is not connected
 * @throws {HUBSPOT_REQUEST_FAILED} HubSpot rejected or could not complete the request
 */
async function listProperties(objectType) {
  return requestJson(propertiesPath(objectType), "GET");
}
