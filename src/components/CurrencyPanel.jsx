import React from 'react';
import { FormControl, InputAdornment, InputLabel, OutlinedInput } from '@material-ui/core';

const CurrencyPanel = props => {
  const {
    currencyType,
    value,
    currency: { name, symbol },
    pocketValue,
    handleValueChange,
  } = props;

  return (
    <div>
      <FormControl variant='outlined'>
        <InputLabel htmlFor='currency-input'>{name}</InputLabel>
        <OutlinedInput
          id='currency-input'
          value={value || ''}
          onChange={e => handleValueChange(currencyType, e)}
          startAdornment={<InputAdornment position='start'>{currencyType === 'baseCurrency' ? '-' : '+'} </InputAdornment>}
          endAdornment={<InputAdornment position='end'>{symbol}</InputAdornment>}
          labelWidth={30}
        />
      </FormControl>

      <p>You have {`${symbol}${pocketValue}`}</p>
    </div>
  );
};

export default CurrencyPanel;
