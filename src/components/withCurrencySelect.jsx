import React, { Component } from 'react';
import { ArrowLeft, ArrowRight } from '@material-ui/icons';
import { withStyles } from '@material-ui/styles';
import appStyles from '../styles/app';
import { Button } from '@material-ui/core';

const SideButton = withStyles(appStyles.sideButton)(Button);

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
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <SideButton
            id='previous-currency'
            data-testid='previous-currency'
            style={{ alignSelf: 'stretch' }}
            onClick={() => handleSelectCurrency(currencyType, prevCurrencyName)}
            disabled={!prevCurrencyName}
          >
            <ArrowLeft />
          </SideButton>

          <ChildComponent {...this.props} currency={currency} />

          <SideButton
            id='next-currency'
            data-testid='next-currency'
            style={{ alignSelf: 'stretch' }}
            onClick={() => handleSelectCurrency(currencyType, nextCurrencyName)}
            disabled={!nextCurrencyName}
          >
            <ArrowRight />
          </SideButton>
        </div>
      );
    }
  };

export default withCurrencySelect;
