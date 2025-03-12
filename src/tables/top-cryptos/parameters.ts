import * as coda from "@codahq/packs-sdk";
import { COINGECKO_BASE_URL } from "../../constants";

export const VsCurrencyParameter = coda.makeParameter({
  type: coda.ParameterType.String,
  name: "vsCurrency",
  description: "This parameter allows you to select on of all the supported currencies on CoinGecko",
  optional: true,
  suggestedValue: 'usd',
  // Pull the list of currencies to use for autocomplete from the API.
  autocomplete: async function (context, search) {
    let response = await context.fetcher.fetch({
      method: "GET",
      url: `${COINGECKO_BASE_URL}/api/v3/simple/supported_vs_currencies`,
    });
    let currencies = response.body;
    // Convert the currencies into a list of autocomplete options.
    return coda.simpleAutocomplete(search, currencies);
  },
});
