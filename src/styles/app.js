import colors from './colors';

const appStyles = {
  appContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: colors.primaryColor,
    fontSize: '1.2em',
    minWidth: '375px',
  },
  sideButton: {
    backgroundColor: 'unset',
    border: 0,
    cursor: 'pointer',
    root: {
      color: colors.primaryColor,
      '&:disabled': {
        color: colors.secondaryColor,
      },
    },
  },
  topPanel: {
    background: `linear-gradient(${colors.backgroundBottom}, ${colors.backgroundTop})`,
    padding: '2em 0',
  },
  bottomPanel: {
    background: `linear-gradient(${colors.backgroundMiddle}, ${colors.backgroundTop})`,
    padding: '2em 0',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '1em',
  },
};

export default appStyles;
