/**
 * @description Add records to a list. POST /labels/add_entity_ids_to_label_names. https://docs.apollo.io/reference/add-records-to-a-list
 * @param {Object} input
 * @param {string[]} input.entity_ids
 * @param {string[]} input.label_names
 * @param {"contacts"|"accounts"} input.modality
 * @param {boolean} [input.async]
 * @returns {Object} Apollo response body.
 * @throws {Error} APOLLO_INVALID_INPUT when entity_ids, label_names, or modality is missing or invalid.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function addToLabels(input) {
  const req = requireObject(input);
  const body = {
    entity_ids: requireStringList(req, "entity_ids"),
    label_names: requireStringList(req, "label_names"),
    modality: requireModality(req),
  };
  if (req.async !== undefined) body.async = checkValue("async", req.async, "boolean");
  return apolloRequest("/labels/add_entity_ids_to_label_names", "POST", body);
}
