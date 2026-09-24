/**
 * @description Graph spine: submit Export People with Email once, then only poll statistics and fetch inquiries.
 * @param {Object} input - ICP filters plus trackId / inquiryPage.
 * @param {string} [input.titles]
 * @param {string} [input.seniorities]
 * @param {string} [input.personLocations]
 * @param {string} [input.organizationLocations]
 * @param {string} [input.employeeRanges]
 * @param {string} [input.domains]
 * @param {string} [input.keywords]
 * @param {string} [input.trackId] - When set, never POST /v1/people/export again.
 * @param {string} [input.inquiryPage] - Zero-based inquiry page after DONE.
 * @param {string} [input.size] - Export size on submit (default 25, max 10000) or inquiry page size (max 100).
 * @param {string} [input.webhook] - Optional HTTPS callback; polling is the graph owner.
 * @returns {Object}
 * @property {boolean} ok - True only for EXPORTED or EXPORTED_PARTIAL.
 * @property {string} outcome - MISSING_FILTERS, EXPORT_PENDING, EXPORT_FAILED, EXPORT_EMPTY, EXPORTED, EXPORTED_PARTIAL.
 * @property {Object[]} people - { email, firstName, lastName, title, company } for upsertPeopleByEmailBatch.
 * @property {boolean} complete
 * @property {boolean} hasMore
 * @property {string} nextPage
 * @property {string} trackId
 * @property {number} withEmail
 * @property {number} withoutEmail
 * @property {string} failure
 * @throws {AIARK_API_KEY_MISSING} When no AI Ark API key is stored.
 * @throws {AIARK_REQUEST_FAILED} When AI Ark rejects or cannot complete the request.
 */
async function ensurePeopleExport(input) {
  const req = input && typeof input === "object" ? input : {};
  const trackId = asString(req.trackId);
  const inquiryPage = Math.max(0, asNumber(req.inquiryPage, 0));
  const submitSize = exportPageSize(req.size || req.perPage, 25, 10000);
  const inquirySize = exportPageSize(req.inquirySize || req.size || req.perPage, 25, 100);
  if (!trackId) return submitPeopleExport(req, submitSize);
  const status = await getExportStatus({ trackId });
  if (status.outcome === "EXPORT_PENDING") return pendingExportResult(trackId, { inquiryPage: String(inquiryPage), state: status.state, total: status.total, failure: status.failure });
  if (status.outcome === "EXPORT_FAILED") return failedExportResult(trackId, status.failure, { state: status.state, inquiryPage: String(inquiryPage), total: status.total });
  if (status.outcome === "EXPORT_EMPTY") return failedExportResult(trackId, status.failure, { outcome: "EXPORT_EMPTY", complete: true, state: status.state, inquiryPage: String(inquiryPage), total: status.total });
  const inquiries = await listExportInquiries({ trackId, page: String(inquiryPage), size: String(inquirySize) });
  if (inquiries.outcome === "EXPORT_PENDING") return pendingExportResult(trackId, { inquiryPage: String(inquiryPage), nextPage: String(inquiryPage), failure: inquiries.failure });
  if (inquiries.outcome === "EXPORT_FAILED") return failedExportResult(trackId, inquiries.failure, { inquiryPage: String(inquiryPage) });
  const collected = collectExportPage(inquiries, trackId);
  if (collected.outcome === "EXPORT_PENDING") return collected;
  if (!collected.people.length && !collected.hasMore) {
    return failedExportResult(trackId, "Export finished with no enrollable people", { outcome: "EXPORT_EMPTY", complete: true, inquiryPage: String(inquiryPage), withoutEmail: collected.withoutEmail, total: collected.total, state: "DONE" });
  }
  return collected;
}
