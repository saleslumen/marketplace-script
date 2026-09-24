/**
 * @description Fetch one Export People with Email inquiry page. 409 means the job is still running.
 * @param {Object} input
 * @param {string} input.trackId
 * @param {string} [input.page] - Zero-based inquiry page, default 0.
 * @param {string} [input.size] - Page size, default 25, max 100.
 * @returns {Object} Inquiry page mapped for campaign upsert. PROCESSING emails are EXPORT_PENDING.
 * @throws {AIARK_API_KEY_MISSING} When no AI Ark API key is stored.
 * @throws {AIARK_REQUEST_FAILED} When AI Ark rejects or cannot complete the request.
 */
async function listExportInquiries(input) {
  const req = input && typeof input === "object" ? input : {};
  const trackId = asString(req.trackId);
  const pageNumber = Math.max(0, asNumber(req.page, 0));
  const pageSize = exportPageSize(req.size || req.perPage, 25, 100);
  if (!trackId) {
    return { ok: false, outcome: "EXPORT_FAILED", trackId: "", page: String(pageNumber), size: String(pageSize), last: true, people: [], failure: "trackId is required" };
  }
  const classified = await aiarkRequest(`/v1/people/export/${encodeURIComponent(trackId)}/inquiries`, "GET", undefined, { page: pageNumber, size: pageSize });
  if (classified.conflict) {
    return {
      ok: false,
      outcome: "EXPORT_PENDING",
      trackId,
      page: String(pageNumber),
      size: String(pageSize),
      last: false,
      totalPages: 0,
      totalElements: 0,
      people: [],
      failure: classified.message || "Export results not ready (409); poll statistics then retry",
    };
  }
  if (isStuckRefund(classified)) {
    return { ok: false, outcome: "EXPORT_FAILED", trackId, page: String(pageNumber), size: String(pageSize), last: true, people: [], failure: classified.message || "Export trackId was auto-refunded (STUCK_*)" };
  }
  if (classified.notFound) {
    return { ok: false, outcome: "EXPORT_FAILED", trackId, page: String(pageNumber), size: String(pageSize), last: true, people: [], failure: classified.message || "trackId not found or expired" };
  }
  if (classified.status < 200 || classified.status >= 300) throwClassified(classified);
  const raw = mapPeopleList(classified.body);
  if (raw.some(isEmailProcessing)) {
    return {
      ok: false,
      outcome: "EXPORT_PENDING",
      trackId,
      page: String(pageNumber),
      size: String(pageSize),
      last: false,
      totalPages: asNumber(classified.body.totalPages, 0),
      totalElements: asNumber(classified.body.totalElements, raw.length),
      people: [],
      failure: "Inquiry page still has PROCESSING emails; rerun the same trackId and inquiryPage (do not POST export again)",
    };
  }
  const rows = raw.map(mapExportPerson);
  const explicitLast = classified.body.last;
  const totalPages = asNumber(classified.body.totalPages);
  let last = false;
  if (explicitLast === true) last = true;
  else if (explicitLast === false) last = false;
  else if (totalPages !== undefined) last = totalPages <= pageNumber + 1;
  else last = rows.length < pageSize;
  return {
    ok: true,
    outcome: last ? "EXPORTED" : "EXPORTED_PARTIAL",
    trackId: asString(classified.body.trackId) || trackId,
    page: String(asNumber(classified.body.number, pageNumber)),
    size: String(pageSize),
    last,
    totalPages: asNumber(classified.body.totalPages, last ? pageNumber + 1 : pageNumber + 2),
    totalElements: asNumber(classified.body.totalElements, rows.length),
    people: rows,
    failure: "",
  };
}
