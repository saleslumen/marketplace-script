/**
 * @description Update one CRM record via PATCH /crm/objects/{apiVersion}/{objectType}/{id} with body { properties }. Optional idProperty updates by a unique property such as email.
 * @param {string} objectType Object type path
 * @param {string} id Record id or unique property value
 * @param {Object} properties Property map
 * @param {string} [idProperty] Unique identifier property
 * @returns {Object} Updated record
 * @throws {HUBSPOT_INVALID_INPUT} objectType or id is missing or properties is not an object
 * @throws {HUBSPOT_NOT_CONFIGURED} apiVersion is invalid
 * @throws {AUTH_NOT_CONNECTED} HubSpot is not connected
 * @throws {HUBSPOT_REQUEST_FAILED} HubSpot rejected or could not complete the request
 */
async function updateRecord(objectType, id, properties, idProperty) {
  return requestJson(
    objectsPath(objectType, `/${encodeURIComponent(requireId(id))}`),
    "PATCH",
    { properties: asProperties(properties) },
    { idProperty: optionalIdProperty(idProperty) || undefined }
  );
}
