export const currencies = [
  { name: 'EUR', symbol: '€' },
  { name: 'GBP', symbol: '£' },
  { name: 'USD', symbol: '$' },
];

export const defaultPocketValue = 50;

//  30 sec loading interval to avoid rate limiting from FX Rates Service
export const defaultRatesLoadingInterval = 30 * 1000;

export const FXRatesSourceURL = 'https://api.exchangeratesapi.io/latest';
