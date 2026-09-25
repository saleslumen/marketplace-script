/**
 * @description Ask Jev one or more typed decision questions.
 * @param {Object} input
 * @param {Object|string|Object[]} input.state - Context to evaluate.
 * @param {Object} input.questions - Choice, noul, or score questions keyed by result name.
 * @param {string} [input.model] - Jev model id. Default typesafe/jev-1.13.
 * @param {string} [input.sessionId] - Optional observability grouping id.
 * @returns {Object}
 * @property {Object} answers - Typed answers keyed like input.questions.
 * @property {string} model - Model release used.
 * @property {Object} usage - Token counts and cost.
 */
async function decisions(input) {
  const req = input && typeof input === "object" ? input : {};
  const questions = req.questions && typeof req.questions === "object" && !Array.isArray(req.questions) ? req.questions : null;
  if (req.state === undefined || req.state === null || !questions || !Object.keys(questions).length) {
    throw new Error("OPENROUTER_REQUEST_FAILED: state and questions are required");
  }
  const body = {
    model: asString(req.model) || "typesafe/jev-1.13",
    state: req.state,
    questions,
  };
  const sessionId = asString(req.sessionId);
  if (sessionId) body.session_id = sessionId;
  const raw = await openrouterDecisionsRequest(body);
  const answers = raw.answers && typeof raw.answers === "object" ? raw.answers : null;
  if (!answers) throw new Error("OPENROUTER_INVALID_RESPONSE: decisions response missing answers");
  return {
    answers,
    model: asString(raw.model || body.model),
    provider: asString(raw.provider),
    usage: raw.usage && typeof raw.usage === "object" ? raw.usage : {},
  };
}
