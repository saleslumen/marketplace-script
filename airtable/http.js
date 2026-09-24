const AIRTABLE_API_BASE = "https://api.airtable.com/v0";
const CONNECTION_KEY = "airtable";
const AIRTABLE_BASE_ID_PROPERTY = "AIRTABLE_BASE_ID";
const AIRTABLE_TABLE_NAME_PROPERTY = "AIRTABLE_TABLE_NAME";
const AIRTABLE_TABLE_ID_PROPERTY = "AIRTABLE_TABLE_ID";
const AIRTABLE_OPERATIONS_TABLE_NAME_PROPERTY = "AIRTABLE_OPERATIONS_TABLE_NAME";
const AIRTABLE_OPERATIONS_TABLE_ID_PROPERTY = "AIRTABLE_OPERATIONS_TABLE_ID";
const DEFAULT_TABLE_NAME = "Clients";
const DEFAULT_OPERATIONS_TABLE_NAME = "Operations";
const MAX_OPERATIONS = 40;
const STATUS_PRIORITY = {
  FAILED: 60,
  BLOCKED_HUMAN: 50,
  RETRYING: 40,
  RUNNING: 30,
  QUEUED: 20,
  SUCCEEDED: 10,
};
const FIELD = {
  name: "Name",
  domain: "Domain",
  notes: "Notes",
  organizationId: "Organization ID",
  workspaceId: "Mailbox Workspace ID",
  mailboxPlane: "Mailbox Plane",
  trulyInboxWorkspaceId: "TrulyInbox Workspace ID",
  cloudflareAccountId: "Cloudflare Account ID",
  googleAdminTrusted: "Google Admin Trusted",
  namespaceId: "Namespace ID",
  stage: "Stage",
  status: "Status",
  progress: "Progress",
  blocker: "Blocker",
  failure: "Failure",
  nextAction: "Next Action",
  workflow: "Workflow",
  correlationId: "Correlation ID",
  linearIssueId: "Linear Issue ID",
  browserbaseSessionId: "Browserbase Session ID",
  updatedAt: "Updated At",
  trustAttemptCount: "Google Admin Trust Attempt Count",
  webhookDeliveryId: "Linear Webhook Delivery ID",
  failureExecutionId: "Workflow Failure Execution ID",
  adminMailboxEmail: "Google Admin Mailbox Email",
  adminMailboxUid: "InboxKit Admin Mailbox UID",
  linearTeamId: "Linear Team ID",
  namespaceWorkflowIds: "Namespace Workflow IDs",
};
const OP_FIELD = {
  key: "Key",
  clientRecordId: "Client Record ID",
  namespaceId: "Namespace ID",
  correlationId: "Correlation ID",
  workflow: "Workflow",
  status: "Status",
  stage: "Stage",
  progress: "Progress",
  blocker: "Blocker",
  failure: "Failure",
  nextAction: "Next Action",
  linearIssueId: "Linear Issue ID",
  browserbaseSessionId: "Browserbase Session ID",
  updatedAt: "Updated At",
  trustAttemptCount: "Google Admin Trust Attempt Count",
  webhookDeliveryId: "Linear Webhook Delivery ID",
  failureExecutionId: "Workflow Failure Execution ID",
  adminMailboxEmail: "Google Admin Mailbox Email",
  adminMailboxUid: "InboxKit Admin Mailbox UID",
  linearTeamId: "Linear Team ID",
  workspaceId: "Mailbox Workspace ID",
  trustHistoryStatus: "Trust History Status",
  trustCompletedAt: "Trust Completed At",
  connectExecutionId: "Connect Execution ID",
};
const REGISTRY_FIELD_SPECS = [
  { name: FIELD.name, type: "singleLineText" },
  { name: FIELD.domain, type: "singleLineText" },
  { name: FIELD.notes, type: "multilineText" },
  { name: FIELD.organizationId, type: "singleLineText" },
  { name: FIELD.workspaceId, type: "singleLineText" },
  { name: FIELD.mailboxPlane, type: "singleSelect", options: { choices: [{ name: "zapmail" }, { name: "inboxkit" }] } },
  { name: FIELD.trulyInboxWorkspaceId, type: "singleLineText" },
  { name: FIELD.cloudflareAccountId, type: "singleLineText" },
  { name: FIELD.googleAdminTrusted, type: "checkbox", options: { color: "greenBright", icon: "check" } },
  { name: FIELD.namespaceId, type: "singleLineText" },
  { name: FIELD.stage, type: "singleLineText" },
  { name: FIELD.status, type: "singleLineText" },
  { name: FIELD.progress, type: "multilineText" },
  { name: FIELD.blocker, type: "multilineText" },
  { name: FIELD.failure, type: "multilineText" },
  { name: FIELD.nextAction, type: "multilineText" },
  { name: FIELD.workflow, type: "singleLineText" },
  { name: FIELD.correlationId, type: "singleLineText" },
  { name: FIELD.linearIssueId, type: "singleLineText" },
  { name: FIELD.browserbaseSessionId, type: "singleLineText" },
  { name: FIELD.updatedAt, type: "singleLineText" },
  { name: FIELD.trustAttemptCount, type: "number", options: { precision: 0 } },
  { name: FIELD.webhookDeliveryId, type: "singleLineText" },
  { name: FIELD.failureExecutionId, type: "singleLineText" },
  { name: FIELD.adminMailboxEmail, type: "singleLineText" },
  { name: FIELD.adminMailboxUid, type: "singleLineText" },
  { name: FIELD.linearTeamId, type: "singleLineText" },
  { name: FIELD.namespaceWorkflowIds, type: "multilineText" },
];
const OPERATIONS_FIELD_SPECS = [
  { name: OP_FIELD.key, type: "singleLineText" },
  { name: OP_FIELD.clientRecordId, type: "singleLineText" },
  { name: OP_FIELD.namespaceId, type: "singleLineText" },
  { name: OP_FIELD.correlationId, type: "singleLineText" },
  { name: OP_FIELD.workflow, type: "singleLineText" },
  { name: OP_FIELD.status, type: "singleLineText" },
  { name: OP_FIELD.stage, type: "singleLineText" },
  { name: OP_FIELD.progress, type: "multilineText" },
  { name: OP_FIELD.blocker, type: "multilineText" },
  { name: OP_FIELD.failure, type: "multilineText" },
  { name: OP_FIELD.nextAction, type: "multilineText" },
  { name: OP_FIELD.linearIssueId, type: "singleLineText" },
  { name: OP_FIELD.browserbaseSessionId, type: "singleLineText" },
  { name: OP_FIELD.updatedAt, type: "singleLineText" },
  { name: OP_FIELD.trustAttemptCount, type: "number", options: { precision: 0 } },
  { name: OP_FIELD.webhookDeliveryId, type: "singleLineText" },
  { name: OP_FIELD.failureExecutionId, type: "singleLineText" },
  { name: OP_FIELD.adminMailboxEmail, type: "singleLineText" },
  { name: OP_FIELD.adminMailboxUid, type: "singleLineText" },
  { name: OP_FIELD.linearTeamId, type: "singleLineText" },
  { name: OP_FIELD.workspaceId, type: "singleLineText" },
  { name: OP_FIELD.trustHistoryStatus, type: "singleLineText" },
  { name: OP_FIELD.trustCompletedAt, type: "singleLineText" },
  { name: OP_FIELD.connectExecutionId, type: "singleLineText" },
];
const VALID_STATUSES = ["QUEUED", "RUNNING", "BLOCKED_HUMAN", "RETRYING", "FAILED", "SUCCEEDED"];
const MAILBOX_PLANES = ["zapmail", "inboxkit"];
const asString = (value) => (value === undefined || value === null ? "" : String(value).trim());
const asMailboxPlane = (value) => {
  const plane = asString(value).toLowerCase();
  return MAILBOX_PLANES.includes(plane) ? plane : "";
};
const resolveMailboxPlane = (incoming, current, errorPrefix) => {
  const raw = asString(incoming);
  const next = asMailboxPlane(raw);
  if (raw && !next) throw new Error(`${errorPrefix}: mailboxPlane must be zapmail or inboxkit`);
  const have = asMailboxPlane(current);
  if (next && have && next !== have) throw new Error(`${errorPrefix}: MAILBOX_PLANE_MISMATCH: namespace mailbox provider is ${have}`);
  return next || have;
};
const escapeFormulaValue = (value) => asString(value).replace(/'/g, "\\'");
const utcNowIso = () => new Date().toISOString();
const getAirtablePat = async () => ConnectionApp.getApiKey(CONNECTION_KEY);
const getRegistry = async () => {
  const vault = VaultService.getUserVault();
  const baseId = asString(await vault.getProperty(AIRTABLE_BASE_ID_PROPERTY));
  const tableName = asString(await vault.getProperty(AIRTABLE_TABLE_NAME_PROPERTY)) || DEFAULT_TABLE_NAME;
  const tableId = asString(await vault.getProperty(AIRTABLE_TABLE_ID_PROPERTY));
  const operationsTableName =
    asString(await vault.getProperty(AIRTABLE_OPERATIONS_TABLE_NAME_PROPERTY)) || DEFAULT_OPERATIONS_TABLE_NAME;
  const operationsTableId = asString(await vault.getProperty(AIRTABLE_OPERATIONS_TABLE_ID_PROPERTY));
  if (!baseId) throw new Error("AIRTABLE_REGISTRY_MISSING: store base with setRegistry");
  return { baseId, tableName, tableId, operationsTableName, operationsTableId };
};
const airtableRequest = async (path, method = "GET", body) => {
  const token = await getAirtablePat();
  const options = {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };
  if (body !== undefined) options.payload = JSON.stringify(body);
  const response = await UrlFetchApp.fetch(`${AIRTABLE_API_BASE}${path}`, options);
  const status = response.getResponseCode();
  const text = response.getContentText();
  if (status < 200 || status >= 300) throw new Error(`AIRTABLE_REQUEST_FAILED (${status}): ${text}`);
  return text.trim() ? JSON.parse(text) : {};
};
const tablePath = (baseId, tableName, suffix = "") =>
  `/${encodeURIComponent(baseId)}/${encodeURIComponent(tableName)}${suffix}`;
const operationKey = (clientRecordId, correlationId, workflow) => {
  const client = asString(clientRecordId);
  if (!client) return "";
  const byCorrelation = asString(correlationId);
  if (byCorrelation) return `${client}:c:${byCorrelation}`;
  const byWorkflow = asString(workflow);
  if (byWorkflow) return `${client}:w:${byWorkflow}`;
  return "";
};
const sortOperations = (operations) => {
  const ops = (Array.isArray(operations) ? operations : Object.values(operations || {})).filter(
    (op) => op && typeof op === "object",
  );
  ops.sort((left, right) => {
    const leftPriority = STATUS_PRIORITY[asString(left.status).toUpperCase()] || 0;
    const rightPriority = STATUS_PRIORITY[asString(right.status).toUpperCase()] || 0;
    if (leftPriority !== rightPriority) return rightPriority - leftPriority;
    return asString(right.updatedAt).localeCompare(asString(left.updatedAt));
  });
  return ops;
};
const choosePrimaryOperation = (byKeyOrList) => {
  const ops = sortOperations(byKeyOrList);
  return ops[0] || null;
};
const chooseNonEmptyFromOperations = (operations, getter) => {
  for (const operation of sortOperations(operations)) {
    const value = getter(operation);
    if (asString(value)) return asString(value);
  }
  return "";
};
const chooseTrustAttemptCount = (operations) => {
  for (const operation of sortOperations(operations)) {
    if (operation.trustAttemptCount !== undefined && operation.trustAttemptCount !== null) {
      return Number(operation.trustAttemptCount) || 0;
    }
  }
  return 0;
};
const operationsToByKey = (operations) => {
  const byKey = {};
  (operations || []).forEach((operation) => {
    if (!operation || typeof operation !== "object") return;
    const key = asString(operation.key);
    if (!key) return;
    byKey[key] = operation;
  });
  return byKey;
};
const findOperation = (operations, selectors) => {
  const byKey = operations && operations.byKey ? operations.byKey : operationsToByKey(operations);
  const requestedCorrelationId = asString(selectors && selectors.correlationId);
  const requestedLinearIssueId = asString(selectors && selectors.linearIssueId);
  const requestedWorkflow = asString(selectors && selectors.workflow);
  return (
    Object.values(byKey).find((operation) => {
      if (!operation || typeof operation !== "object") return false;
      if (requestedCorrelationId && asString(operation.correlationId) !== requestedCorrelationId) return false;
      if (requestedLinearIssueId && asString(operation.linearIssueId) !== requestedLinearIssueId) return false;
      if (requestedWorkflow && asString(operation.workflow) !== requestedWorkflow) return false;
      return Boolean(requestedCorrelationId || requestedLinearIssueId || requestedWorkflow);
    }) || null
  );
};
const withMatchedOperation = (record, selectors) => {
  const operation = findOperation(record.operations, selectors);
  if (!operation) return { ...record, operationFound: false };
  return {
    ...record,
    operationFound: true,
    operationCorrelationId: asString(operation.correlationId),
    operationWorkflow: asString(operation.workflow),
    operationStatus: asString(operation.status),
    operationWorkspaceId: asString(operation.workspaceId),
    operationLinearIssueId: asString(operation.linearIssueId),
    operationBrowserbaseSessionId: asString(operation.browserbaseSessionId),
    operationLinearTeamId: asString(operation.linearTeamId),
    operationWebhookDeliveryId: asString(operation.webhookDeliveryId),
    operationConnectExecutionId: asString(operation.connectExecutionId),
    operationAdminMailboxEmail: asString(operation.adminMailboxEmail),
    operationAdminMailboxUid: asString(operation.adminMailboxUid),
    operationTrustAttemptCount: Number(operation.trustAttemptCount) || 0,
    operationKey: asString(operation.key),
    operationRecordId: asString(operation.recordId),
  };
};
const parseNamespaceWorkflowIds = (raw) => {
  const text = asString(raw);
  if (!text) return {};
  try {
    const parsed = JSON.parse(text);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const out = {};
    Object.keys(parsed).forEach((key) => {
      const slug = asString(key);
      const workflowId = asString(parsed[key]);
      if (slug && workflowId) out[slug] = workflowId;
    });
    return out;
  } catch (_error) {
    return {};
  }
};
const resolveConnectWorkflowId = (workflowIds) => {
  const inboxkit = asString(workflowIds && workflowIds["inboxkit-accounts-to-emails"]);
  const zapmail = asString(workflowIds && workflowIds["zapmail-accounts-to-emails"]);
  if (inboxkit && zapmail) return "";
  return inboxkit || zapmail;
};
const mapRecord = (record) => {
  const fields = (record && record.fields) || {};
  const namespaceWorkflowIds = parseNamespaceWorkflowIds(fields[FIELD.namespaceWorkflowIds]);
  return {
    recordId: asString(record && record.id),
    fields,
    name: asString(fields[FIELD.name]),
    domain: asString(fields[FIELD.domain]),
    notes: asString(fields[FIELD.notes]),
    organizationId: asString(fields[FIELD.organizationId]),
    workspaceId: asString(fields[FIELD.workspaceId]),
    mailboxPlane: asMailboxPlane(fields[FIELD.mailboxPlane]),
    trulyInboxWorkspaceId: asString(fields[FIELD.trulyInboxWorkspaceId]),
    cloudflareAccountId: asString(fields[FIELD.cloudflareAccountId]),
    googleAdminTrusted:
      fields[FIELD.googleAdminTrusted] === true || asString(fields[FIELD.googleAdminTrusted]).toLowerCase() === "true",
    namespaceId: asString(fields[FIELD.namespaceId]),
    stage: asString(fields[FIELD.stage]),
    status: asString(fields[FIELD.status]),
    progress: asString(fields[FIELD.progress]),
    blocker: asString(fields[FIELD.blocker]),
    failure: asString(fields[FIELD.failure]),
    nextAction: asString(fields[FIELD.nextAction]),
    workflow: asString(fields[FIELD.workflow]),
    correlationId: asString(fields[FIELD.correlationId]),
    linearIssueId: asString(fields[FIELD.linearIssueId]),
    browserbaseSessionId: asString(fields[FIELD.browserbaseSessionId]),
    updatedAt: asString(fields[FIELD.updatedAt]),
    trustAttemptCount: Number(fields[FIELD.trustAttemptCount] || 0) || 0,
    webhookDeliveryId: asString(fields[FIELD.webhookDeliveryId]),
    failureExecutionId: asString(fields[FIELD.failureExecutionId]),
    adminMailboxEmail: asString(fields[FIELD.adminMailboxEmail]),
    adminMailboxUid: asString(fields[FIELD.adminMailboxUid]),
    linearTeamId: asString(fields[FIELD.linearTeamId]),
    namespaceWorkflowIdsRaw: asString(fields[FIELD.namespaceWorkflowIds]),
    namespaceWorkflowIds,
    connectWorkflowId: resolveConnectWorkflowId(namespaceWorkflowIds),
  };
};
const mapOperationRecord = (record) => {
  const fields = (record && record.fields) || {};
  return {
    recordId: asString(record && record.id),
    fields,
    key: asString(fields[OP_FIELD.key]),
    clientRecordId: asString(fields[OP_FIELD.clientRecordId]),
    namespaceId: asString(fields[OP_FIELD.namespaceId]),
    correlationId: asString(fields[OP_FIELD.correlationId]),
    workflow: asString(fields[OP_FIELD.workflow]),
    status: asString(fields[OP_FIELD.status]),
    stage: asString(fields[OP_FIELD.stage]),
    progress: asString(fields[OP_FIELD.progress]),
    blocker: asString(fields[OP_FIELD.blocker]),
    failure: asString(fields[OP_FIELD.failure]),
    nextAction: asString(fields[OP_FIELD.nextAction]),
    linearIssueId: asString(fields[OP_FIELD.linearIssueId]),
    browserbaseSessionId: asString(fields[OP_FIELD.browserbaseSessionId]),
    updatedAt: asString(fields[OP_FIELD.updatedAt]),
    trustAttemptCount: Number(fields[OP_FIELD.trustAttemptCount] || 0) || 0,
    webhookDeliveryId: asString(fields[OP_FIELD.webhookDeliveryId]),
    failureExecutionId: asString(fields[OP_FIELD.failureExecutionId]),
    adminMailboxEmail: asString(fields[OP_FIELD.adminMailboxEmail]),
    adminMailboxUid: asString(fields[OP_FIELD.adminMailboxUid]),
    linearTeamId: asString(fields[OP_FIELD.linearTeamId]),
    workspaceId: asString(fields[OP_FIELD.workspaceId]),
    trustHistoryStatus: asString(fields[OP_FIELD.trustHistoryStatus]),
    trustCompletedAt: asString(fields[OP_FIELD.trustCompletedAt]),
    connectExecutionId: asString(fields[OP_FIELD.connectExecutionId]),
  };
};
const listByFormula = async (formula, maxRecords = 1) => {
  const { baseId, tableName } = await getRegistry();
  const query = `?filterByFormula=${encodeURIComponent(formula)}&maxRecords=${encodeURIComponent(String(maxRecords))}`;
  const listed = await airtableRequest(tablePath(baseId, tableName, query), "GET");
  const records = Array.isArray(listed.records) ? listed.records.map(mapRecord) : [];
  return { baseId, tableName, records };
};
const listOperationsByFormula = async (formula, maxRecords) => {
  const { baseId, operationsTableName } = await getRegistry();
  if (!operationsTableName) {
    throw new Error("AIRTABLE_OPERATIONS_TABLE_MISSING: store Operations table with setRegistry");
  }
  const limit = Number(maxRecords);
  const hasLimit = Number.isFinite(limit) && limit > 0;
  const records = [];
  let offset = "";
  do {
    let query = `?filterByFormula=${encodeURIComponent(formula)}&pageSize=100`;
    if (hasLimit) query += `&maxRecords=${encodeURIComponent(String(limit))}`;
    if (offset) query += `&offset=${encodeURIComponent(offset)}`;
    const listed = await airtableRequest(tablePath(baseId, operationsTableName, query), "GET");
    const page = Array.isArray(listed.records) ? listed.records.map(mapOperationRecord) : [];
    records.push(...page);
    offset = asString(listed.offset);
    if (hasLimit && records.length >= limit) break;
  } while (offset);
  return {
    baseId,
    tableName: operationsTableName,
    records: hasLimit ? records.slice(0, limit) : records,
  };
};
const listOperationsForClient = async (clientRecordId) => {
  const id = asString(clientRecordId);
  if (!id) return [];
  const listed = await listOperationsByFormula(`{${OP_FIELD.clientRecordId}}='${escapeFormulaValue(id)}'`);
  return listed.records;
};
const patchRecord = async (recordId, fields) => {
  const { baseId, tableName } = await getRegistry();
  const updated = await airtableRequest(tablePath(baseId, tableName, `/${encodeURIComponent(recordId)}`), "PATCH", {
    fields,
    typecast: true,
  });
  return { baseId, tableName, ...mapRecord(updated) };
};
const createRecord = async (fields) => {
  const { baseId, tableName } = await getRegistry();
  const created = await airtableRequest(tablePath(baseId, tableName), "POST", {
    records: [{ fields }],
    typecast: true,
  });
  const record = (created.records && created.records[0]) || {};
  return { baseId, tableName, ...mapRecord(record) };
};
const patchOperationRecord = async (recordId, fields) => {
  const { baseId, operationsTableName } = await getRegistry();
  const updated = await airtableRequest(
    tablePath(baseId, operationsTableName, `/${encodeURIComponent(recordId)}`),
    "PATCH",
    { fields, typecast: true },
  );
  return { baseId, tableName: operationsTableName, ...mapOperationRecord(updated) };
};
const createOperationRecord = async (fields) => {
  const { baseId, operationsTableName } = await getRegistry();
  const created = await airtableRequest(tablePath(baseId, operationsTableName), "POST", {
    records: [{ fields }],
    typecast: true,
  });
  const record = (created.records && created.records[0]) || {};
  return { baseId, tableName: operationsTableName, ...mapOperationRecord(record) };
};
const deleteOperationRecord = async (recordId) => {
  const { baseId, operationsTableName } = await getRegistry();
  await airtableRequest(tablePath(baseId, operationsTableName, `/${encodeURIComponent(recordId)}`), "DELETE");
  return { deleted: true, recordId: asString(recordId) };
};
const getBaseSchema = async (baseId) => airtableRequest(`/meta/bases/${encodeURIComponent(baseId)}/tables`, "GET");
const createField = async (baseId, tableId, spec) =>
  airtableRequest(`/meta/bases/${encodeURIComponent(baseId)}/tables/${encodeURIComponent(tableId)}/fields`, "POST", spec);
const createTable = async (baseId, body) =>
  airtableRequest(`/meta/bases/${encodeURIComponent(baseId)}/tables`, "POST", body);
const ensureTableFields = async (baseId, table, specs) => {
  const existing = Array.isArray(table.fields) ? table.fields : [];
  const existingNames = new Set(existing.map((field) => asString(field.name)));
  const createdFields = [];
  const tableId = asString(table.id);
  for (const spec of specs) {
    if (existingNames.has(spec.name)) continue;
    await createField(baseId, tableId, spec);
    createdFields.push(spec.name);
    existingNames.add(spec.name);
  }
  return { tableId, createdFields, existingFields: Array.from(existingNames) };
};
const resolveOrCreateOperationsTable = async (baseId, schemaTables) => {
  const tables = Array.isArray(schemaTables) ? schemaTables : [];
  let table = tables.find((row) => asString(row.name) === DEFAULT_OPERATIONS_TABLE_NAME);
  let operationsTableCreated = false;
  if (!table) {
    try {
      table = await createTable(baseId, {
        name: DEFAULT_OPERATIONS_TABLE_NAME,
        description: "One row per client operation; no secrets",
        fields: OPERATIONS_FIELD_SPECS,
      });
      operationsTableCreated = true;
    } catch (error) {
      const message = asString(error && error.message) || String(error);
      throw new Error(
        "AIRTABLE_OPERATIONS_TABLE_MISSING: Create an empty Operations table in the organization base (Base creator + schema.bases:write), then re-run setRegistry/ensureRegistrySchema. " +
          `Create-table API failed: ${message}`,
      );
    }
  }
  return { table, operationsTableCreated };
};
const buildGlanceFields = (operations, fallbackStage = "") => {
  const primary = choosePrimaryOperation(operations);
  const updatedAt = utcNowIso();
  if (!primary) {
    return {
      [FIELD.status]: "",
      [FIELD.progress]: "",
      [FIELD.blocker]: "",
      [FIELD.failure]: "",
      [FIELD.nextAction]: "",
      [FIELD.workflow]: "",
      [FIELD.correlationId]: "",
      [FIELD.linearIssueId]: "",
      [FIELD.browserbaseSessionId]: "",
      [FIELD.webhookDeliveryId]: "",
      [FIELD.failureExecutionId]: "",
      [FIELD.trustAttemptCount]: 0,
      [FIELD.updatedAt]: updatedAt,
    };
  }
  const fields = {
    [FIELD.status]: asString(primary.status),
    [FIELD.progress]: asString(primary.progress),
    [FIELD.blocker]: asString(primary.blocker),
    [FIELD.failure]: asString(primary.failure),
    [FIELD.nextAction]: asString(primary.nextAction),
    [FIELD.workflow]: asString(primary.workflow),
    [FIELD.correlationId]: asString(primary.correlationId),
    [FIELD.linearIssueId]: chooseNonEmptyFromOperations(operations, (op) => op.linearIssueId),
    [FIELD.browserbaseSessionId]: chooseNonEmptyFromOperations(operations, (op) => op.browserbaseSessionId),
    [FIELD.webhookDeliveryId]: chooseNonEmptyFromOperations(operations, (op) => op.webhookDeliveryId),
    [FIELD.failureExecutionId]: chooseNonEmptyFromOperations(operations, (op) => op.failureExecutionId),
    [FIELD.trustAttemptCount]: chooseTrustAttemptCount(operations),
    [FIELD.updatedAt]: updatedAt,
  };
  if (asString(primary.stage) || asString(fallbackStage)) {
    fields[FIELD.stage] = asString(primary.stage || fallbackStage);
  }
  return fields;
};
const pruneSucceededOperations = async (clientRecordId) => {
  const operations = await listOperationsForClient(clientRecordId);
  if (operations.length <= MAX_OPERATIONS) return { deleted: 0, retained: operations.length, pruned: false };
  const succeeded = operations
    .filter((operation) => asString(operation.status).toUpperCase() === "SUCCEEDED")
    .sort((left, right) => asString(left.updatedAt).localeCompare(asString(right.updatedAt)));
  const excess = operations.length - MAX_OPERATIONS;
  const toDelete = succeeded.slice(0, Math.min(excess, succeeded.length));
  for (const operation of toDelete) {
    await deleteOperationRecord(operation.recordId);
  }
  return {
    deleted: toDelete.length,
    retained: operations.length - toDelete.length,
    pruned: toDelete.length > 0,
    unsafeToPruneFurther: operations.length - toDelete.length > MAX_OPERATIONS,
  };
};
const attachClientOperations = async (client) => {
  if (!client || !client.recordId) return { ...client, operations: { byKey: {} } };
  const rows = await listOperationsForClient(client.recordId);
  return { ...client, operations: { byKey: operationsToByKey(rows) }, operationRows: rows };
};
const upsertOperationRow = async (fields) => {
  const key = asString(fields[OP_FIELD.key]);
  if (!key) throw new Error("AIRTABLE_REQUEST_FAILED: operation Key is required");
  const existing = await listOperationsByFormula(`{${OP_FIELD.key}}='${escapeFormulaValue(key)}'`, 1);
  if (existing.records[0]) return patchOperationRecord(existing.records[0].recordId, fields);
  return createOperationRecord(fields);
};
