/**
 * @description Create a Linear issue. When correlationId is provided, reuses an existing issue with the same marker.
 * @param {Object} input
 * @param {string} input.teamId
 * @param {string} input.title
 * @param {string} [input.description]
 * @param {string} [input.correlationId] - Stable marker embedded for idempotent reuse
 * @returns {Object}
 * @property {string} issueId
 * @property {string} identifier
 * @property {string} url
 * @property {boolean} created
 * @property {boolean} reused
 * @property {boolean} success
 */
async function createIssue(input) {
  const req = input && typeof input === "object" ? input : {};
  const resolvedTeam = await getTeamId({ teamId: req.teamId });
  const teamId = resolvedTeam.teamId;
  const title = asString(req.title);
  const correlationId = asString(req.correlationId);
  let description = asString(req.description);
  if (!title) throw new Error("LINEAR_REQUEST_FAILED: title is required");
  if (correlationId) {
    const existing = await findIssueByCorrelation({ teamId, correlationId });
    if (existing.found) {
      return {
        issueId: existing.issueId,
        identifier: existing.identifier,
        url: existing.url,
        created: false,
        reused: true,
        success: true,
        correlationId,
      };
    }
    const marker = `${CORRELATION_MARKER_PREFIX}${correlationId}`;
    description = description ? `${description}\n\n${marker}` : marker;
  }
  const data = await linearGraphql(
    `mutation IssueCreate($input: IssueCreateInput!) {
      issueCreate(input: $input) {
        success
        issue { id identifier url }
      }
    }`,
    { input: { teamId, title, description: description || undefined } },
  );
  const issue = (data.issueCreate && data.issueCreate.issue) || {};
  return {
    issueId: asString(issue.id),
    identifier: asString(issue.identifier),
    url: asString(issue.url),
    created: true,
    reused: false,
    success: Boolean(data.issueCreate && data.issueCreate.success),
    correlationId,
  };
}
