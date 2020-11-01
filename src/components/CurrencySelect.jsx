import React from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';

const CurrencySelect = props => {
  const { options, handleSelectCurrency, value } = props;

  return (
    <div>
      <FormControl variant='outlined'>
        <Select id='currency-select' value={value} onChange={e => handleSelectCurrency('quoteCurrency', e.target.value)}>
          {options.map(({ id, name }) => (
            <MenuItem value={id}>{name}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default CurrencySelect;
