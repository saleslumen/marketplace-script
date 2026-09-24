/**
 * @description Assign missing mailboxes on a Zapmail domain. Requires purchased slots.
 * @param {Object} input
 * @param {string} input.workspaceId
 * @param {string} input.domainName
 * @param {string} input.domainId
 * @param {string|string[]} input.usernames
 */
async function assignMailboxes(input) {
  const req = input && typeof input === "object" ? input : {};
  const workspaceId = asString(req.workspaceId);
  const domainName = asString(req.domainName || req.domain).toLowerCase();
  const domainId = asString(req.domainId);
  const usernames = asCsvList(req.usernames).map((username) => username.toLowerCase());
  const firstNames = asCsvList(req.firstNames);
  const lastNames = asCsvList(req.lastNames);
  if (!workspaceId) throw new Error("ZAPMAIL_REQUEST_FAILED: workspaceId is required");
  if (!domainName) throw new Error("ZAPMAIL_REQUEST_FAILED: domainName is required");
  if (!domainId) throw new Error("ZAPMAIL_REQUEST_FAILED: domainId is required");
  if (!usernames.length) throw new Error("ZAPMAIL_REQUEST_FAILED: usernames is required");
  const mailboxes = usernames.map((username, index) => {
    const parts = username.split(".").filter(Boolean);
    return {
      firstName: firstNames[index] || (parts[0] ? parts[0] : "User"),
      lastName: lastNames[index] || (parts.length > 1 ? parts.slice(1).join(" ") : "Mailbox"),
      mailboxUsername: username,
      domainName,
    };
  });
  const body = { [domainId]: mailboxes };
  const response = await zapmailRequest("/v2/mailboxes", "POST", body, workspaceId);
  return { assigned: mailboxes.length, message: asString(response.message) };
}
