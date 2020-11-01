export const isValidValue = value => !value || /^(\d+)((\.)(\d{1,2})?)?$/.test(value);

export const removeLeadingZero = value => value.replace(/0+(\d)/, '$1');

export const pocketHasEnoughtFunds = (pockets, values) => values.baseCurrency <= pockets.baseCurrency;
