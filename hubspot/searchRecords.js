/**
 * @description Search CRM records via POST /crm/objects/{apiVersion}/{objectType}/search. body must be an object and may include filterGroups, sorts, query, properties, limit, and after.
 * @param {string} objectType Object type path
 * @param {Object} body Search body
 * @returns {Object} Search page with total, results, and paging.next.after
 * @throws {HUBSPOT_INVALID_INPUT} objectType is missing or body is not an object
 * @throws {HUBSPOT_NOT_CONFIGURED} apiVersion is invalid
 * @throws {AUTH_NOT_CONNECTED} HubSpot is not connected
 * @throws {HUBSPOT_REQUEST_FAILED} HubSpot rejected or could not complete the request
 */
async function searchRecords(objectType, body) {
  return requestJson(objectsPath(objectType, "/search"), "POST", requireObject(body, "body"));
}
