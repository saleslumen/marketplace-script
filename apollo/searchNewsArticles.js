/**
 * @description News articles search. POST /news_articles/search. https://docs.apollo.io/reference/news-articles-search
 * @param {Object} input
 * @param {string[]} input.organization_ids[]
 * @param {string[]} [input.categories[]]
 * @param {string} [input.published_at[min]]
 * @param {string} [input.published_at[max]]
 * @param {number} [input.page]
 * @param {number} [input.per_page]
 * @returns {Object} Apollo response body.
 * @throws {Error} APOLLO_INVALID_INPUT when organization_ids[] is missing.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function searchNewsArticles(input) {
  const req = requireObject(input);
  requireStringList(req, "organization_ids[]");
  const query = pickFields(req, [["organization_ids[]", "string[]"], ["categories[]", "string[]"], ["published_at[min]", "string"], ["published_at[max]", "string"], ["page", "integer"], ["per_page", "integer"]]);
  return apolloRequest(`/news_articles/search${buildQuery(query)}`, "POST");
}
