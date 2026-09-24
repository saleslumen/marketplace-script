/**
 * @description Get one operation in the caller organization.
 * @param {Object} input
 * @param {string} input.operation_id Operation id.
 * @returns {Object} Operation.
 * @throws {Error} The Campaigns service returned status 400 or higher.
 */
async function getOperation(input) {
  return Campaigns.getOperation(input);
}
