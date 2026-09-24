/**
 * @description Search AI Ark people. Does not return emails. Returns a single-use trackId (6h) for email finding.
 * @param {Object} input - ICP filters mapped onto AI Ark contact/account bodies.
 * @param {string} [input.titles] - Comma-separated job titles.
 * @param {string} [input.seniorities] - Comma-separated seniorities (AI Ark enum after normalize).
 * @param {string} [input.personLocations] - Comma-separated where people live.
 * @param {string} [input.organizationLocations] - Comma-separated company office locations.
 * @param {string} [input.employeeRanges] - Comma-separated headcount ranges as min-max pairs, for example "11-50,51-200".
 * @param {string} [input.domains] - Comma-separated company domains.
 * @param {string} [input.keywords] - Free-text mapped to account.industries WORD.
 * @param {string} [input.page] - Zero-based page, default 0.
 * @param {string} [input.size] - Results per page, default 25, max 100.
 * @returns {Object} Search page.
 * @property {string} trackId - Single-use People Search trackId, or empty.
 * @throws {AIARK_API_KEY_MISSING} When no AI Ark API key is stored.
 * @throws {AIARK_REQUEST_FAILED} When AI Ark rejects or cannot complete the request.
 */
async function searchPeople(input) {
  const req = input && typeof input === "object" ? input : {};
  const pageNumber = Math.max(0, asNumber(req.page, 0));
  const pageSize = exportPageSize(req.size || req.perPage, 25, 100);
  const filters = buildPeopleFilters(req);
  if (!filters.hasFilter) return missingFiltersResult({ inquiryPage: String(pageNumber) });
  const classified = await aiarkRequest("/v1/people", "POST", { ...filters.body, page: pageNumber, size: pageSize });
  if (classified.notFound) {
    return {
      ok: true,
      outcome: "SEARCHED",
      total: "0",
      page: String(pageNumber),
      size: String(pageSize),
      trackId: "",
      people: [],
      failure: "",
    };
  }
  if (classified.status < 200 || classified.status >= 300) throwClassified(classified);
  const people = mapPeopleList(classified.body).map(mapSearchPerson);
  return {
    ok: true,
    outcome: "SEARCHED",
    total: asString(classified.body.totalElements ?? people.length),
    page: String(pageNumber),
    size: String(pageSize),
    trackId: asString(classified.body.trackId),
    people,
    failure: "",
  };
}
