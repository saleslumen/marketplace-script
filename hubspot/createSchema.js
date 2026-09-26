/**
 * @description Create a new custom object schema. POST /crm-object-schemas/{apiVersion}/schemas. associatedObjects lists the object types this schema associates with. Other input keys are the schema body.
 * @param {Object} input
 * @param {boolean} input.allowsSensitiveProperties
 * @param {string[]} input.associatedObjects
 * @param {Object} input.labels
 * @param {string} input.name
 * @param {Object[]} input.properties
 * @param {string[]} input.requiredProperties
 * @param {string[]} input.searchableProperties
 * @param {string[]} input.secondaryDisplayProperties
 * @param {boolean} input.shouldCreateSameObjectAssociation
 * @returns {Object} HubSpot response body. An empty 2xx body is {}.
 * @throws {Error} HUBSPOT_INVALID_INPUT: <reason> when a required input is missing
 * @throws {Error} HUBSPOT_NOT_CONFIGURED when apiVersion is invalid
 * @throws {Error} AUTH_NOT_CONNECTED when HubSpot is not connected
 * @throws {Error} HUBSPOT_REQUEST_FAILED when HubSpot returns a non-2xx status
 */
async function createSchema(input) {
  const req = inputObject(input);
  requiredBoolean(req, "allowsSensitiveProperties");
  presentArray(req, "associatedObjects");
  requiredObjectField(req, "labels");
  requiredStringField(req, "name");
  presentArray(req, "properties");
  presentArray(req, "requiredProperties");
  presentArray(req, "searchableProperties");
  presentArray(req, "secondaryDisplayProperties");
  requiredBoolean(req, "shouldCreateSameObjectAssociation");
  return requestJson(`/crm-object-schemas/${configuredApiVersion()}/schemas`, "POST", bodyFrom(req, []));
}
