/**
 * @description List suppressions.
 * @param {Object} [input]
 * @param {number} [input.page_size] Bounded page size. Default 50, maximum 200.
 * @param {string} [input.page_token] Opaque page token.
 * @param {string} [input.email_address] Email address.
 * @returns {Object} Suppression page.
 * @throws {Error} The Campaigns service returned status 400 or higher.
 */
async function listSuppressions(input) {
  return Campaigns.listSuppressions(input);
}
