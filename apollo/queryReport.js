/**
 * @description Query analytics report. POST /reports/sync_report. https://docs.apollo.io/reference/sync-report
 * @param {Object} input
 * @param {Object[]} input.metrics
 * @param {Object[]} input.group_by Zero or one dimension.
 * @param {Object[]} input.sorts Zero or one sort.
 * @param {Object} input.filters
 * @param {boolean} input.group_by_totals_selected
 * @param {boolean} input.pivot_group_by_totals_selected
 * @param {Object[]} input.date_ranges One date range.
 * @param {Object[]} [input.pivot_group_by]
 * @param {string[]} [input.skip_group_by_values]
 * @param {number} [input.min_ratio_denominator]
 * @returns {Object} Apollo response body.
 * @throws {Error} APOLLO_INVALID_INPUT when a required report field is missing or group_by, sorts, or date_ranges has the wrong length.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function queryReport(input) {
  const req = requireObject(input);
  const body = {
    metrics: requireObjectArray(req.metrics, "metrics", 1),
    group_by: requireObjectArray(req.group_by, "group_by", 0, 1),
    sorts: requireObjectArray(req.sorts, "sorts", 0, 1),
    filters: requirePlainObject(req, "filters"),
    group_by_totals_selected: requireBooleanField(req, "group_by_totals_selected"),
    pivot_group_by_totals_selected: requireBooleanField(req, "pivot_group_by_totals_selected"),
    date_ranges: requireObjectArray(req.date_ranges, "date_ranges", 1, 1),
  };
  if (req.pivot_group_by !== undefined) body.pivot_group_by = checkValue("pivot_group_by", req.pivot_group_by, "object[]");
  if (req.skip_group_by_values !== undefined) body.skip_group_by_values = checkValue("skip_group_by_values", req.skip_group_by_values, "string[]");
  if (req.min_ratio_denominator !== undefined) body.min_ratio_denominator = checkValue("min_ratio_denominator", req.min_ratio_denominator, "integer");
  return apolloRequest("/reports/sync_report", "POST", body);
}
