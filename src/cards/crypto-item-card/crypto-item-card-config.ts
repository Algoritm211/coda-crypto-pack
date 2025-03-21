import * as coda from "@codahq/packs-sdk";
import { AddFormulaParams } from "../../shared/types";
import { CryptoItemCardSchema } from "./schema";
import { COINGECKO_BASE_URL } from "../../constants";


export const CryptoItemCardConfig: AddFormulaParams = {
  name: "CryptoCard",
  description: "Gets information about a crypto coin given its id from CoinGecko",
  cacheTtlSecs: 0,
  parameters: [
    coda.makeParameter({
      name: 'cryptoName',
      description: 'Please set name as "bitcoin" or "ethereum"',
      autocomplete: ["bitcoin", "ethereum"],
      type: coda.ParameterType.String,
    })
  ],
  resultType: coda.ValueType.Object,
  schema: CryptoItemCardSchema,
  execute: async function ([cryptoName], context) {
    let url = `${COINGECKO_BASE_URL}/api/v3/coins/${cryptoName}`;
    
    let response = await context.fetcher.fetch({
      method: "GET",
      url: url,
    });

    let data = response.body;
    let result = {
      name: data.name,
      ticker: data.symbol?.toUpperCase(),
      description: data.description?.en,
      icon: data.image.large,
      url: data.links.homepage[0],
      usdtExchangeRate: `1 ${data.symbol?.toUpperCase()} = ${data.market_data.current_price.usd} USDT`
    };

    return result;
  }
}