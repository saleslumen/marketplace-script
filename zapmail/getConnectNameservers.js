/**
 * @description Return Zapmail CloudNS nameservers required before connect-domain.
 * @returns {Object}
 * @property {string[]} nameServers
 */
async function getConnectNameservers() {
  return { nameServers: ZAPMAIL_CONNECT_NAMESERVERS.slice(), nameServersCsv: ZAPMAIL_CONNECT_NAMESERVERS.join(",") };
}
