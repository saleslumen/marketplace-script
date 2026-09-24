/**
 * @description Buy and schedule InboxKit mailboxes on a domain already in the workspace.
 * @param {Object} input
 * @param {string} input.workspaceId
 * @param {string} input.domainName
 * @param {string} input.usernames
 * @param {string} [input.firstNames]
 * @param {string} [input.lastNames]
 * @param {string} [input.platform]
 * @param {string} [input.useWalletBalance]
 * @returns {Object}
 */
async function buyMailboxes(input) {
  const req = input && typeof input === "object" ? input : {};
  const workspaceId = asString(req.workspaceId);
  const domainName = asString(req.domainName || req.domain).toLowerCase();
  const platform = (asString(req.platform) || "GOOGLE").toUpperCase();
  const usernames = asCsvList(req.usernames);
  const firstNames = asCsvList(req.firstNames);
  const lastNames = asCsvList(req.lastNames);
  if (!workspaceId) throw new Error("INBOXKIT_REQUEST_FAILED: workspaceId is required");
  if (!domainName) throw new Error("INBOXKIT_REQUEST_FAILED: domainName is required");
  if (!usernames.length) throw new Error("INBOXKIT_REQUEST_FAILED: usernames is required");
  if (!["GOOGLE", "MICROSOFT", "AZURE"].includes(platform)) {
    throw new Error("INBOXKIT_REQUEST_FAILED: platform must be GOOGLE, MICROSOFT, or AZURE");
  }
  const mailboxes = usernames.map((username, index) => {
    const local = username.toLowerCase();
    const parts = local.split(".").filter(Boolean);
    const firstName = firstNames[index] || (parts[0] ? parts[0] : "User");
    const lastName = lastNames[index] || (parts.length > 1 ? parts.slice(1).join(" ") : "Mailbox");
    return {
      first_name: firstName,
      last_name: lastName,
      username: local,
      platform,
      domain_name: domainName,
    };
  });
  const body = {
    mailboxes,
    use_wallet_balance: asBoolean(req.useWalletBalance, false),
  };
  const response = await inboxKitRequest("/v1/api/mailboxes/buy", "POST", body, workspaceId);
  if (response.error) throw new Error(`INBOXKIT_REQUEST_FAILED: ${asString(response.message) || "buy failed"}`);
  const scheduled = (response.mailboxes || []).map((mailbox) => {
    const username = asString(mailbox.username);
    const domain = asString(mailbox.domain_name || domainName);
    return {
      uid: asString(mailbox.uid),
      username,
      domainName: domain,
      email: username && domain ? `${username}@${domain}` : "",
      firstName: asString(mailbox.first_name),
      lastName: asString(mailbox.last_name),
      platform: asString(mailbox.platform || platform),
      status: asString(mailbox.status),
      renewalCycle: asString(mailbox.renewal_cycle),
    };
  });
  return {
    mailboxes: scheduled,
    count: scheduled.length,
    message: asString(response.message),
    domainName,
    platform,
    useWalletBalance: body.use_wallet_balance,
  };
}
