/**
 * @description Get one CRM record via GET /crm/objects/{apiVersion}/{objectType}/{id}. Optional properties is a comma-separated property list. Optional associations is a comma-separated list of object types whose associated IDs should be returned. Optional idProperty reads by a unique property such as email.
 * @param {string} objectType Object type path
 * @param {string} id Record id or unique property value
 * @param {string} [properties] Comma-separated property names
 * @param {string} [associations] Comma-separated associated object types
 * @param {string} [idProperty] Unique identifier property
 * @returns {Object} Record
 * @throws {HUBSPOT_INVALID_INPUT} objectType or id is missing
 * @throws {HUBSPOT_NOT_CONFIGURED} apiVersion is invalid
 * @throws {AUTH_NOT_CONNECTED} HubSpot is not connected
 * @throws {HUBSPOT_REQUEST_FAILED} HubSpot rejected or could not complete the request
 */
async function getRecord(objectType, id, properties, associations, idProperty) {
  return requestJson(objectsPath(objectType, `/${encodeURIComponent(requireId(id))}`), "GET", undefined, {
    properties: optionalProperties(properties) || undefined,
    associations: optionalAssociations(associations) || undefined,
    idProperty: optionalIdProperty(idProperty) || undefined,
  });
}
