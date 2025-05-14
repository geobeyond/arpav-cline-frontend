import { keyframes } from '@mui/system';

export const warning = keyframes`
    from {
      border: 1px solid yellow;
      background-color: #164d36;
    }
    to {
      border: none;
      background-color: #387e5d;
    }
`;
export const needsSelection = keyframes`
    from {
      border: none;
      // background-color: #d18a5c;
    }
    to {
      border: 1px solid yellow;
      // background-color: #D5956F;
    }
`;

export const MapMenuBarStyle = {
  fontFamily: 'Titillium Web, Helvetica, sans-serif',
  alignItems: 'flex-end',
  '& .MuiSelect-select': {
    color: 'primary.contrastText',
    paddingTop: '8px',
  },
  '& button': {
    color: 'primary.contrastText',
  },
  '& .MuiTypography-root': {
    paddingTop: '4px',
  },
};

export const MenuFormControlStyle = theme => ({
  fontFamily: 'Titillium Web, Helvetica, sans-serif',
  position: 'static',
});

export const GridContainerStyle = {
  // color: '#d5956f',
  flexBasis: '100%',
  fontFamily: 'Titillium Web, Helvetica, sans-serif',
  '--Grid-borderWidth': '1px',
  borderTop: 'none',
  borderLeft: 'var(--Grid-borderWidth) solid',
  borderColor: 'divider',
  '& > div': {
    borderRight: 'var(--Grid-borderWidth) solid',
    borderBottom: 'none',
    borderColor: 'divider',
  },
};

// export const MenuSelectionMobileStyle = theme => ({
//   color: 'white',
//   backgroundColor: 'green',
// });

export const MenuSelectionMobileStyle = theme => ({
  border: '1px solid',
  borderColor: 'divider',
  color: 'success.contrastText',
  fontFamily: 'Titillium Web, Helvetica, sans-serif',
  backgroundColor: 'success.dark',
  pt: 1.5,
  pb: 0.5,
  pl: 1.5,
  pr: 1.5,
});

export const FirstRowStyle = theme => ({
  color: 'success.dark',
  backgroundColor: 'secondary.light',
  fontFamily: 'Titillium Web, Helvetica, sans-serif',
  paddingLeft: 2,
  '& .dropdown-toggle': {
    padding: '0 24px',
    color: '#164d36',
    '& *': {
      display: 'inline-block',
    },
  },
});

export const SecondRowStyle = theme => ({
  fontFamily: 'Titillium Web, Helvetica, sans-serif',
  backgroundColor: 'success.dark',
  '& .NeedsSelection': {
    animation: `${warning} 2s infinite ease`,
  },
});

export const MenuLabelStyle = {
  fontFamily: 'Titillium Web, Helvetica, sans-serif',
  paddingTop: 1,
  paddingBottom: 0.5,
};

export const SelectStyle = theme => ({
  fontFamily: 'Titillium Web, Helvetica, sans-serif',
  width: '100%',
  height: '100%',
  '& .MuiSelect-select': {
    paddingTop: 2,
    paddingBottom: 1,
    paddingLeft: 0,
  },
  '& .MultiRadioSelect': {
    paddingLeft: 2,
    borderRadius: '0',
    [theme.breakpoints.down('def')]: {
      paddingLeft: 0,
    },
  },
  '& .MultiRadioSelect-open': {
    backgroundColor: 'primary.main',
  },
  '& svg': {
    color: 'primary.contrastText',
  },
});

export const LeftSelectStyle = theme => ({
  ...SelectStyle(theme),
  '& .MultiRadioSelect': {
    fontFamily: 'Titillium Web, Helvetica, sans-serif',
    paddingLeft: 4,
    borderRadius: '0',
    [theme.breakpoints.down('def')]: {
      paddingLeft: 0,
    },
  },
});

export const MenuR1Style = theme => ({
  ...FirstRowStyle(theme),
  width: '47px',
});
export const MenuR2Style = theme => ({
  ...SecondRowStyle(theme),
  width: '47px',
});

export const SelectMenuStyle = theme => ({
  '& .MuiMenu-paper': {
    fontFamily: 'Titillium Web, Helvetica, sans-serif',
    color: 'primary.contrastText',
    backgroundColor: 'primary.main',
    pt: 0,
    pb: 2,
    pl: 2,
    pr: 2,
    borderRadius: '0',
    '& .MultiRadioSelectMenu': {
      fontFamily: 'Titillium Web, Helvetica, sans-serif',
      gap: 4,
      pr: 3,
    },
    '& .MultiRadioSelectMenuColumn': {
      fontFamily: 'Titillium Web, Helvetica, sans-serif',
      gap: 2,
    },
    '& .MultiRadioSelectMenuGroupLabel': {
      fontFamily: 'Titillium Web, Helvetica, sans-serif',
      textTransform: 'uppercase',
    },
    '& .NeedsSelection': {
      // padding: '5px',
      // border: '3px solid red',
      animation: `${needsSelection} 2s infinite ease`,
    },
    '& .MultiRadioSelectMenuItem': {
      opacity: theme.palette.action.notSelectedOpacity,
      '& svg': {
        color: 'primary.contrastText',
      },
    },
    '& .MultiRadioSelectMenuItem-selected': {
      opacity: '1',
    },
    '& hr': {
      borderColor: 'primary.contrastText',
      opacity: theme.palette.action.notSelectedOpacity,
    },
  },
});

export const LeftSpaceStyle = {
  fontFamily: 'Titillium Web, Helvetica, sans-serif',
  paddingLeft: 2,
};

export const ButtonBoxStyle = {
  display: 'flex',
  justifyContent: 'center',
  fontFamily: 'Titillium Web, Helvetica, sans-serif',
  alighItems: 'center',
  height: '100%',
  '.btn': {
    padding: '12px 0',
  },
};
