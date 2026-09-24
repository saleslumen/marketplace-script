/**
 * @description Find an existing issue by embedded correlation marker (read-before-create helper).
 * @param {Object} input
 * @param {string} input.teamId
 * @param {string} input.correlationId
 * @returns {Object}
 * @property {boolean} found
 * @property {string} issueId
 * @property {string} identifier
 * @property {string} url
 */
async function findIssueByCorrelation(input) {
  const req = input && typeof input === "object" ? input : {};
  const teamId = (await getTeamId({ teamId: req.teamId })).teamId;
  const correlationId = asString(req.correlationId);
  if (!correlationId) throw new Error("LINEAR_REQUEST_FAILED: correlationId is required");
  const marker = `${CORRELATION_MARKER_PREFIX}${correlationId}`;
  const data = await linearGraphql(
    `query IssuesByCorrelation($filter: IssueFilter!) {
      issues(filter: $filter, first: 1) {
        nodes { id identifier url title description state { id name type } team { id } }
      }
    }`,
    {
      filter: {
        team: { id: { eq: teamId } },
        description: { contains: marker },
      },
    },
  );
  const issue = (((data.issues && data.issues.nodes) || [])[0]) || null;
  if (!issue) {
    return { found: false, issueId: "", identifier: "", url: "", correlationId, marker };
  }
  return {
    found: true,
    issueId: asString(issue.id),
    identifier: asString(issue.identifier),
    url: asString(issue.url),
    title: asString(issue.title),
    stateType: asString(issue.state && issue.state.type),
    stateName: asString(issue.state && issue.state.name),
    teamId: asString(issue.team && issue.team.id),
    correlationId,
    marker,
    reused: true,
  };
}
