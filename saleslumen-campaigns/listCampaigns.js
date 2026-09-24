/**
 * @description List campaigns newest first.
 * @param {Object} [input]
 * @param {number} [input.page_size] Bounded page size. Default 50, maximum 200.
 * @param {string} [input.page_token] Opaque page token.
 * @param {string} [input.visibility] UNARCHIVED, ARCHIVED, or ALL.
 * @returns {Object} Campaign page.
 * @throws {Error} The Campaigns service returned status 400 or higher.
 */
async function listCampaigns(input) {
  return Campaigns.listCampaigns(input);
}
