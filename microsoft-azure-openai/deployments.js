/**
 * @description List Azure OpenAI deployments on the configured resource.
 * @returns {Object} Deployment list
 * @property {Object[]} deployments - id, model, and status for each deployment
 * @throws {AZURE_NOT_CONFIGURED} Endpoint is missing or invalid
 * @throws {AUTH_NOT_CONNECTED} Azure is not connected
 * @throws {AZURE_REQUEST_FAILED} Azure rejected or could not complete the request
 */
async function listDeployments() {
  const response = await requestJson(`/openai/deployments${queryString({ "api-version": configuredApiVersion() })}`, "GET");
  const items = Array.isArray(response.data) ? response.data : [];
  return {
    deployments: items.map((item) => ({
      id: String(item.id || ""),
      model: String(item.model || ""),
      status: String(item.status || ""),
    })),
  };
}
