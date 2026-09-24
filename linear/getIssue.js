/**
 * @description Fetch current issue state and team for validation.
 * @param {Object} input
 * @param {string} input.issueId
 * @returns {Object}
 * @property {string} issueId
 * @property {string} stateType
 * @property {boolean} completed
 * @property {string} teamId
 */
async function getIssue(input) {
  const req = input && typeof input === "object" ? input : {};
  const issueId = asString(req.issueId || req.id);
  if (!issueId) throw new Error("LINEAR_REQUEST_FAILED: issueId is required");
  const data = await linearGraphql(
    `query Issue($id: String!) {
      issue(id: $id) {
        id
        identifier
        title
        description
        url
        state { id name type }
        team { id key name }
      }
    }`,
    { id: issueId },
  );
  const issue = data.issue;
  if (!issue) throw new Error("LINEAR_REQUEST_FAILED: issue not found");
  const stateType = asString(issue.state && issue.state.type);
  const description = asString(issue.description);
  return {
    issueId: asString(issue.id),
    identifier: asString(issue.identifier),
    title: asString(issue.title),
    description,
    correlationId: extractCorrelationId(description),
    url: asString(issue.url),
    stateId: asString(issue.state && issue.state.id),
    stateName: asString(issue.state && issue.state.name),
    stateType,
    completed: stateType === "completed",
    teamId: asString(issue.team && issue.team.id),
    teamKey: asString(issue.team && issue.team.key),
    teamName: asString(issue.team && issue.team.name),
    found: true,
  };
}
