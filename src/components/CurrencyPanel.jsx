import React from 'react';
import { FormControl, InputAdornment, InputLabel, OutlinedInput } from '@material-ui/core';
import { currencyPanelInput, currencyPanelStyles } from '../styles/currencyPanel';
import { withStyles } from '@material-ui/styles';

const InputComponent = withStyles(currencyPanelInput)(OutlinedInput);

const CurrencyPanel = props => {
  const {
    currencyType,
    value,
    currency: { name, symbol },
    pocketValue,
    handleValueChange,
    currencyRateText,
    classes,
  } = props;

  return (
    <div>
      <FormControl variant='outlined'>
        <InputLabel htmlFor='currency-input' className={classes.inputLabel}>
          {name}
        </InputLabel>
        <InputComponent
          id='currency-input'
          value={value || ''}
          onChange={e => handleValueChange(currencyType, e.target.value)}
          startAdornment={<InputAdornment position='start'>{currencyType === 'baseCurrency' ? '-' : '+'} </InputAdornment>}
          endAdornment={<InputAdornment position='end'>{symbol}</InputAdornment>}
          labelWidth={30}
        />
      </FormControl>

      <div className={classes.panelText}>
        <span>You have {`${symbol}${pocketValue}`}</span>
        <span>{currencyRateText}</span>
      </div>
    </div>
  );
};

export default withStyles(currencyPanelStyles)(CurrencyPanel);
