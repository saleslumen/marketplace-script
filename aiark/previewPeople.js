/**
 * @description Cheap ICP filter check via People Preview. Masked last names; no emails; no trackId.
 * @param {Object} input - Same ICP filters as searchPeople.
 * @param {string} [input.page] - Zero-based page, default 0.
 * @param {string} [input.size] - Page size, default 25, max 100.
 * @returns {Object} Preview page.
 * @property {boolean} ok
 * @property {string} outcome - PREVIEWED or MISSING_FILTERS.
 * @property {Object[]} people - Preview people without email.
 * @throws {AIARK_API_KEY_MISSING} When no AI Ark API key is stored.
 * @throws {AIARK_REQUEST_FAILED} When AI Ark rejects or cannot complete the request.
 */
async function previewPeople(input) {
  const req = input && typeof input === "object" ? input : {};
  const pageNumber = Math.max(0, asNumber(req.page, 0));
  const pageSize = exportPageSize(req.size || req.perPage, 25, 100);
  const filters = buildPeopleFilters(req);
  if (!filters.hasFilter) return missingFiltersResult({ inquiryPage: String(pageNumber) });
  const classified = await aiarkRequest("/v1/people/preview", "POST", { ...filters.body, page: pageNumber, size: pageSize });
  if (classified.notFound) {
    return {
      ok: true,
      outcome: "PREVIEWED",
      total: "0",
      page: String(pageNumber),
      size: String(pageSize),
      people: [],
      failure: "",
    };
  }
  if (classified.status < 200 || classified.status >= 300) throwClassified(classified);
  const people = mapPeopleList(classified.body).map(mapSearchPerson);
  return {
    ok: true,
    outcome: "PREVIEWED",
    total: asString(classified.body.totalElements ?? people.length),
    page: String(pageNumber),
    size: String(pageSize),
    people,
    failure: "",
  };
}
