import * as coda from "@codahq/packs-sdk";

export const CryptoItemCardSchema = coda.makeObjectSchema({
  type: coda.ValueType.Object,
  properties: {
    name: {
      description: "The name of the coin",
      type: coda.ValueType.String,
      required: true,
    },
    ticker: {
      description: 'Coin ticker',
      type: coda.ValueType.String
    },
    description: {
      description: 'Coin description',
      type: coda.ValueType.String
    },
    usdtExchangeRate: {
      description: 'Exchange rate to usdt',
      type: coda.ValueType.String,
    },
    icon: {
      description: "Coin logo",
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.ImageReference,
    },
    url: {
      description: 'Link to the website',
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.Url,
    }
  },
  displayProperty: 'name',
  subtitleProperties: [
    { property: "ticker", label: `Ticker: ${coda.PropertyLabelValueTemplate}`},
    { property: "usdtExchangeRate", label: `Exchange rate: ${coda.PropertyLabelValueTemplate}`} 
  ],
  snippetProperty: 'description',
  imageProperty: 'icon',
  linkProperty: 'url'
})