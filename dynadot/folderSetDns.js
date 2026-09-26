/**
 * PUT /restful/v2/folders/{folder_name}/records
 * @see https://www.dynadot.com/domain/api-document#folder_set_dns
 * @param {Object} input
 * @param {string|number} input.folder_name
 * @param {Array} input.dns_main_list
 * @param {string} [input.dns_main_list.record_type]
 * @param {string} [input.dns_main_list.record_value1]
 * @param {string} [input.dns_main_list.record_value2]
 * @param {Array} [input.dns_sub_list]
 * @param {string} [input.dns_sub_list.sub_host]
 * @param {string} [input.dns_sub_list.record_type]
 * @param {string} [input.dns_sub_list.record_value1]
 * @param {string} [input.dns_sub_list.record_value2]
 * @param {string} [input.ttl]
 * @param {boolean} [input.apply_for_future_domain]
 * @param {boolean} [input.sync_setting_to_existing_domains_in_this_folder]
 * @returns {Promise<Object>}
 */
async function folderSetDns(input) {
  return dynadotRest({
    method: "PUT",
    path: "/folders/{folder_name}/records",
    fields: [
      { name: "folder_name", in: "path", required: true, type: "path" },
      { name: "dns_main_list", in: "body", required: true, type: "list", item: "object", fields: [
        { name: "record_type", type: "string" },
        { name: "record_value1", type: "string" },
        { name: "record_value2", type: "string" },
      ] },
      { name: "dns_sub_list", in: "body", type: "list", item: "object", fields: [
        { name: "sub_host", type: "string" },
        { name: "record_type", type: "string" },
        { name: "record_value1", type: "string" },
        { name: "record_value2", type: "string" },
      ] },
      { name: "ttl", in: "body", type: "string" },
      { name: "apply_for_future_domain", in: "body", type: "boolean" },
      { name: "sync_setting_to_existing_domains_in_this_folder", in: "body", type: "boolean" },
    ]
  }, input);
}
