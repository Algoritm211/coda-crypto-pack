import * as coda from "@codahq/packs-sdk";
import { COINGECKO_BASE_URL } from "./src/constants";
import { TopCryptosConfig } from "./src/tables/top-cryptos/top-cryptos-config";

export const pack = coda.newPack();

pack.addNetworkDomain("api.coingecko.com");

pack.setUserAuthentication({
  type: coda.AuthenticationType.CustomHeaderToken,
  headerName: "x-cg-demo-api-key",
});

pack.addFormula({
  name: 'CryptoExchangeRate',
  description: 'Fetches exchange rate for selected cryptocurrency',
  cacheTtlSecs: 1000,
  parameters: [
    coda.makeParameter({
      name: 'cryptoName',
      description: 'Please set name as "bitcoin" or "ethereum"',
      autocomplete: ["bitcoin", "ethereum"],
      type: coda.ParameterType.String,
    })
  ],
  resultType: coda.ValueType.String,
  codaType: coda.ValueHintType.Markdown,
  execute: async function ([cryptoName], context) {
    let url = `${COINGECKO_BASE_URL}/api/v3/simple/price`;

    url = coda.withQueryParams(url, {
      ids: cryptoName,
      vs_currencies: 'usd',
      json: true,
    });
    let response = await context.fetcher.fetch({
      method: "GET",
      url: url,
      cacheTtlSecs: 1000, // Don't cache the result, so we can get a fresh exchange rate.
    });
    return `1 ${cryptoName} = ${response.body[cryptoName].usd} USD`
  }
})

// Define the sync table
pack.addSyncTable(TopCryptosConfig);
