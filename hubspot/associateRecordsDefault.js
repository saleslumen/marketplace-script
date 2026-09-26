/**
 * @description Associate records (default). PUT /crm/objects/{apiVersion}/{fromObjectType}/{fromObjectId}/associations/default/{toObjectType}/{toObjectId}.
 * @param {Object} input
 * @param {string} input.fromObjectType
 * @param {string} input.fromObjectId
 * @param {string} input.toObjectType
 * @param {string} input.toObjectId
 * @returns {Object} HubSpot response body
 * @throws {Error} HUBSPOT_INVALID_INPUT: <reason> when a required input is missing
 * @throws {Error} HUBSPOT_NOT_CONFIGURED when apiVersion is invalid
 * @throws {Error} AUTH_NOT_CONNECTED when HubSpot is not connected
 * @throws {Error} HUBSPOT_REQUEST_FAILED when HubSpot returns a non-2xx status
 */
async function associateRecordsDefault(input) {
  const req = inputObject(input);
  const fromObjectType = requiredPath(req, "fromObjectType");
  const fromObjectId = requiredPath(req, "fromObjectId");
  const toObjectType = requiredPath(req, "toObjectType");
  const toObjectId = requiredPath(req, "toObjectId");
  return requestJson(`/crm/objects/${configuredApiVersion()}/${encodeURIComponent(fromObjectType)}/${encodeURIComponent(fromObjectId)}/associations/default/${encodeURIComponent(toObjectType)}/${encodeURIComponent(toObjectId)}`, "PUT");
}
