/**
 * @description Resolve Linear team id from input or configuration. Fails when neither is present.
 * @param {Object} [input]
 * @param {string} [input.teamId]
 * @returns {Object}
 * @property {string} teamId
 */
async function getTeamId(input) {
  const fromInput = asString(input && input.teamId);
  if (fromInput) return { teamId: fromInput, source: "input" };
  const fromConfiguration = configuredLinearTeamId();
  if (!fromConfiguration) throw new Error("LINEAR_TEAM_ID_MISSING: pass teamId or set configuration teamId");
  return { teamId: fromConfiguration, source: "configuration" };
}
