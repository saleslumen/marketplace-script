/**
 * @description Create a chat completion (OpenAI-compatible). Always sends reasoning.enabled=false so thinking models return message content only.
 * @param {Object} input
 * @param {Object[]} input.messages - Chat messages [{ role, content }, ...]
 * @param {string} [input.model] - Model id. Default qwen/qwen3-32b.
 * @param {number|string} [input.temperature] - Sampling temperature. Default 0.4.
 * @returns {Object}
 * @property {string} content - Assistant message content
 * @property {string} model - Model reported by OpenRouter
 * @property {Object} raw - Full API response
 */
async function chatCompletions(input) {
  const req = input && typeof input === "object" ? input : {};
  let messages = req.messages;
  if (typeof messages === "string") {
    try {
      messages = JSON.parse(messages);
    } catch (_error) {
      throw new Error("OPENROUTER_REQUEST_FAILED: messages must be an array or JSON array string");
    }
  }
  if (!Array.isArray(messages) || !messages.length) {
    throw new Error("OPENROUTER_REQUEST_FAILED: messages is required");
  }
  const body = {
    model: asString(req.model) || "qwen/qwen3-32b",
    messages,
    temperature: asNumber(req.temperature, 0.4),
    reasoning: { enabled: false },
  };
  const raw = await openrouterRequest("/chat/completions", "POST", body);
  const content = assistantContent(raw.choices && raw.choices[0] && raw.choices[0].message);
  if (!content) throw new Error("OPENROUTER_REQUEST_FAILED: empty assistant content");
  return { content, model: asString(raw.model || body.model), raw };
}
