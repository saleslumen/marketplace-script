/**
 * @description Get a page of associations from one record to another object type via GET /crm/objects/{apiVersion}/{fromObjectType}/{fromId}/associations/{toObjectType}. Optional after is paging.next.after. Optional limit is 1 to 100.
 * @param {string} fromObjectType From object type path
 * @param {string} fromId From record id
 * @param {string} toObjectType To object type path
 * @param {string} [after] Paging cursor
 * @param {number} [limit] Page size from 1 to 100
 * @returns {Object} Association page
 * @throws {HUBSPOT_INVALID_INPUT} fromObjectType, fromId, or toObjectType is missing or limit is invalid
 * @throws {HUBSPOT_NOT_CONFIGURED} apiVersion is invalid
 * @throws {AUTH_NOT_CONNECTED} HubSpot is not connected
 * @throws {HUBSPOT_REQUEST_FAILED} HubSpot rejected or could not complete the request
 */
async function getAssociations(fromObjectType, fromId, toObjectType, after, limit) {
  return requestJson(objectAssociationsPath(fromObjectType, fromId, toObjectType), "GET", undefined, {
    after: asString(after) || undefined,
    limit: optionalLimit(limit),
  });
}
