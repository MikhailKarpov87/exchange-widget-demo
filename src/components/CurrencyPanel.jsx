import { FormControl, InputAdornment, InputLabel, OutlinedInput } from '@material-ui/core';
import React from 'react';

const CurrencyPanel = props => {
  const {
    baseCurrencyPanel,
    value,
    currency: { name, symbol },
    pocketValue,
    handleValueChange,
  } = props;
  const currencyType = baseCurrencyPanel ? 'baseCurrency' : 'quoteCurrency';
  return (
    <div>
      <FormControl variant='outlined'>
        <InputLabel htmlFor='currency-input'>{name}</InputLabel>
        <OutlinedInput
          id='currency-input'
          value={value || ''}
          onChange={e => handleValueChange(currencyType, e)}
          startAdornment={<InputAdornment position='start'>{baseCurrencyPanel ? '-' : '+'} </InputAdornment>}
          endAdornment={<InputAdornment position='end'>{symbol}</InputAdornment>}
          labelWidth={60}
        />
      </FormControl>
      <p>You have {`${symbol}${pocketValue}`}</p>
    </div>
  );
};

export default CurrencyPanel;
