import { isValidValue, removeLeadingZero, pocketHasEnoughtFunds, createCurrenciesSelectList } from '../../commons/helpers';

const testInputValues = {
  correct: ['1.99', '0.1', '01.1', '0.03', '1.00', '42', '99.9', '9000000000'],
  incorrect: ['900000000000', 'text', '@#%$#^', '0,33', '0.1233', '-123', '+1', '1/2'],
};

const currenciesList = [
  { name: 'CUR1', symbol: '1' },
  { name: 'CUR2', symbol: '2' },
  { name: 'CUR3', symbol: '3' },
  { name: 'CUR4', symbol: '4' },
];

const rates = { CUR1: 1.0, CUR2: 1.11, CUR3: 1.33, CUR4: 0.87 };
const baseCurrency = { name: 'USD' };

const testPocketValues = { correct: [0.01, 0.33, 49.99, 50], incorrect: [50.01, 100, 9999] };

const pockets = { USD: 50 };

testInputValues.correct.map(value => {
  test(`should validate correct value = ${value}`, () => {
    const result = isValidValue(value);

    expect(result).toEqual(true);
  });
});

testInputValues.incorrect.map(value => {
  test(`should not validate incorrect value = ${value}`, () => {
    const result = isValidValue(value);

    expect(result).toEqual(false);
  });
});

test(`should remove leading zero`, () => {
  const result = removeLeadingZero('00.03');

  expect(result).toEqual('0.03');
});

testPocketValues.correct.map(testValue => {
  test(`should validate pocketHasEnoughtFunds for value ${testValue}`, () => {
    const values = { baseCurrency: testValue };
    const result = pocketHasEnoughtFunds(values, pockets, baseCurrency);

    expect(result).toEqual(true);
  });
});

testPocketValues.incorrect.map(testValue => {
  test(`should not validate pocketHasEnoughtFunds for incorrect value ${testValue}`, () => {
    const values = { baseCurrency: testValue };
    const result = pocketHasEnoughtFunds(values, pockets, baseCurrency);

    expect(result).toEqual(false);
  });
});

test(`should return list with correct number of items`, () => {
  const result = createCurrenciesSelectList(currenciesList, rates, baseCurrency);

  expect(result.length).toEqual(currenciesList.length);
});
