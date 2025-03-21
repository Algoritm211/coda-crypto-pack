import * as coda from '@codahq/packs-sdk';
import { AddFormulaParams } from "../../shared/types";
import { COINGECKO_BASE_URL } from '../../constants';


export const GetExchangeRateActionConfig: AddFormulaParams = {
  name: 'GetRate',
  description: 'Get exchange rate for a specific cryptocurrency to usdt',
  isAction: true,
  parameters: [
    coda.makeParameter({
      name: 'cryptoName',
      description: 'Please set name as "bitcoin" or "ethereum"',
      autocomplete: ["bitcoin", "ethereum"],
      type: coda.ParameterType.String,
    })
  ],
  resultType: coda.ValueType.String,
  execute: async function([cryptoName], context) {
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
    throw new coda.UserVisibleError(`1 ${cryptoName} = ${response.body?.[cryptoName as string].usd} USD`);
    return `1 ${cryptoName} = ${response.body?.[cryptoName as string].usd} USD`
  }
}