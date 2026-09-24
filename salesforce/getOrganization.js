/**
 * @description Return the Salesforce Organization row for the connected org.
 * @returns {Object} Organization
 * @property {string} id
 * @property {string} name
 * @property {boolean} isSandbox
 * @property {string} organizationType
 * @property {string} instanceName
 * @property {string} namespacePrefix
 * @property {Object} raw Organization row
 * @throws {SALESFORCE_NOT_CONFIGURED} instanceUrl is missing or invalid
 * @throws {AUTH_NOT_CONNECTED} Salesforce is not connected
 * @throws {SALESFORCE_REQUEST_FAILED} Salesforce rejected or could not complete the request
 */
async function getOrganization() {
  const result = await dataRequest("/query", "GET", undefined, {
    q: "SELECT Id, Name, IsSandbox, OrganizationType, InstanceName, NamespacePrefix FROM Organization LIMIT 1",
  });
  const row = (result.records && result.records[0]) || {};
  return {
    id: asString(row.Id),
    name: asString(row.Name),
    isSandbox: row.IsSandbox === true,
    organizationType: asString(row.OrganizationType),
    instanceName: asString(row.InstanceName),
    namespacePrefix: asString(row.NamespacePrefix),
    raw: row,
  };
}
