/**
 * @description Start an import. POST /crm/imports/{apiVersion}. files and importRequest are sent as multipart/form-data fields. files is the file contents. importRequest is the JSON text.
 * @param {Object} input
 * @param {string} input.files
 * @param {string} input.importRequest
 * @returns {Object} HubSpot response body. An empty 2xx body is {}.
 * @throws {Error} HUBSPOT_INVALID_INPUT: <reason> when a required input is missing
 * @throws {Error} HUBSPOT_NOT_CONFIGURED when apiVersion is invalid
 * @throws {Error} AUTH_NOT_CONNECTED when HubSpot is not connected
 * @throws {Error} HUBSPOT_REQUEST_FAILED when HubSpot returns a non-2xx status
 */
async function startImport(input) {
  const req = inputObject(input);
  const files = requiredRawString(req, "files");
  const importRequest = requiredRawString(req, "importRequest");
  const boundary = "hubspot-form-boundary";
  const body = `--${boundary}\r\nContent-Disposition: form-data; name="files"; filename="files"\r\nContent-Type: application/octet-stream\r\n\r\n${files}\r\n--${boundary}\r\nContent-Disposition: form-data; name="importRequest"\r\n\r\n${importRequest}\r\n--${boundary}--\r\n`;
  return requestJson(`/crm/imports/${configuredApiVersion()}`, "POST", body, undefined, { "Content-Type": `multipart/form-data; boundary=${boundary}` });
}
