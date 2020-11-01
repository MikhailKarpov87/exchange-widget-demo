export const isValidValue = value => !value || /^(\d+)((\.)(\d{1,2})?)?$/.test(value);

export const removeLeadingZero = value => value.replace(/^0+(\d)/, '$1');

export const pocketHasEnoughtFunds = (values, pockets, baseCurrency) => Number(values.baseCurrency) <= pockets[baseCurrency.name];

export const createCurrenciesSelectList = (currencies, rates, baseCurrency) => {
  const currenciesSelectList = currencies
    .filter(({ name }) => name !== baseCurrency.name)
    .map(currency => {
      const exchangeRate = rates[currency.name];
      const name = `${baseCurrency.symbol}1 = ${currency.symbol}${exchangeRate}`;
      return { id: currency.name, name };
    });

  return currenciesSelectList;
};
