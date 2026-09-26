/**
 * @description Create a session. POST /v1/sessions.
 * @param {Object} [input]
 * @param {string} [input.projectId]
 * @param {string} [input.extensionId]
 * @param {Object} [input.browserSettings]
 * @param {number} [input.timeout] - Integer seconds from 60 to 21600
 * @param {boolean} [input.keepAlive]
 * @param {boolean|Object[]} [input.proxies]
 * @param {Object} [input.proxySettings]
 * @param {"us-west-2"|"us-east-1"|"eu-central-1"|"ap-southeast-1"} [input.region]
 * @param {Object} [input.userMetadata]
 * @returns {Object} the Browserbase session, including connectUrl, seleniumRemoteUrl, and signingKey
 * @throws {Error} BROWSERBASE_REQUEST_FAILED when input is invalid or Browserbase rejects the request
 */
async function createSession(input) {
  return browserbaseRequest("/v1/sessions", "POST", buildCreateSessionBody(input));
}
