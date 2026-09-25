/**
 * @description Load one Clients row. namespaceId is the Clients key and rejects a mismatched recordId or a duplicate row.
 * Correlation/Linear selectors query the Operations table and return the matched operation.
 * @param {Object} input
 * @param {string} [input.recordId]
 * @param {string} [input.namespaceId]
 * @param {string} [input.linearIssueId]
 * @param {string} [input.correlationId]
 * @returns {Object}
 * @property {string} recordId
 * @property {boolean} found
 */
async function getClient(input) {
  const req = input && typeof input === "object" ? input : {};
  const recordId = asString(req.recordId);
  const namespaceId = asString(req.namespaceId);
  const linearIssueId = asString(req.linearIssueId);
  const correlationId = asString(req.correlationId);
  const registry = await getRegistry();
  if (namespaceId) {
    const listed = await listByFormula(`{${FIELD.namespaceId}}='${escapeFormulaValue(namespaceId)}'`, 2);
    if (listed.records.length > 1) {
      throw new Error("AIRTABLE_REQUEST_FAILED: duplicate client for namespaceId");
    }
    if (!listed.records[0]) {
      return { baseId: listed.baseId, tableName: listed.tableName, found: false, recordId: "" };
    }
    if (recordId && listed.records[0].recordId !== recordId) {
      throw new Error("AIRTABLE_REQUEST_FAILED: recordId does not belong to namespaceId");
    }
    const withOps = await attachClientOperations({
      ...listed.records[0],
      baseId: listed.baseId,
      tableName: listed.tableName,
      found: true,
    });
    return withMatchedOperation(withOps, req);
  }
  if (recordId) {
    const record = await airtableRequest(
      tablePath(registry.baseId, registry.tableName, `/${encodeURIComponent(recordId)}`),
      "GET",
    );
    const withOps = await attachClientOperations({
      baseId: registry.baseId,
      tableName: registry.tableName,
      found: true,
      ...mapRecord(record),
    });
    return withMatchedOperation(withOps, req);
  }
  if (!linearIssueId && !correlationId) {
    throw new Error("AIRTABLE_REQUEST_FAILED: recordId, namespaceId, linearIssueId, or correlationId is required");
  }
  const clauses = [];
  if (linearIssueId) clauses.push(`{${OP_FIELD.linearIssueId}}='${escapeFormulaValue(linearIssueId)}'`);
  if (correlationId) clauses.push(`{${OP_FIELD.correlationId}}='${escapeFormulaValue(correlationId)}'`);
  const formula = clauses.length === 1 ? clauses[0] : `AND(${clauses.join(",")})`;
  const listedOps = await listOperationsByFormula(formula, 20);
  if (!listedOps.records[0]) {
    return {
      baseId: listedOps.baseId,
      tableName: registry.tableName,
      operationsTableName: listedOps.tableName,
      found: false,
      recordId: "",
    };
  }
  const matchedOperation = choosePrimaryOperation(listedOps.records) || listedOps.records[0];
  const clientRecordId = asString(matchedOperation.clientRecordId);
  if (!clientRecordId) {
    return {
      baseId: listedOps.baseId,
      tableName: registry.tableName,
      found: false,
      recordId: "",
      reason: "OPERATION_MISSING_CLIENT_RECORD_ID",
    };
  }
  const clientRecord = await airtableRequest(
    tablePath(registry.baseId, registry.tableName, `/${encodeURIComponent(clientRecordId)}`),
    "GET",
  );
  const withOps = await attachClientOperations({
    baseId: registry.baseId,
    tableName: registry.tableName,
    found: true,
    ...mapRecord(clientRecord),
  });
  return withMatchedOperation(withOps, {
    correlationId: correlationId || asString(matchedOperation.correlationId),
    linearIssueId: linearIssueId || asString(matchedOperation.linearIssueId),
  });
}
