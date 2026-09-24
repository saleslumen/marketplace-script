/**
 * @description Find or create one Clients row keyed by Namespace ID.
 * @param {Object} input
 * @param {string} input.namespaceId
 * @param {string} [input.customerName]
 * @param {string} [input.customerDomain]
 * @param {string} [input.organizationId]
 * @param {string} [input.notes]
 * @param {string} [input.workspaceId] - Persists Clients `Mailbox Workspace ID`
 * @param {string} [input.mailboxPlane] - Persists Clients `Mailbox Plane` (`zapmail` or `inboxkit`)
 * @param {string} [input.trulyInboxWorkspaceId] - Persists Clients `TrulyInbox Workspace ID`
 * @param {string} [input.cloudflareAccountId] - Persists Clients `Cloudflare Account ID`
 * @param {string} [input.stage]
 * @param {string} [input.correlationId]
 * @returns {Object}
 * @property {string} recordId
 * @property {string} namespaceId
 * @property {boolean} created
 */
async function upsertClient(input) {
  const req = input && typeof input === "object" ? input : {};
  const namespaceId = asString(req.namespaceId);
  if (!namespaceId) throw new Error("AIRTABLE_REQUEST_FAILED: namespaceId is required");
  const existing = await listByFormula(`{${FIELD.namespaceId}}='${escapeFormulaValue(namespaceId)}'`, 1);
  const fields = {
    [FIELD.namespaceId]: namespaceId,
    [FIELD.updatedAt]: utcNowIso(),
  };
  if (asString(req.customerName)) fields[FIELD.name] = asString(req.customerName);
  if (asString(req.customerDomain)) fields[FIELD.domain] = asString(req.customerDomain);
  if (asString(req.organizationId)) fields[FIELD.organizationId] = asString(req.organizationId);
  if (asString(req.notes)) fields[FIELD.notes] = asString(req.notes);
  const mailboxPlane = resolveMailboxPlane(req.mailboxPlane, existing.records[0] && existing.records[0].mailboxPlane, "AIRTABLE_REQUEST_FAILED");
  if (asString(req.workspaceId)) fields[FIELD.workspaceId] = asString(req.workspaceId);
  if (mailboxPlane) fields[FIELD.mailboxPlane] = mailboxPlane;
  if (asString(req.trulyInboxWorkspaceId)) fields[FIELD.trulyInboxWorkspaceId] = asString(req.trulyInboxWorkspaceId);
  if (asString(req.cloudflareAccountId)) fields[FIELD.cloudflareAccountId] = asString(req.cloudflareAccountId);
  if (asString(req.stage)) fields[FIELD.stage] = asString(req.stage);
  if (asString(req.correlationId)) fields[FIELD.correlationId] = asString(req.correlationId);
  if (asString(req.linearTeamId)) fields[FIELD.linearTeamId] = asString(req.linearTeamId);
  if (req.googleAdminTrusted === true || asString(req.googleAdminTrusted).toLowerCase() === "true") {
    fields[FIELD.googleAdminTrusted] = true;
  }
  if (existing.records[0]) {
    const patched = await patchRecord(existing.records[0].recordId, fields);
    return { ...patched, created: false };
  }
  if (!fields[FIELD.name]) fields[FIELD.name] = namespaceId;
  if (!fields[FIELD.stage]) fields[FIELD.stage] = "onboard";
  if (!fields[FIELD.status]) fields[FIELD.status] = "QUEUED";
  const created = await createRecord(fields);
  return { ...created, created: true };
}
