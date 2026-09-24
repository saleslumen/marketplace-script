/**
 * @description Store organization Airtable base/table identifiers and ensure Clients + Operations schema.
 * @param {Object} input
 * @param {string} input.baseId
 * @param {string} [input.tableName] - Defaults to Clients
 * @param {string} [input.tableId] - Optional; resolved from schema when omitted
 * @param {boolean|string} [input.ensureSchema] - Default true
 * @returns {Object}
 * @property {boolean} success
 * @property {string} baseId
 * @property {string} tableName
 * @property {string} tableId
 * @property {string} operationsTableName
 * @property {string} operationsTableId
 */
async function setRegistry(input) {
  const req = input && typeof input === "object" ? input : {};
  const baseId = asString(req.baseId);
  const tableName = asString(req.tableName) || DEFAULT_TABLE_NAME;
  if (!baseId) throw new Error("AIRTABLE_REGISTRY_MISSING: baseId is required");
  const vault = VaultService.getUserVault();
  await vault.setProperty(AIRTABLE_BASE_ID_PROPERTY, baseId);
  await vault.setProperty(AIRTABLE_TABLE_NAME_PROPERTY, tableName);
  await vault.setProperty(AIRTABLE_OPERATIONS_TABLE_NAME_PROPERTY, DEFAULT_OPERATIONS_TABLE_NAME);
  let tableId = asString(req.tableId);
  if (!tableId) {
    const schema = await getBaseSchema(baseId);
    const tables = Array.isArray(schema.tables) ? schema.tables : [];
    const table = tables.find((row) => asString(row.name) === tableName || asString(row.id) === tableName);
    if (!table) throw new Error(`AIRTABLE_REGISTRY_MISSING: table ${tableName} not found in base`);
    tableId = asString(table.id);
  }
  await vault.setProperty(AIRTABLE_TABLE_ID_PROPERTY, tableId);
  const ensureSchema = req.ensureSchema !== false && asString(req.ensureSchema).toLowerCase() !== "false";
  let schemaResult = {
    ensured: false,
    createdFields: [],
    createdOperationsFields: [],
    operationsTableName: DEFAULT_OPERATIONS_TABLE_NAME,
    operationsTableId: "",
  };
  if (ensureSchema) schemaResult = await ensureRegistrySchema({ baseId, tableId, tableName });
  return { success: true, baseId, tableName, tableId, ...schemaResult };
}
