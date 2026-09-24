/**
 * @description Create a contact verification from a CSV that includes an email field.
 * @param {Object} input
 * @returns {Object}
 */
async function createContactVerification(input) {
  const req = input && typeof input === "object" ? input : {};
  const csvRaw = firstPresent(req, ["csv"]);
  const csv = csvRaw && typeof csvRaw === "object" && Object.prototype.hasOwnProperty.call(csvRaw, "content") ? csvRaw : (asString(csvRaw) ? { content: asString(csvRaw), filename: "contacts.csv" } : undefined);
  if (!csv || !asString(csv.content)) return missingInput("csv");
  const name = asString(firstPresent(req, ["name"]));
  if (!name) return missingInput("name");
  const body = {};
  body.csv = csv;
  body.name = name;
  return classifiedResult(classifyHttp(await emailguardRequestRaw("/api/v1/contact-verification", "POST", body, { auth: true, multipart: true })), "CONTACT_VERIFICATION_CREATED", "CONTACT_VERIFICATION_CREATE_FAILED");
}
