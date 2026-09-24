/**
 * @description List a page of CRM records via GET /crm/objects/{apiVersion}/{objectType}. Optional properties is a comma-separated property list. Optional after is paging.next.after. Optional limit is 1 to 100. Optional associations is a comma-separated list of object types whose associated IDs should be returned.
 * @param {string} objectType Object type path
 * @param {string} [properties] Comma-separated property names
 * @param {string} [after] Paging cursor
 * @param {number} [limit] Page size from 1 to 100
 * @param {string} [associations] Comma-separated associated object types
 * @returns {Object} Record page with results and paging.next.after
 * @throws {HUBSPOT_INVALID_INPUT} objectType is missing or limit is invalid
 * @throws {HUBSPOT_NOT_CONFIGURED} apiVersion is invalid
 * @throws {AUTH_NOT_CONNECTED} HubSpot is not connected
 * @throws {HUBSPOT_REQUEST_FAILED} HubSpot rejected or could not complete the request
 */
async function listRecords(objectType, properties, after, limit, associations) {
  return requestJson(objectsPath(objectType), "GET", undefined, {
    properties: optionalProperties(properties) || undefined,
    after: asString(after) || undefined,
    limit: optionalLimit(limit),
    associations: optionalAssociations(associations) || undefined,
  });
}
