/**
 * @description Upsert up to 100 CRM records via POST /crm/objects/{apiVersion}/{objectType}/batch/upsert. idProperty is the unique identifier property, such as email on contacts. inputs is an array of objects, each with id and properties.
 * @param {string} objectType Object type path
 * @param {string} idProperty Unique identifier property
 * @param {Object[]} inputs Batch upsert inputs
 * @returns {Object} Batch result
 * @throws {HUBSPOT_INVALID_INPUT} objectType, idProperty, or inputs are missing or inputs exceeds 100
 * @throws {HUBSPOT_NOT_CONFIGURED} apiVersion is invalid
 * @throws {AUTH_NOT_CONNECTED} HubSpot is not connected
 * @throws {HUBSPOT_REQUEST_FAILED} HubSpot rejected or could not complete the request
 */
async function upsertRecords(objectType, idProperty, inputs) {
  const property = asString(idProperty);
  if (!property) throw new Error("HUBSPOT_INVALID_INPUT: idProperty is required");
  return requestJson(objectsPath(objectType, "/batch/upsert"), "POST", { idProperty: property, inputs: requireInputs(inputs) });
}
