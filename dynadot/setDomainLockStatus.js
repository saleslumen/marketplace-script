/**
 * PUT /restful/v2/domains/{domain_name}/domain_lock
 * @see https://www.dynadot.com/domain/api-document#set_domain_lock_status
 * @param {Object} input
 * @param {string|number} input.domain_name
 * @param {boolean} input.lock
 * @returns {Promise<Object>}
 */
async function setDomainLockStatus(input) {
  return dynadotRest({
    method: "PUT",
    path: "/domains/{domain_name}/domain_lock",
    fields: [
      { name: "domain_name", in: "path", required: true, type: "path" },
      { name: "lock", in: "body", required: true, type: "boolean" },
    ]
  }, input);
}
