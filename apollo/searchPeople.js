/**
 * @description People API search. POST /mixed_people/api_search. https://docs.apollo.io/reference/people-api-search
 * @param {Object} input Query parameters use Apollo's names: person_titles[] (string[]), include_similar_titles (boolean), q_keywords (string), q_person_name (string), person_locations[] (string[]), person_seniorities[] (string[]), organization_locations[] (string[]), q_organization_domains_list[] (string[]), contact_email_status[] (string[]), organization_ids[] (string[]), organization_num_employees_ranges[] (string[]), revenue_range[min] (integer), revenue_range[max] (integer), currently_using_all_of_technology_uids[] (string[]), currently_using_any_of_technology_uids[] (string[]), currently_not_using_any_of_technology_uids[] (string[]), q_organization_job_titles[] (string[]), organization_job_locations[] (string[]), organization_num_jobs_range[min] (integer), organization_num_jobs_range[max] (integer), organization_job_posted_at_range[min] (string), organization_job_posted_at_range[max] (string), organization_headcount_growth_past_n_months (integer), organization_headcount_growth_range[min] (integer), organization_headcount_growth_range[max] (integer), lookalike_organization_ids[] (string[]), not_organization_websites_list[] (string[]), page (integer), per_page (integer).
 * @returns {Object} Apollo response body, including total_entries and people.
 * @throws {Error} APOLLO_INVALID_INPUT when input is not an object or a provided value has the wrong type.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function searchPeople(input) {
  const req = requireObject(input);
  const query = pickFields(req, [
    ["person_titles[]", "string[]"],
    ["include_similar_titles", "boolean"],
    ["q_keywords", "string"],
    ["q_person_name", "string"],
    ["person_locations[]", "string[]"],
    ["person_seniorities[]", "string[]"],
    ["organization_locations[]", "string[]"],
    ["q_organization_domains_list[]", "string[]"],
    ["contact_email_status[]", "string[]"],
    ["organization_ids[]", "string[]"],
    ["organization_num_employees_ranges[]", "string[]"],
    ["revenue_range[min]", "integer"],
    ["revenue_range[max]", "integer"],
    ["currently_using_all_of_technology_uids[]", "string[]"],
    ["currently_using_any_of_technology_uids[]", "string[]"],
    ["currently_not_using_any_of_technology_uids[]", "string[]"],
    ["q_organization_job_titles[]", "string[]"],
    ["organization_job_locations[]", "string[]"],
    ["organization_num_jobs_range[min]", "integer"],
    ["organization_num_jobs_range[max]", "integer"],
    ["organization_job_posted_at_range[min]", "string"],
    ["organization_job_posted_at_range[max]", "string"],
    ["organization_headcount_growth_past_n_months", "integer"],
    ["organization_headcount_growth_range[min]", "integer"],
    ["organization_headcount_growth_range[max]", "integer"],
    ["lookalike_organization_ids[]", "string[]"],
    ["not_organization_websites_list[]", "string[]"],
    ["page", "integer"],
    ["per_page", "integer"],
  ]);
  return apolloRequest(`/mixed_people/api_search${buildQuery(query)}`, "POST");
}
