const rates = {
  EUR: 1.0999,
  GBP: 0.89,
  USD: 1.3333,
};

const createRatesResponse = baseCurrency => {
  const responseRates = { ...rates };
  delete responseRates[baseCurrency];
  return { base: baseCurrency, rates: responseRates };
};

export { rates, createRatesResponse };
