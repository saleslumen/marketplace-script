/**
 * @description Generate a DMARC record for another domain with a specified reporting address.
 * @param {Object} input
 * @returns {Object}
 */
async function generateDmarcForAnotherDomain(input) {
  const req = input && typeof input === "object" ? input : {};
  const domain = asString(firstPresent(req, ["domain"]));
  if (!domain) return missingInput("domain");
  const policy = asString(firstPresent(req, ["policy"]));
  if (!policy) return missingInput("policy");
  const rua = asString(firstPresent(req, ["rua"]));
  if (!rua) return missingInput("rua");
  const body = {};
  body.domain = domain;
  body.policy = policy;
  body.rua = rua;
  return runAuthed("/api/v1/email-authentication/dmarc-another-domain", "POST", body, "DMARC_ANOTHER", "DMARC_ANOTHER_FAILED");
}
