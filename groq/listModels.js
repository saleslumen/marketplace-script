/**
 * @description List models available to the API key.
 * @returns {Object}
 * @property {Object[]} data
 */
async function listModels() {
  const raw = await groqRequest("/models", "GET");
  return { data: Array.isArray(raw.data) ? raw.data : [], raw };
}
