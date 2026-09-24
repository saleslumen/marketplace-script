/**
 * @description Search then enrich each person (Apollo-only). Returns people with emails when Apollo provides them.
 * @param {Object} input - Same filters as searchPeople.
 * @returns {Object}
 * @property {boolean} ok
 * @property {Object[]} people - Enriched people (may include empty email)
 * @property {number} searched
 * @property {number} enriched
 * @property {number} withEmail
 * @property {number} withoutEmail
 */
async function searchAndEnrichPeople(input) {
  const req = input && typeof input === "object" ? input : {};
  const startPage = Math.max(1, asNumber(req.page) || 1);
  const pageSize = Math.min(100, Math.max(1, asNumber(req.perPage) || 25));
  const maxPages = Math.max(1, asNumber(req.maxPages) || 1);
  const allPages = req.allPages === true || asString(req.allPages).toLowerCase() === "true";
  const pageBudget = allPages ? Math.min(50, maxPages > 1 ? maxPages : 50) : maxPages;
  const people = [];
  let enriched = 0;
  let withEmail = 0;
  let withoutEmail = 0;
  let searchedCount = 0;
  let total = "0";
  let lastPage = startPage;
  let pagesFetched = 0;
  for (let offset = 0; offset < pageBudget; offset += 1) {
    const pageNumber = startPage + offset;
    const searched = await searchPeople({ ...req, page: String(pageNumber), perPage: String(pageSize) });
    if (!searched.ok) {
      return {
        ok: false,
        outcome: searched.outcome,
        people: [],
        searched: 0,
        enriched: 0,
        withEmail: 0,
        withoutEmail: 0,
        total: searched.total || "0",
        page: String(pageNumber),
        perPage: String(pageSize),
        pagesFetched,
        complete: false,
        hasMore: false,
        nextPage: "",
        failure: searched.failure,
      };
    }
    total = searched.total || total;
    lastPage = pageNumber;
    pagesFetched += 1;
    const pagePeople = searched.people || [];
    searchedCount += pagePeople.length;
    for (const row of pagePeople) {
      try {
        const person = await enrichPerson({
          personId: row.id,
          firstName: row.firstName,
          lastName: row.lastName,
        });
        enriched += 1;
        const email = asString(person.email);
        if (email) withEmail += 1;
        else withoutEmail += 1;
        people.push({
          id: asString(person.id || row.id),
          email,
          firstName: asString(person.firstName || row.firstName),
          lastName: asString(person.lastName || row.lastName),
          title: asString(person.title || row.title),
          company: asString(person.company || row.company),
          website: asString(person.website),
        });
      } catch (error) {
        withoutEmail += 1;
        people.push({
          id: asString(row.id),
          email: "",
          firstName: asString(row.firstName),
          lastName: asString(row.lastName),
          title: asString(row.title),
          company: asString(row.company),
          website: "",
          enrichFailure: asString(error && error.message) || "enrich failed",
        });
      }
    }
    const totalNumber = Number(total) || 0;
    const exhausted = !pagePeople.length || (totalNumber > 0 && pageNumber * pageSize >= totalNumber);
    if (exhausted) {
      return {
        ok: true,
        outcome: "SEARCHED_AND_ENRICHED",
        people,
        searched: searchedCount,
        enriched,
        withEmail,
        withoutEmail,
        total,
        page: String(startPage),
        lastPage: String(lastPage),
        perPage: String(pageSize),
        pagesFetched,
        complete: true,
        hasMore: false,
        nextPage: "",
        failure: "",
      };
    }
  }
  const totalNumber = Number(total) || 0;
  const covered = lastPage * pageSize;
  const hasMore = totalNumber === 0 ? searchedCount >= pageSize * pagesFetched : covered < totalNumber;
  return {
    ok: true,
    outcome: hasMore ? "SEARCHED_AND_ENRICHED_PARTIAL" : "SEARCHED_AND_ENRICHED",
    people,
    searched: searchedCount,
    enriched,
    withEmail,
    withoutEmail,
    total,
    page: String(startPage),
    lastPage: String(lastPage),
    perPage: String(pageSize),
    pagesFetched,
    complete: !hasMore,
    hasMore,
    nextPage: hasMore ? String(lastPage + 1) : "",
    failure: hasMore ? `More Apollo pages remain; nextPage=${lastPage + 1}` : "",
  };
}
