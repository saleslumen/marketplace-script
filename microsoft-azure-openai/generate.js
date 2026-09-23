/**
 * @description Generate a chat completion from the configured Azure OpenAI deployment.
 * @param {string} prompt User message
 * @param {string} [deployment] Deployment name. Defaults to the installation deployment.
 * @returns {Object} Model response
 * @property {string} text - Assistant text
 * @property {string} model - Model or deployment name returned by Azure
 * @property {string} deployment - Deployment that served the request
 * @throws {AZURE_NOT_CONFIGURED} Endpoint or deployment is missing
 * @throws {AUTH_NOT_CONNECTED} Azure is not connected
 * @throws {AZURE_REQUEST_FAILED} Azure rejected or could not complete the request
 */
async function generate(prompt, deployment) {
  const text = typeof prompt === "string" ? prompt.trim() : "";
  if (!text) throw new Error("AZURE_INVALID_INPUT: prompt is required");
  const target = typeof deployment === "string" && deployment.trim() ? deployment.trim() : configuredDeployment();
  const response = await requestJson(
    `/openai/deployments/${encodeURIComponent(target)}/chat/completions${queryString({ "api-version": configuredApiVersion() })}`,
    "POST",
    { messages: [{ role: "user", content: text }] }
  );
  const choice = (response.choices && response.choices[0]) || {};
  const message = choice.message || {};
  return {
    text: String(message.content || ""),
    model: String(response.model || target),
    deployment: target,
  };
}
