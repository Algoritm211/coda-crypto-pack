import * as coda from "@codahq/packs-sdk";
import { COINGECKO_BASE_URL } from "../../constants";
import { CryptoTableSchema } from "./schema";
import { AddSyncTableParams } from "../../shared/types";
import { VsCurrencyParameter } from "./parameters";

export const TopCryptosConfig: AddSyncTableParams = {
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
      }),
      VsCurrencyParameter,
    ],
    execute: async function ([cryptoCount, vsCurrency], context) {
      let url = `${COINGECKO_BASE_URL}/api/v3/coins/markets`;

      url = coda.withQueryParams(url, {
        per_page: cryptoCount,
        page: 1,
        order: 'market_cap_desc',
        vs_currency: vsCurrency,
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
}