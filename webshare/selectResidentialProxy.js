/**
 * @description Select one valid residential backbone proxy. Credentials are for Browserbase only—never write them to the registry or Linear.
 * @param {Object} [input]
 * @param {string} [input.countryCodes] - Comma-separated ISO country codes, for example US
 * @param {string|number} [input.page]
 * @param {string|number} [input.pageSize]
 * @returns {Object}
 * @property {boolean} selected
 * @property {string} proxyAddress
 * @property {number} port
 * @property {string} server - http://host:port for Browserbase external proxy
 * @property {string} username
 * @property {string} password
 * @property {string} countryCode
 */
async function selectResidentialProxy(input) {
  const req = input && typeof input === "object" ? input : {};
  const page = Math.max(1, Number(asString(req.page)) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(asString(req.pageSize)) || 25));
  const countryCodes = asString(req.countryCodes || req.country_code__in || "US");
  const query = [
    "mode=backbone",
    `page=${encodeURIComponent(String(page))}`,
    `page_size=${encodeURIComponent(String(pageSize))}`,
  ];
  if (countryCodes) query.push(`country_code__in=${encodeURIComponent(countryCodes)}`);
  const listed = await webshareRequest(`/proxy/list/?${query.join("&")}`, "GET");
  const results = Array.isArray(listed.results) ? listed.results : [];
  const proxy = results.find((row) => {
    const username = asString(row.username);
    const password = asString(row.password);
    const address = asString(row.proxy_address);
    const port = Number(row.port);
    const valid = row.valid !== false;
    return valid && username && password && address && Number.isFinite(port) && port > 0;
  });
  if (!proxy) throw new Error("WEBSHARE_REQUEST_FAILED: no valid residential backbone proxy available");
  const proxyAddress = asString(proxy.proxy_address);
  const port = Number(proxy.port);
  return {
    selected: true,
    proxyId: asString(proxy.id),
    proxyAddress,
    port,
    server: `http://${proxyAddress}:${port}`,
    username: asString(proxy.username),
    password: asString(proxy.password),
    countryCode: asString(proxy.country_code),
    cityName: asString(proxy.city_name),
    mode: "backbone",
  };
}
