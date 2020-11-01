import React, { Component } from 'react';
import { ArrowLeft, ArrowRight } from '@material-ui/icons';

const withCurrencySelect = ChildComponent =>
  class WithCurrencySelect extends Component {
    getNextCurrencyName = indexShift => {
      const currentIndex = this.getCurrencyIndex();
      const nextCurrency = this.props.currenciesList[currentIndex + indexShift];

      if (!nextCurrency) {
        return null;
      }

      if (this.isEqualCurrencies(nextCurrency)) {
        return this.getNextCurrencyName(indexShift + indexShift);
      }

      return nextCurrency.name;
    };

    getCurrencyIndex = () => {
      const { currenciesList, currencyType } = this.props;
      const currency = this.props[currencyType];
      return currenciesList.findIndex(({ name }) => (currency && currency.name ? currency.name === name : null));
    };

    getRelatedCurrency = () => {
      const { currencyType, baseCurrency, quoteCurrency } = this.props;
      return currencyType === 'baseCurrency' ? quoteCurrency : baseCurrency;
    };

    isEqualCurrencies = currency => {
      const relatedCurrency = this.getRelatedCurrency(currency);
      return relatedCurrency.name === currency.name;
    };

    render() {
      const { currencyType, handleSelectCurrency } = this.props;
      const currency = this.props[currencyType];
      const nextCurrencyName = this.getNextCurrencyName(1);
      const prevCurrencyName = this.getNextCurrencyName(-1);

      return (
        <div style={{ display: 'flex' }}>
          <button onClick={() => handleSelectCurrency(currencyType, prevCurrencyName)} disabled={!prevCurrencyName}>
            <ArrowLeft />
          </button>

          <ChildComponent {...this.props} currency={currency} />

          <button onClick={() => handleSelectCurrency(currencyType, nextCurrencyName)} disabled={!nextCurrencyName}>
            <ArrowRight />
          </button>
        </div>
      );
    }
  };

export default withCurrencySelect;
