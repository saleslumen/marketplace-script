/**
 * @description Get one record by id.
 * @param {string} sobject API name such as Account
 * @param {string} id Record id
 * @param {string} [fields] Optional comma-separated field list
 * @returns {Object} Record
 * @throws {SALESFORCE_INVALID_INPUT} sobject or id is missing
 * @throws {SALESFORCE_NOT_CONFIGURED} instanceUrl is missing or invalid
 * @throws {AUTH_NOT_CONNECTED} Salesforce is not connected
 * @throws {SALESFORCE_REQUEST_FAILED} Salesforce rejected or could not complete the request
 */
async function getSObject(sobject, id, fields) {
  if (fields !== undefined && fields !== null && typeof fields !== "string") {
    throw new Error("SALESFORCE_INVALID_INPUT: fields must be a comma-separated string");
  }
  const listed = asString(fields).split(",").map(asString).filter(Boolean);
  return dataRequest(
    `/sobjects/${encodeURIComponent(requireSObject(sobject))}/${encodeURIComponent(requireId(id))}`,
    "GET",
    undefined,
    listed.length ? { fields: listed.join(",") } : undefined
  );
}
