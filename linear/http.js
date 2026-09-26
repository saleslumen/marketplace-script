const LINEAR_GRAPHQL_URL = "https://api.linear.app/graphql";
const CONNECTION_KEY = "linear";
const USER_REF = "id name";
const TEAM_REF = "id key name";
const WORKFLOW_STATE_REF = "id name type color position";
const ISSUE_FIELDS = "id identifier title description url priority priorityLabel estimate dueDate createdAt updatedAt archivedAt completedAt canceledAt startedAt labelIds assignee { " + USER_REF + " } state { " + WORKFLOW_STATE_REF + " } team { " + TEAM_REF + " } project { id name }";
const ISSUE_PAYLOAD = "success lastSyncId issue { " + ISSUE_FIELDS + " }";
const ISSUE_ARCHIVE_PAYLOAD = "success lastSyncId entity { " + ISSUE_FIELDS + " }";
const DELETE_PAYLOAD = "success lastSyncId entityId";
const COMMENT_FIELDS = "id body createdAt updatedAt editedAt resolvedAt url issueId parentId quotedText user { " + USER_REF + " }";
const COMMENT_PAYLOAD = "success lastSyncId comment { " + COMMENT_FIELDS + " }";
const TEAM_FIELDS = "id name key description color icon displayName timezone createdAt updatedAt archivedAt cyclesEnabled triageEnabled issueEstimationType visibility";
const LABEL_FIELDS = "id name color description isGroup archivedAt createdAt updatedAt team { " + TEAM_REF + " }";
const PROJECT_FIELDS = "id name slugId description url color icon priority priorityLabel startDate targetDate startedAt completedAt canceledAt createdAt updatedAt archivedAt trashed progress scope status { id name type color position } lead { " + USER_REF + " }";
const USER_FIELDS = "id name displayName email active admin avatarUrl url isMe guest app createdAt updatedAt archivedAt";
const ATTACHMENT_FIELDS = "id title subtitle url sourceType metadata createdAt updatedAt archivedAt issue { id identifier }";
const ATTACHMENT_PAYLOAD = "success lastSyncId attachment { " + ATTACHMENT_FIELDS + " }";
const WEBHOOK_FIELDS = "id url enabled label resourceTypes allPublicTeams secret createdAt updatedAt archivedAt team { " + TEAM_REF + " }";
const WEBHOOK_PAYLOAD = "success lastSyncId webhook { " + WEBHOOK_FIELDS + " }";
const linearConnection = (fields) => "nodes { " + fields + " } pageInfo { hasNextPage hasPreviousPage startCursor endCursor }";
const requireObjectInput = (input) => {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("LINEAR_INVALID_INPUT: input must be an object");
  return input;
};
const requireString = (value, name) => {
  if (typeof value !== "string" || value.trim() === "") throw new Error("LINEAR_INVALID_INPUT: " + name + " is required");
  return value;
};
const requireObject = (value, name) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("LINEAR_INVALID_INPUT: " + name + " must be an object");
  return value;
};
const pickVariables = (input, names) => {
  const variables = {};
  names.forEach((name) => {
    if (Object.prototype.hasOwnProperty.call(input, name)) variables[name] = input[name];
  });
  return variables;
};
const withoutKey = (message, apiKey) => {
  const text = typeof message === "string" ? message : "";
  const stripped = apiKey ? text.split(apiKey).join("") : text;
  const collapsed = stripped.replace(/\s+/g, " ").trim();
  const safe = collapsed || "request failed";
  return safe.length > 500 ? safe.slice(0, 500) : safe;
};
const linearFailureMessage = (text, apiKey) => {
  const raw = typeof text === "string" ? text.trim() : "";
  if (!raw) return "request failed";
  try {
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.errors) && parsed.errors.length) {
      const message = parsed.errors[0] && typeof parsed.errors[0].message === "string" ? parsed.errors[0].message : "";
      return withoutKey(message, apiKey);
    }
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed) && typeof parsed.message === "string") return withoutKey(parsed.message, apiKey);
  } catch (_error) {
    // The failure body is not JSON.
  }
  return withoutKey(raw, apiKey);
};
const linearGraphql = async (query, variables) => {
  const apiKey = await ConnectionApp.getApiKey(CONNECTION_KEY);
  const body = { query };
  if (variables !== undefined) body.variables = variables;
  const response = await UrlFetchApp.fetch(LINEAR_GRAPHQL_URL, {
    method: "POST",
    muteHttpExceptions: true,
    headers: {
      Authorization: apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    payload: JSON.stringify(body),
  });
  const status = response.getResponseCode();
  const text = response.getContentText();
  let parsed;
  try {
    parsed = text && text.trim() ? JSON.parse(text) : undefined;
  } catch (_error) {
    parsed = undefined;
  }
  const errors = parsed && Array.isArray(parsed.errors) ? parsed.errors : [];
  if (status < 200 || status >= 300 || errors.length || !parsed || !Object.prototype.hasOwnProperty.call(parsed, "data")) {
    throw new Error("LINEAR_REQUEST_FAILED: " + status + " " + linearFailureMessage(text, apiKey));
  }
  return parsed.data;
};
