import React, { Component } from 'react';
import RatesAPI from './api/ratesAPI';
import { currencies } from './commons/constants';
import CurrencyPanel from './components/CurrencyPanel';

const pockets = currencies.reduce((pocketValues, currency) => {
  pocketValues[currency.name] = 50;
  return pocketValues;
}, {});

class App extends Component {
  state = {
    baseCurrency: currencies[0],
    quoteCurrency: currencies[1],
    pockets,
    values: { baseCurrency: '', quoteCurrency: '' },
    rates: {},
  };

  componentDidMount() {
    const { baseCurrency } = this.state;
    this.ratesAPI = new RatesAPI({ updateInterval: 5000 });
    this.ratesAPI.subscribe(baseCurrency.name, rates => {
      this.setState({ rates });
    });
  }

  componentWillUnmount() {
    this.ratesAPI.unsubscribe();
  }

  handleValueChange = (currencyType, e) => {
    const { quoteCurrency, rates } = this.state;
    const value = Number(e.target.value);
    const quoteCurrencyRate = rates[quoteCurrency.name];

    if (currencyType === 'baseCurrency') {
      const quoteCurrencyValue = value * quoteCurrencyRate;
      this.setState({ values: { baseCurrency: value, quoteCurrency: quoteCurrencyValue } });
    } else {
      const baseCurrencyValue = value * (1 / quoteCurrencyRate);
      this.setState({ values: { baseCurrency: baseCurrencyValue, quoteCurrency: value } });
    }
  };

  render() {
    const { baseCurrency, quoteCurrency, pockets, values } = this.state;

    return (
      <div>
        <header className='App-header'>
          <CurrencyPanel
            currency={baseCurrency}
            baseCurrencyPanel
            value={values.baseCurrency}
            pocketValue={pockets[baseCurrency.name]}
            handleValueChange={this.handleValueChange}
          />
          <CurrencyPanel
            currency={quoteCurrency}
            value={values.quoteCurrency}
            pocketValue={pockets[baseCurrency.name]}
            handleValueChange={this.handleValueChange}
          />
        </header>
      </div>
    );
  }
}

export default App;
