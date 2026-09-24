/**
 * @description Ensure Clients and Operations tables/fields via Airtable metadata APIs.
 * Creates Operations when missing (schema.bases:write + Base creator). If create-table fails, requires a human-created empty Operations table.
 * @param {Object} [input]
 * @param {string} [input.baseId]
 * @param {string} [input.tableId]
 * @param {string} [input.tableName]
 * @returns {Object}
 * @property {boolean} ensured
 * @property {string[]} createdFields
 * @property {string[]} createdOperationsFields
 */
async function ensureRegistrySchema(input) {
  const req = input && typeof input === "object" ? input : {};
  const registry = await getRegistry();
  const baseId = asString(req.baseId) || registry.baseId;
  let tableId = asString(req.tableId) || registry.tableId;
  const tableName = asString(req.tableName) || registry.tableName || DEFAULT_TABLE_NAME;
  const schema = await getBaseSchema(baseId);
  const tables = Array.isArray(schema.tables) ? schema.tables : [];
  let clientsTable = tables.find((row) => asString(row.id) === tableId);
  if (!clientsTable) clientsTable = tables.find((row) => asString(row.name) === tableName);
  if (!clientsTable) throw new Error(`AIRTABLE_REGISTRY_MISSING: table ${tableName} not found in base`);
  tableId = asString(clientsTable.id);
  const vault = VaultService.getUserVault();
  await vault.setProperty(AIRTABLE_TABLE_ID_PROPERTY, tableId);
  await vault.setProperty(AIRTABLE_OPERATIONS_TABLE_NAME_PROPERTY, DEFAULT_OPERATIONS_TABLE_NAME);
  const clientsEnsure = await ensureTableFields(baseId, clientsTable, REGISTRY_FIELD_SPECS);
  const { table: operationsTable, operationsTableCreated } = await resolveOrCreateOperationsTable(baseId, tables);
  let operationsEnsure;
  if (operationsTableCreated) {
    operationsEnsure = {
      tableId: asString(operationsTable.id),
      createdFields: OPERATIONS_FIELD_SPECS.map((spec) => spec.name),
      existingFields: OPERATIONS_FIELD_SPECS.map((spec) => spec.name),
    };
  } else {
    operationsEnsure = await ensureTableFields(baseId, operationsTable, OPERATIONS_FIELD_SPECS);
  }
  await vault.setProperty(AIRTABLE_OPERATIONS_TABLE_ID_PROPERTY, operationsEnsure.tableId);
  return {
    ensured: true,
    baseId,
    tableId,
    tableName: asString(clientsTable.name) || tableName,
    operationsTableId: operationsEnsure.tableId,
    operationsTableName: asString(operationsTable.name) || DEFAULT_OPERATIONS_TABLE_NAME,
    operationsTableCreated,
    createdFields: clientsEnsure.createdFields,
    existingFields: clientsEnsure.existingFields,
    createdOperationsFields: operationsEnsure.createdFields,
    existingOperationsFields: operationsEnsure.existingFields,
  };
}
