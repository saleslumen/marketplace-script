/**
 * @description List Zapmail mailboxes in a workspace. Never returns passwords or secrets.
 * @param {Object} input
 * @param {string} input.workspaceId
 * @param {string} [input.domain]
 * @param {string} [input.page]
 * @param {string} [input.limit]
 * @returns {Object}
 */
async function listMailboxes(input) {
  const req = input && typeof input === "object" ? input : {};
  const workspaceId = asString(req.workspaceId);
  if (!workspaceId) throw new Error("ZAPMAIL_REQUEST_FAILED: workspaceId is required");
  const params = [];
  if (asString(req.page)) params.push(`page=${encodeURIComponent(asString(req.page))}`);
  if (asString(req.limit)) params.push(`limit=${encodeURIComponent(asString(req.limit))}`);
  if (asString(req.domain || req.contains)) params.push(`contains=${encodeURIComponent(asString(req.domain || req.contains))}`);
  const query = params.length ? `?${params.join("&")}` : "";
  const response = await zapmailRequest(`/v2/mailboxes/list${query}`, "GET", undefined, workspaceId);
  const data = response.data || {};
  return {
    mailboxes: flattenMailboxes(data),
    totalPages: asNumber(data.totalPages, 1),
    currentPage: asNumber(data.currentPage, 1),
    totalActiveMailboxes: asNumber(data.totalActiveMailboxes, 0),
  };
}
