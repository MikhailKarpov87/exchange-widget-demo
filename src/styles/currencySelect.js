import colors from './colors';

export const currencySelect = {
  root: {
    color: colors.primaryColor,
    border: `1px solid ${colors.secondaryColor}`,
    padding: '2px 12px',
    '&:focus': {
      color: colors.primaryColor,
      border: `1px solid ${colors.secondaryColor}`,
      borderRadius: '4px',
    },
  },
};

export const currencySelectStyles = {
  selectContainer: {
    margin: '1em',
    '& svg': {
      color: colors.primaryColor,
    },
  },
};
