/**
 * @description Create one CRM record via POST /crm/objects/{apiVersion}/{objectType} with body { properties, associations? }. Optional associations is an array of { to: { id }, types: [{ associationCategory, associationTypeId }] }. Omitted associations sends { properties } only.
 * @param {string} objectType Object type path
 * @param {Object} properties Property map
 * @param {Object[]} [associations] Association inputs
 * @returns {Object} Created record
 * @throws {HUBSPOT_INVALID_INPUT} objectType is missing, properties is not an object, or associations is not an object array
 * @throws {HUBSPOT_NOT_CONFIGURED} apiVersion is invalid
 * @throws {AUTH_NOT_CONNECTED} HubSpot is not connected
 * @throws {HUBSPOT_REQUEST_FAILED} HubSpot rejected or could not complete the request
 */
async function createRecord(objectType, properties, associations) {
  const body = { properties: asProperties(properties) };
  const listed = optionalAssociationList(associations);
  if (listed) body.associations = listed;
  return requestJson(objectsPath(objectType), "POST", body);
}
