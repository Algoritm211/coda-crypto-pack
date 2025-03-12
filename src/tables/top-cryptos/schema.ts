import * as coda from '@codahq/packs-sdk';

export const CryptoTableSchema = coda.makeObjectSchema({
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