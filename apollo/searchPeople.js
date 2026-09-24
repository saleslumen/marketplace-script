/**
 * @description Search Apollo for people with ICP filters. Does not return emails or phones.
 * @param {Object} input - Search filters for Apollo people api_search. Swap per client.
 * @param {string} [input.titles] - Comma-separated job titles, for example "VP Sales,Head of Sales".
 * @param {string} [input.seniorities] - Comma-separated seniorities: owner,founder,c_suite,partner,vp,head,director,manager,senior,entry,intern.
 * @param {string} [input.personLocations] - Comma-separated where people live, for example "United States,United Kingdom".
 * @param {string} [input.organizationLocations] - Comma-separated company HQ locations, for example "California,New York".
 * @param {string} [input.employeeRanges] - Comma-separated headcount ranges as min-max pairs, for example "11-50,51-200".
 * @param {string} [input.domains] - Comma-separated company domains when running an account list, for example "acme.com,example.com".
 * @param {string} [input.keywords] - Free-text keywords across Apollo people/org fields.
 * @param {string} [input.emailStatuses] - Comma-separated email statuses: verified,unverified,likely to engage,unavailable.
 * @param {string} [input.technologies] - Comma-separated tech uids the company uses any of, for example "salesforce,hubspot".
 * @param {boolean} [input.includeSimilarTitles] - Include similar titles when titles are set. Default true.
 * @param {string} [input.page] - Page number, default 1.
 * @param {string} [input.perPage] - Results per page, default 25, max 100.
 * @returns {Object} Search page.
 * @property {string} total - Total matching people reported by Apollo.
 * @property {string} page - Current page.
 * @property {string} perPage - Page size.
 * @property {Object[]} people - Matching people without email or phone.
 * @property {string} people[].id - Apollo person id.
 * @property {string} people[].firstName - First name, or an empty string.
 * @property {string} people[].lastName - Last name when returned, otherwise empty.
 * @property {string} people[].title - Job title, or an empty string.
 * @property {string} people[].company - Company name, or an empty string.
 * @property {boolean} people[].hasEmail - Whether Apollo indicates an email exists.
 * @throws {APOLLO_API_KEY_MISSING} When no Apollo API key is stored.
 * @throws {APOLLO_REQUEST_FAILED} When Apollo rejects or cannot complete the request.
 */
async function searchPeople(input) {
  const req = input && typeof input === "object" ? input : {};
  const pageNumber = Math.max(1, asNumber(req.page) || 1);
  const pageSize = Math.min(100, Math.max(1, asNumber(req.perPage) || 25));
  const titles = asCsvList(req.titles);
  const seniorities = asCsvList(req.seniorities);
  const personLocations = asCsvList(req.personLocations);
  const organizationLocations = asCsvList(req.organizationLocations);
  const domains = asCsvList(req.domains);
  const technologies = asCsvList(req.technologies);
  const employeeRanges = asCsvList(req.employeeRanges);
  const keywords = asString(req.keywords);
  const hasMeaningfulFilter = Boolean(
    titles.length ||
      seniorities.length ||
      personLocations.length ||
      organizationLocations.length ||
      domains.length ||
      technologies.length ||
      employeeRanges.length ||
      keywords,
  );
  if (!hasMeaningfulFilter) {
    return {
      ok: false,
      outcome: "MISSING_FILTERS",
      total: "0",
      page: asString(pageNumber),
      perPage: asString(pageSize),
      people: [],
      failure: "Provide at least one ICP filter: titles, seniorities, locations, domains, employeeRanges, technologies, or keywords",
    };
  }
  const body = { page: pageNumber, per_page: pageSize };
  if (titles.length) body.person_titles = titles;
  if (seniorities.length) body.person_seniorities = seniorities;
  if (personLocations.length) body.person_locations = personLocations;
  if (organizationLocations.length) body.organization_locations = organizationLocations;
  if (domains.length) body.q_organization_domains_list = domains;
  setCsv(body, "contact_email_status", req.emailStatuses);
  if (technologies.length) body.currently_using_any_of_technology_uids = technologies;
  if (keywords) body.q_keywords = keywords;
  if (req.includeSimilarTitles === false || asString(req.includeSimilarTitles) === "false") {
    body.include_similar_titles = false;
  }
  if (employeeRanges.length) {
    body.organization_num_employees_ranges = employeeRanges.map((range) => range.replace(/-/g, ","));
  }
  const response = await apolloRequest("/mixed_people/api_search", "POST", body);
  const people = (response.people || []).map((person) => {
    const organization = person.organization || {};
    return {
      id: asString(person.id),
      firstName: asString(person.first_name),
      lastName: asString(person.last_name || person.last_name_obfuscated),
      title: asString(person.title),
      company: asString(organization.name),
      hasEmail: person.has_email === true,
    };
  });
  return {
    ok: true,
    outcome: "SEARCHED",
    total: asString(response.total_entries ?? people.length),
    page: asString(pageNumber),
    perPage: asString(pageSize),
    people,
    failure: "",
  };
}
