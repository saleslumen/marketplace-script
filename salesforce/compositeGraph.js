/**
 * @description Submit composite graphs. POST /services/data/vXX.X/composite/graph
 * @param {Object} input
 * @param {Object[]} input.graphs Graphs
 * @returns {Object} Salesforce graph response
 * @throws {SALESFORCE_INVALID_INPUT} graphs is missing
 * @throws {SALESFORCE_NOT_CONFIGURED} instanceUrl is missing or invalid, or apiVersion is invalid
 * @throws {AUTH_NOT_CONNECTED} Salesforce is not connected
 * @throws {SALESFORCE_REQUEST_FAILED} Salesforce rejected or could not complete the request
 */
async function compositeGraph(input) {
  const req = requireInput(input);
  return dataRequest("/composite/graph", "POST", { graphs: requireObjectList(req.graphs, "graphs") });
}
