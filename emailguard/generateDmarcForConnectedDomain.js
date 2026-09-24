/**
 * @description Generate a DMARC record for a connected domain with a random DMARC inbox name.
 * @param {Object} input
 * @returns {Object}
 */
async function generateDmarcForConnectedDomain(input) {
  const req = input && typeof input === "object" ? input : {};
  const domain_uuid = asString(firstPresent(req, ["domain_uuid", "domainUuid"]));
  if (!domain_uuid) return missingInput("domain_uuid");
  const policy = asString(firstPresent(req, ["policy"]));
  if (!policy) return missingInput("policy");
  const body = {};
  body.domain_uuid = domain_uuid;
  body.policy = policy;
  return runAuthed("/api/v1/email-authentication/dmarc-connected-domain", "POST", body, "DMARC_CONNECTED", "DMARC_CONNECTED_FAILED");
}
