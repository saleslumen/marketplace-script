/**
 * @description List account domains with Namecheap pagination (Page/PageSize).
 * @param {Object} [input]
 * @param {string} [input.searchTerm]
 * @param {number|string} [input.pageSize] - 10..100
 * @returns {Object}
 */
async function listDomains(input) {
  const req = input && typeof input === "object" ? input : {};
  const searchTerm = asString(req.searchTerm || req.SearchTerm);
  const pageSize = Math.min(100, Math.max(10, asNumber(req.pageSize || req.PageSize, 100) || 100));
  const domains = [];
  let page = 1;
  let totalItems = null;
  while (true) {
    const params = { ListType: "ALL", Page: String(page), PageSize: String(pageSize) };
    if (searchTerm) params.SearchTerm = searchTerm;
    const response = await namecheapRequest("namecheap.domains.getList", params);
    const listNode = response.commandResponse && response.commandResponse.DomainGetListResult;
    const rows = asArray(listNode && listNode.Domain);
    for (const row of rows) {
      const attrs = attributeMap(row);
      const name = asString(attrs.Name || attrs.Domain).toLowerCase();
      if (!name) continue;
      domains.push({
        domain: name,
        id: asString(attrs.ID),
        user: asString(attrs.User),
        created: asString(attrs.Created),
        expires: asString(attrs.Expires),
        isExpired: asBoolean(attrs.IsExpired, false),
        isLocked: asBoolean(attrs.IsLocked, false),
        autoRenew: asBoolean(attrs.AutoRenew, false),
        isOurDns: asBoolean(attrs.IsOurDNS, false),
        isPremium: asBoolean(attrs.IsPremium, false),
      });
    }
    const paging = response.commandResponse && response.commandResponse.Paging;
    totalItems = asNumber(paging && textValue(paging.TotalItems), domains.length);
    const currentPage = asNumber(paging && textValue(paging.CurrentPage), page);
    const size = asNumber(paging && textValue(paging.PageSize), pageSize);
    if (!rows.length) break;
    if (totalItems !== null && domains.length >= totalItems) break;
    if (rows.length < size) break;
    page = currentPage + 1;
    if (page > 500) break;
  }
  return { domains, count: domains.length, totalItems: totalItems === null ? domains.length : totalItems };
}
