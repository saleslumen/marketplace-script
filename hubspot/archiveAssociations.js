/**
 * @description Archive associations via POST /crm/associations/{apiVersion}/{fromObjectType}/{toObjectType}/batch/archive. inputs is an array of objects with from and to. At most 100 unique from inputs. This removes associations; it does not archive the records.
 * @param {string} fromObjectType From object type path
 * @param {string} toObjectType To object type path
 * @param {Object[]} inputs Batch archive inputs
 * @returns {Object} Batch result
 * @throws {HUBSPOT_INVALID_INPUT} fromObjectType, toObjectType, or inputs are missing or unique from inputs exceeds 100
 * @throws {HUBSPOT_NOT_CONFIGURED} apiVersion is invalid
 * @throws {AUTH_NOT_CONNECTED} HubSpot is not connected
 * @throws {HUBSPOT_REQUEST_FAILED} HubSpot rejected or could not complete the request
 */
async function archiveAssociations(fromObjectType, toObjectType, inputs) {
  return requestJson(associationsBatchPath(fromObjectType, toObjectType, "/batch/archive"), "POST", {
    inputs: requireArchiveAssociationInputs(inputs),
  });
}
