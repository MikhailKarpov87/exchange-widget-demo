import React from 'react';
import { Button } from '@material-ui/core';

const ExchangeButton = props => {
  const { handleButtonClick, disabled } = props;

  return (
    <Button onClick={handleButtonClick} disabled={disabled} color='primary' variant='contained'>
      Exchange
    </Button>
  );
};

export default ExchangeButton;
