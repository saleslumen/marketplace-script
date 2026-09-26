/**
 * @description List connected email accounts.
 * @param {Object} [input]
 * @param {string} [input.search]
 * @param {string} [input.sort] createdAt, fromEmail, or fromName.
 * @param {string} [input.sortBy] ASC or DESC.
 * @param {string} [input.status] active, warming, paused, error, or auth-expired.
 * @param {string[]} [input.tags]
 * @returns {Object}
 * @throws {Error} TRULYINBOX_INVALID_INPUT: <reason>
 * @throws {Error} TRULYINBOX_REQUEST_FAILED: <status> <message>
 */
async function listEmailAccounts(input) {
  const req = input === undefined ? {} : requireObjectInput(input);
  const query = trulyinboxQuery({
    search: optionalQueryString(req, "search"),
    sort: optionalQueryString(req, "sort"),
    sortBy: optionalQueryString(req, "sortBy"),
    status: optionalQueryString(req, "status"),
    tags: optionalQueryStrings(req, "tags"),
  });
  return trulyinboxRequest("GET", `/email-accounts${query}`);
}
