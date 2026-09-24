/**
 * @description Add Client ID, then submit one fresh consent URL per mailbox that still needs Emails connect.
 * @param {Object} input
 * @param {string} input.workspaceId
 * @param {string} input.clientId
 * @param {string} input.appName
 * @param {Object[]} input.mailboxes
 * @param {string|string[]} input.consentUrls
 */
async function initiateConsentsForMailboxes(input) {
  const req = input && typeof input === "object" ? input : {};
  const workspaceId = asString(req.workspaceId);
  const mailboxes = parseJsonArray(req.mailboxes);
  const domainIds = [...new Set(mailboxes.map((mailbox) => asString(mailbox.domainId)).filter(Boolean))];
  if (domainIds.length) {
    try {
      await addGoogleClientId({
        workspaceId,
        domainIds,
        clientId: req.clientId,
        app: req.appName || req.app,
      });
    } catch (error) {
      const pending = isAdminMailboxPendingError(error) || isRetryableRequestError(error);
      return {
        ok: false,
        outcome: pending ? "CLIENT_ID_PENDING" : "CLIENT_ID_FAILED",
        exportId: "",
        retryable: pending,
        failure: asString(error && error.message) || "Zapmail add-client-id failed",
      };
    }
  }
  return initiateCustomOAuth(req);
}
