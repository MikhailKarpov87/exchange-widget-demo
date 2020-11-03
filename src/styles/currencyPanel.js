import colors from './colors';

export const currencyPanelInput = {
  root: {
    color: colors.primaryColor,
    '& *': {
      color: colors.primaryColor,
      borderColor: colors.primaryColor,
    },
    '& div': {
      width: '1em',
      margin: 0,
    },
  },
  input: {
    padding: '12px 6px',
    fontSize: '1.7em',
    '& *': {
      color: colors.primaryColor + ' !important',
    },
  },
};

export const currencyPanelStyles = {
  selectContainer: {
    margin: '1em',
    '& svg': {
      color: colors.primaryColor,
    },
  },
  inputLabel: {
    color: colors.primaryColor,
  },
  panelText: {
    color: colors.secondaryColor,
    display: 'flex',
    fontSize: '0.75em',
    justifyContent: 'space-between',
    margin: '2em 0',
  },
};
