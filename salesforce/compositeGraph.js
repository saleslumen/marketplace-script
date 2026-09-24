/**
 * @description Run a Salesforce composite graph request.
 * @param {Object[]} graphs Graph definitions
 * @returns {Object} Graph result
 * @property {Object[]} graphs
 * @property {Object} raw Salesforce graph body
 * @throws {SALESFORCE_INVALID_INPUT} graphs are missing
 * @throws {SALESFORCE_NOT_CONFIGURED} instanceUrl is missing or invalid
 * @throws {AUTH_NOT_CONNECTED} Salesforce is not connected
 * @throws {SALESFORCE_REQUEST_FAILED} Salesforce rejected or could not complete the request
 */
async function compositeGraph(graphs) {
  const listed = requireObjectList(graphs, "graphs");
  const result = await dataRequest("/composite/graph", "POST", { graphs: listed });
  return { graphs: asArray(result.graphs), raw: result };
}
