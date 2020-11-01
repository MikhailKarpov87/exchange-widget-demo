import axios from 'axios';
import { currencies, FXRatesSourceURL } from '../commons/constants';

class RatesAPI {
  constructor(options) {
    this.updateInterval = options.updateInterval;
  }

  subscribe = (baseCurrency, callback) => {
    this.baseCurrency = baseCurrency;

    (async () => {
      const rates = await this._getRates();
      callback(rates);
    })();

    this.intervalId = setInterval(async () => {
      const rates = await this._getRates();
      callback(rates);
    }, this.updateInterval);
  };

  unsubscribe() {
    clearInterval(this.intervalId);
  }

  responseHasCurrenciesRates = response => {
    const quoteCurrencies = currencies.filter(currency => currency.name !== this.baseCurrency);

    return (
      response &&
      response.data &&
      response.data.rates &&
      quoteCurrencies.every(currency => response.data.rates[currency.name]) &&
      response.data.base === this.baseCurrency
    );
  };

  _getRates = async () => {
    try {
      const response = await axios.get(`${FXRatesSourceURL}?base=${this.baseCurrency}`);
      return this.responseHasCurrenciesRates(response) ? response.data.rates : new Error(`Can't get rates :(`);
    } catch (error) {
      throw new Error(`Can't get rates :(`);
    }
  };
}

export default RatesAPI;
