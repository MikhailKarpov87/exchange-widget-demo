import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import RatesLoader from './api/ratesLoader';
import { currencies, defaultPocketValue } from './commons/constants';
import { createCurrenciesSelectList, isValidValue, pocketHasEnoughtFunds, removeLeadingZero } from './commons/helpers';
import CurrencyPanel from './components/CurrencyPanel';
import 'react-toastify/dist/ReactToastify.css';
import withCurrencySelect from './components/withCurrencySelect';
import { MenuItem, Select } from '@material-ui/core';
import CurrencySelect from './components/CurrencySelect';

const CurrencyPanelWithSelect = withCurrencySelect(CurrencyPanel);

const pockets = currencies.reduce((pocketValues, currency) => {
  pocketValues[currency.name] = defaultPocketValue;
  return pocketValues;
}, {});

class App extends Component {
  state = {
    baseCurrency: currencies[0],
    quoteCurrency: currencies[1],
    pockets,
    exchangeValues: { baseCurrency: '', quoteCurrency: '' },
    rates: {},
  };

  componentDidMount() {
    const { baseCurrency } = this.state;

    this.ratesLoader = new RatesLoader({ updateInterval: 5000 });
    this.ratesLoader.subscribe(baseCurrency.name, updatedRates => {
      const { quoteCurrency, exchangeValues } = this.state;
      const quoteCurrencyRate = updatedRates[quoteCurrency.name];
      const updatedQuoteCurrencyValue = exchangeValues.baseCurrency
        ? (Number(exchangeValues.baseCurrency) * quoteCurrencyRate).toFixed(2)
        : '';
      this.setState({ rates: updatedRates, exchangeValues: { ...exchangeValues, quoteCurrency: updatedQuoteCurrencyValue } });
    });
  }

  componentWillUnmount() {
    this.ratesLoader.unsubscribe();
  }

  handleValueChange = (currencyType, e) => {
    const { quoteCurrency, rates } = this.state;

    if (!isValidValue(e.target.value)) {
      return;
    }

    const value = removeLeadingZero(e.target.value);
    const quoteCurrencyRate = rates[quoteCurrency.name];

    if (currencyType === 'baseCurrency') {
      const quoteCurrencyValue = Number(value) * quoteCurrencyRate;
      this.setState({ exchangeValues: { baseCurrency: value, quoteCurrency: quoteCurrencyValue.toFixed(2) } });
    } else {
      const baseCurrencyValue = Number(value) * (1 / quoteCurrencyRate);
      this.setState({ exchangeValues: { baseCurrency: baseCurrencyValue.toFixed(2), quoteCurrency: value } });
    }
  };

  clearValues() {
    this.setState({ exchangeValues: { baseCurrency: '', quoteCurrency: '' } });
  }

  makeExchange = () => {
    const { baseCurrency, quoteCurrency, exchangeValues, pockets } = this.state;

    if (exchangeValues.baseCurrency <= 0) {
      toast.error('Enter valid value!');
      return;
    }

    if (!pocketHasEnoughtFunds(exchangeValues, pockets, baseCurrency)) {
      const basePocketAmount = `${baseCurrency.symbol}${pockets[baseCurrency.name]}`;
      toast.error(`Not enough funds (${basePocketAmount})!`);
      return;
    }

    const updatedPocketValues = {
      [baseCurrency.name]: (Number(pockets[baseCurrency.name]) - Number(exchangeValues.baseCurrency)).toFixed(2),
      [quoteCurrency.name]: (Number(pockets[quoteCurrency.name]) + Number(exchangeValues.quoteCurrency)).toFixed(2),
    };
    this.setState({ pockets: { ...pockets, ...updatedPocketValues } }, this.clearValues());
    toast.info('Exchange done!');
  };

  createExchangeRateLabelText = () => {
    const { rates, baseCurrency, quoteCurrency } = this.state;
    const inverseRate = Number(1 / rates[quoteCurrency.name]).toFixed(2);
    return `${quoteCurrency.symbol}1 = ${baseCurrency.symbol}${inverseRate}`;
  };

  handleSelectCurrency = (currencyType, currencyName) => {
    const selectedCurrency = currencies.find(({ name }) => currencyName === name);
    this.setState({ [currencyType]: selectedCurrency });
  };

  render() {
    const { baseCurrency, quoteCurrency, pockets, exchangeValues, rates } = this.state;
    const currenciesSelectList = createCurrenciesSelectList(currencies, rates, baseCurrency);

    return (
      <div>
        <CurrencySelect
          options={currenciesSelectList}
          handleSelectCurrency={this.handleSelectCurrency}
          value={quoteCurrency.name}
        />

        <CurrencyPanelWithSelect
          currencyType='baseCurrency'
          baseCurrency={baseCurrency}
          quoteCurrency={quoteCurrency}
          currenciesList={currencies}
          value={exchangeValues.baseCurrency}
          pocketValue={pockets[baseCurrency.name]}
          handleValueChange={this.handleValueChange}
          handleSelectCurrency={this.handleSelectCurrency}
        />

        <CurrencyPanelWithSelect
          currencyType='quoteCurrency'
          baseCurrency={baseCurrency}
          quoteCurrency={quoteCurrency}
          currenciesList={currencies}
          value={exchangeValues.quoteCurrency}
          pocketValue={pockets[quoteCurrency.name]}
          handleValueChange={this.handleValueChange}
          handleSelectCurrency={this.handleSelectCurrency}
        />
        <div>{this.createExchangeRateLabelText()}</div>
        <button onClick={this.makeExchange}>Exchange</button>
        <ToastContainer position='bottom-center' autoClose={5000} hideProgressBar={true} closeOnClick pauseOnHover />
      </div>
    );
  }
}

export default App;
