export class CurrencyPair {
  id: number;
  name: string;
  base_currency: {
    id: number;
    name: string;
  };
  quoted_currency: {
    id: number;
    name: string;
  };
  last_value: {
    bid: number;
    ask: number;
    spread: number;
    creation_time: string;
    currency_pair: number;
  }
}