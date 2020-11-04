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
    handleFocus,
    handleBlur,
  } = props;

  return (
    <div>
      <FormControl variant='outlined'>
        <InputLabel htmlFor={`${currencyType}-input`} className={classes.inputLabel}>
          {name}
        </InputLabel>
        <InputComponent
          onFocus={handleFocus}
          onBlur={handleBlur}
          id={`${currencyType}-input`}
          data-testid={`${currencyType}-input`}
          value={value || ''}
          onChange={e => handleValueChange(e.target.value)}
          startAdornment={<InputAdornment position='start'>{currencyType === 'baseCurrency' ? '-' : '+'} </InputAdornment>}
          endAdornment={<InputAdornment position='end'>{symbol}</InputAdornment>}
          labelWidth={30}
        />
      </FormControl>

      <div className={classes.panelText}>
        <span data-testid='pocket-text'>You have {`${symbol}${pocketValue}`}</span>
        <span data-testid='inverse-rate-text'>{currencyRateText}</span>
      </div>
    </div>
  );
};

export default withStyles(currencyPanelStyles)(CurrencyPanel);
