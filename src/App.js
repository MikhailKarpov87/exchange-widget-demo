import React, { Component } from 'react';
import { toast } from 'react-toastify';
import RatesLoader from './api/ratesLoader';
import { currencies, defaultPocketValue } from './commons/constants';
import { createCurrenciesSelectList, isValidValue, pocketHasEnoughtFunds, removeLeadingZero } from './commons/helpers';
import CurrencyPanel from './components/CurrencyPanel';
import 'react-toastify/dist/ReactToastify.css';
import withCurrencySelect from './components/withCurrencySelect';
import CurrencySelect from './components/CurrencySelect';
import { withStyles } from '@material-ui/styles';
import appStyles from './styles/app';
import ExchangeButton from './components/ExchangeButton';

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

    this.ratesLoader = new RatesLoader({ updateInterval: 10000 });
    this.subscribeForRates(baseCurrency);
  }

  componentWillUnmount() {
    this.ratesLoader.unsubscribe();
  }

  subscribeForRates = baseCurrency => {
    this.ratesLoader && this.ratesLoader.unsubscribe();
    this.ratesLoader.subscribe(baseCurrency.name, updatedRates => {
      const { quoteCurrency, exchangeValues } = this.state;
      const quoteCurrencyRate = updatedRates[quoteCurrency.name];
      const updatedQuoteCurrencyValue = exchangeValues.baseCurrency
        ? (Number(exchangeValues.baseCurrency) * quoteCurrencyRate).toFixed(2)
        : '';
      this.setState({ rates: updatedRates, exchangeValues: { ...exchangeValues, quoteCurrency: updatedQuoteCurrencyValue } });
    });
  };

  handleValueChange = (currencyType, newValue) => {
    const { quoteCurrency, rates } = this.state;

    if (!isValidValue(newValue)) {
      return;
    }

    if (newValue === '') {
      this.clearValues();
      return;
    }

    const value = removeLeadingZero(newValue);
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
      toast.error(`Not enough funds (${basePocketAmount} available)!`);
      return;
    }

    const updatedPocketValues = {
      [baseCurrency.name]: (Number(pockets[baseCurrency.name]) - Number(exchangeValues.baseCurrency)).toFixed(2),
      [quoteCurrency.name]: (Number(pockets[quoteCurrency.name]) + Number(exchangeValues.quoteCurrency)).toFixed(2),
    };
    this.setState({ pockets: { ...pockets, ...updatedPocketValues } }, this.clearValues());
    toast.success('Exchange done!');
  };

  createInverseExchangeRateText = () => {
    const { rates, baseCurrency, quoteCurrency } = this.state;
    const inverseRate = Number(1 / rates[quoteCurrency.name]).toFixed(2);
    return `${quoteCurrency.symbol}1 = ${baseCurrency.symbol}${inverseRate}`;
  };

  handleSelectCurrency = (currencyType, currencyName) => {
    const selectedCurrency = currencies.find(({ name }) => currencyName === name);
    if (currencyType === 'baseCurrency') {
      this.subscribeForRates(selectedCurrency);
    }

    this.setState({ [currencyType]: selectedCurrency }, () => this.handleValueChange(currencyType, this.state[currencyType]));
  };

  render() {
    const { baseCurrency, quoteCurrency, pockets, exchangeValues, rates } = this.state;
    const { classes } = this.props;
    const currenciesSelectList = createCurrenciesSelectList(currencies, rates, baseCurrency);

    return (
      <div className={classes.appContainer}>
        <CurrencySelect
          options={currenciesSelectList}
          handleSelectCurrency={this.handleSelectCurrency}
          value={quoteCurrency.name}
        />

        <div className={classes.topPanel}>
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
        </div>

        <div className={classes.bottomPanel}>
          <CurrencyPanelWithSelect
            currencyType='quoteCurrency'
            baseCurrency={baseCurrency}
            quoteCurrency={quoteCurrency}
            currenciesList={currencies}
            value={exchangeValues.quoteCurrency}
            pocketValue={pockets[quoteCurrency.name]}
            handleValueChange={this.handleValueChange}
            handleSelectCurrency={this.handleSelectCurrency}
            currencyRateText={this.createInverseExchangeRateText()}
          />
        </div>
        <div className={classes.buttonContainer}>
          <ExchangeButton handleButtonClick={this.makeExchange} />
        </div>
      </div>
    );
  }
}

export default withStyles(appStyles)(App);
