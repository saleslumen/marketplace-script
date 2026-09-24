/**
 * @description Insert or update a record by external id.
 * @param {string} sobject API name such as Account
 * @param {string} externalIdField External id field API name
 * @param {string} externalId External id value
 * @param {Object} fields Field map
 * @param {boolean} [updateOnly] Update an existing row and do not create one
 * @returns {Object} Upsert result
 * @property {string} id
 * @property {boolean} created
 * @property {boolean} success
 * @property {Object} raw Salesforce upsert body
 * @throws {SALESFORCE_INVALID_INPUT} sobject, externalIdField, or externalId is missing
 * @throws {SALESFORCE_NOT_CONFIGURED} instanceUrl is missing or invalid
 * @throws {AUTH_NOT_CONNECTED} Salesforce is not connected
 * @throws {SALESFORCE_REQUEST_FAILED} Salesforce rejected or could not complete the request
 */
async function upsertSObject(sobject, externalIdField, externalId, fields, updateOnly) {
  const field = asString(externalIdField);
  const value = asString(externalId);
  if (!SOBJECT_NAME.test(field)) throw new Error("SALESFORCE_INVALID_INPUT: externalIdField is required");
  if (!value) throw new Error("SALESFORCE_INVALID_INPUT: externalId is required");
  const result = await dataRequest(
    `/sobjects/${encodeURIComponent(requireSObject(sobject))}/${encodeURIComponent(field)}/${encodeURIComponent(value)}`,
    "PATCH",
    asFields(fields),
    { updateOnly: optionalFlag(updateOnly) }
  );
  return {
    id: asString(result.id) || locationId(result.location),
    created: result.created === true,
    success: result.success !== false,
    raw: result,
  };
}
