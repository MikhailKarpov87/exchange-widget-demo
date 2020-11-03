import React from 'react';
import { FormControl, MenuItem, Select } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { currencySelect, currencySelectStyles } from '../styles/currencySelect';

const SelectComponent = withStyles(currencySelect)(Select);

const CurrencySelect = props => {
  const { options, handleSelectCurrency, value, classes } = props;

  return (
    <div className={classes.selectContainer}>
      <FormControl variant='outlined'>
        <SelectComponent id='currency-select' value={value} onChange={e => handleSelectCurrency('quoteCurrency', e.target.value)}>
          {options.map(({ id, name }) => (
            <MenuItem value={id}>{name}</MenuItem>
          ))}
        </SelectComponent>
      </FormControl>
    </div>
  );
};

export default withStyles(currencySelectStyles)(CurrencySelect);
