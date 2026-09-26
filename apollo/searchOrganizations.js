/**
 * @description Organization search. POST /mixed_companies/search. https://docs.apollo.io/reference/organization-search
 * @param {Object} input Query parameters use Apollo's names: q_organization_domains_list[] (string[]), organization_num_employees_ranges[] (string[]), organization_locations[] (string[]), organization_not_locations[] (string[]), revenue_range[min] (integer), revenue_range[max] (integer), currently_using_any_of_technology_uids[] (string[]), q_organization_keyword_tags[] (string[]), q_organization_name (string), organization_ids[] (string[]), latest_funding_amount_range[min] (integer), latest_funding_amount_range[max] (integer), total_funding_range[min] (integer), total_funding_range[max] (integer), latest_funding_date_range[min] (string), latest_funding_date_range[max] (string), q_organization_job_titles[] (string[]), organization_job_locations[] (string[]), organization_num_jobs_range[min] (integer), organization_num_jobs_range[max] (integer), organization_job_posted_at_range[min] (string), organization_job_posted_at_range[max] (string), organization_headcount_growth_past_n_months (integer), organization_headcount_growth_range[min] (integer), organization_headcount_growth_range[max] (integer), lookalike_organization_ids[] (string[]), not_organization_websites_list[] (string[]), page (integer), per_page (integer).
 * @returns {Object} Apollo response body.
 * @throws {Error} APOLLO_INVALID_INPUT when input is not an object or a provided value has the wrong type.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function searchOrganizations(input) {
  const req = requireObject(input);
  const query = pickFields(req, [
    ["q_organization_domains_list[]", "string[]"],
    ["organization_num_employees_ranges[]", "string[]"],
    ["organization_locations[]", "string[]"],
    ["organization_not_locations[]", "string[]"],
    ["revenue_range[min]", "integer"],
    ["revenue_range[max]", "integer"],
    ["currently_using_any_of_technology_uids[]", "string[]"],
    ["q_organization_keyword_tags[]", "string[]"],
    ["q_organization_name", "string"],
    ["organization_ids[]", "string[]"],
    ["latest_funding_amount_range[min]", "integer"],
    ["latest_funding_amount_range[max]", "integer"],
    ["total_funding_range[min]", "integer"],
    ["total_funding_range[max]", "integer"],
    ["latest_funding_date_range[min]", "string"],
    ["latest_funding_date_range[max]", "string"],
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
  return apolloRequest(`/mixed_companies/search${buildQuery(query)}`, "POST");
}
