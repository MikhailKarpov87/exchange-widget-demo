import axios from 'axios';
import { currencies, FXRatesSourceURL } from '../commons/constants';
import { toast } from 'react-toastify';

class RatesLoader {
  constructor(options) {
    this.updateInterval = options.updateInterval;
    this.errorMessage = `Can't get rates :(`;
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

  responseHasRates = response => {
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
      return this.responseHasRates(response) ? response.data.rates : new Error(this.errorMessage);
    } catch (error) {
      toast.error(this.errorMessage);
      clearInterval(this.intervalId);
      throw new Error(this.errorMessage);
    }
  };
}

export default RatesLoader;
