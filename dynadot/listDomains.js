/**
 * @description List account domains via official API3 GET /api3.json?command=list_domain.
 * @param {Object} [input]
 * @returns {Object}
 */
async function listDomains(input) {
  const raw = await dynadotApi3Raw("list_domain");
  const classified = classifiedApi3(raw, "DOMAINS", "LIST_FAILED");
  if (!classified.ok) return { ...classified, domains: [], count: 0 };
  const rows = listDomainRows(classified.data);
  const domains = [];
  for (const row of rows) {
    const name = domainRowName(row);
    if (!name) continue;
    const detail = row.Domain && typeof row.Domain === "object" ? row.Domain : row;
    domains.push({
      domain: name,
      expirationDate: detail.Expiration || detail.expiration,
      registrationDate: detail.Registration || detail.registration,
      status: asString(detail.Status || detail.status),
      folderName: asString(detail.Folder && detail.Folder.FolderName),
      detail,
    });
  }
  return { domains, count: domains.length, totalItems: domains.length, ok: true, outcome: "DOMAINS", failure: "" };
}
