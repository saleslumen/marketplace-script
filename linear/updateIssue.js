/**
 * @description Update an issue and optionally comment. Supports reopen via reopenStateId or team unstarted/started state lookup.
 * @param {Object} input
 * @param {string} input.issueId
 * @param {string} [input.title]
 * @param {string} [input.description]
 * @param {string} [input.stateId]
 * @param {boolean|string} [input.reopen]
 * @param {string} [input.reopenStateId]
 * @param {string} [input.teamId] - Used to resolve reopen state when reopenStateId omitted
 * @param {string} [input.comment]
 * @returns {Object}
 * @property {string} issueId
 * @property {boolean} success
 */
async function updateIssue(input) {
  const req = input && typeof input === "object" ? input : {};
  const issueId = asString(req.issueId || req.id);
  if (!issueId) throw new Error("LINEAR_REQUEST_FAILED: issueId is required");
  const patch = {};
  if (asString(req.title)) patch.title = asString(req.title);
  if (asString(req.description)) patch.description = asString(req.description);
  if (asString(req.stateId)) patch.stateId = asString(req.stateId);
  const shouldReopen = req.reopen === true || asString(req.reopen).toLowerCase() === "true";
  if (shouldReopen && !patch.stateId) {
    const reopenStateId = asString(req.reopenStateId);
    if (reopenStateId) {
      patch.stateId = reopenStateId;
    } else {
      const teamId = asString(req.teamId) || (await getIssue({ issueId })).teamId;
      if (!teamId) throw new Error("LINEAR_REQUEST_FAILED: teamId or reopenStateId is required to reopen");
      const teamData = await linearGraphql(
        `query TeamStates($id: String!) {
          team(id: $id) { states { nodes { id name type } } }
        }`,
        { id: teamId },
      );
      const states = (((teamData.team && teamData.team.states && teamData.team.states.nodes) || []));
      const reopenState = states.find((state) => asString(state.type) === "started")
        || states.find((state) => asString(state.type) === "unstarted")
        || states.find((state) => asString(state.type) === "backlog");
      if (!reopenState) throw new Error("LINEAR_REQUEST_FAILED: no reopen workflow state found on team");
      patch.stateId = asString(reopenState.id);
    }
  }
  let success = true;
  let issue = {};
  if (Object.keys(patch).length) {
    const data = await linearGraphql(
      `mutation IssueUpdate($id: String!, $input: IssueUpdateInput!) {
        issueUpdate(id: $id, input: $input) {
          success
          issue { id identifier url state { id name type } }
        }
      }`,
      { id: issueId, input: patch },
    );
    success = Boolean(data.issueUpdate && data.issueUpdate.success);
    issue = (data.issueUpdate && data.issueUpdate.issue) || {};
  }
  let commentId = "";
  const comment = asString(req.comment || req.commentBody);
  if (comment) {
    const commentData = await linearGraphql(
      `mutation CommentCreate($input: CommentCreateInput!) {
        commentCreate(input: $input) {
          success
          comment { id }
        }
      }`,
      { input: { issueId, body: comment } },
    );
    commentId = asString(commentData.commentCreate && commentData.commentCreate.comment && commentData.commentCreate.comment.id);
    success = success && Boolean(commentData.commentCreate && commentData.commentCreate.success);
  }
  return {
    issueId: asString(issue.id || issueId),
    identifier: asString(issue.identifier),
    url: asString(issue.url),
    stateType: asString(issue.state && issue.state.type),
    stateName: asString(issue.state && issue.state.name),
    commentId,
    reopened: shouldReopen,
    success,
  };
}
