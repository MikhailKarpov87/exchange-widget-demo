export const currencies = [
  { name: 'EUR', symbol: '€' },
  { name: 'GBP', symbol: '£' },
  { name: 'USD', symbol: '$' },
];

export const defaultPocketValue = 50;

export const FXRatesRealSourceURL = 'https://api.exchangeratesapi.io/latest';

//  Mocking real source URL for development needs
export const FXRatesSourceURL = 'https://localhost:8000/api/currencies';
