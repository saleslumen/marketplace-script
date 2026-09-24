/**
 * @description Read up to 100 CRM records via POST /crm/objects/{apiVersion}/{objectType}/batch/read. inputs is an array of objects, each with id. Optional properties is a comma-separated property list. Optional idProperty reads by a unique property such as email.
 * @param {string} objectType Object type path
 * @param {Object[]} inputs Batch read inputs
 * @param {string} [properties] Comma-separated property names
 * @param {string} [idProperty] Unique identifier property
 * @returns {Object} Batch result
 * @throws {HUBSPOT_INVALID_INPUT} objectType or inputs are missing or inputs exceeds 100
 * @throws {HUBSPOT_NOT_CONFIGURED} apiVersion is invalid
 * @throws {AUTH_NOT_CONNECTED} HubSpot is not connected
 * @throws {HUBSPOT_REQUEST_FAILED} HubSpot rejected or could not complete the request
 */
async function readRecords(objectType, inputs, properties, idProperty) {
  const body = { inputs: requireInputs(inputs) };
  const listed = optionalProperties(properties);
  if (listed) body.properties = listed.split(",").map(asString).filter(Boolean);
  const property = asString(idProperty);
  if (property) body.idProperty = property;
  return requestJson(objectsPath(objectType, "/batch/read"), "POST", body);
}
