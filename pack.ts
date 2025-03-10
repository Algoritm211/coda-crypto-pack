import * as coda from "@codahq/packs-sdk";

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
    let url = 'https://api.coingecko.com/api/v3/simple/price';

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

const CryptoTableSchema = coda.makeObjectSchema({
  properties: {
    id: { type: coda.ValueType.String, description: "The cryptocurrency ID" },
    name: { type: coda.ValueType.String, description: "The name of the cryptocurrency" },
    symbol: { type: coda.ValueType.String, description: "The symbol of the cryptocurrency" },
    price: { type: coda.ValueType.Number, description: "Current price in USD", codaType: coda.ValueHintType.Currency },
    marketCap: { type: coda.ValueType.Number, description: "Market capitalization in USD", codaType: coda.ValueHintType.Currency },
  },
  displayProperty: 'symbol',
  featuredProperties: ['name', 'symbol', 'price', 'marketCap'],
  idProperty: "id",
})

// Define the sync table
pack.addSyncTable({
  name: "TopCryptos",
  description: "Fetches the top 5 cryptocurrencies by market cap.",
  identityName: "Crypto",
  schema: CryptoTableSchema,
  formula: {
    name: "SyncTopCryptos",
    description: "Fetches the top cryptocurrencies by market cap (5 by default).",
    parameters: [
      coda.makeParameter({
      name: 'cryptoCount',
      description: 'Here you can specify how many cryptocurrencies you want to see in the table (number)',
      type: coda.ParameterType.Number,
      optional: true,
      suggestedValue: 5,
    })
    ],
    execute: async function ([cryptoCount], context) {
      let url =
        "https://api.coingecko.com/api/v3/coins/markets";

      url = coda.withQueryParams(url, {
        per_page: cryptoCount,
        page: 1,
        order: 'market_cap_desc',
        vs_currency: 'usd',
        json: true,
      });

      let response = await context.fetcher.fetch({
        method: "GET",
        url: url,
      });

      let data = response.body;
      let result = data.map((coin: any) => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol.toUpperCase(),
        price: coin.current_price,
        marketCap: coin.market_cap,
      }));

      return { result };
    },
  },
});
