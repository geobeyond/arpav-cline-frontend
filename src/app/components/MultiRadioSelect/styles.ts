export const MultiRadioSelectMenuStyle = theme => ({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  [theme.breakpoints.down('def')]: {
    flexDirection: 'column',
  },
});

export const ColumnMenuStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
};

export const GroupMenuStyle = {
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'wrap',

  '& .MuiMenuItem-root': {
    whiteSpace: 'initial',
  },

  '& .MuiFormControlLabel-root': {
    pt: 2,
    pb: 0,
    pl: 0,
    pr: 2, // equivalent to paddingRight: theme => theme.spacing(2)
    marginLeft: 0,
    marginRight: 0,
    width: '100%',
    alignItems: 'flex-start',
  },

  '& .MuiButtonBase-root': {
    pt: 0,
  },
};

export const MulticolGroupMenuStyle = {
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'wrap',
  maxHeight: '450px',

  '& .MuiMenuItem-root': {
    whiteSpace: 'initial',
  },

  '& .MuiFormControlLabel-root': {
    pt: 2,
    pb: 0,
    pl: 0,
    pr: 2, // equivalent to paddingRight: theme => theme.spacing(2)
    marginLeft: 0,
    marginRight: 0,
    width: '100%',
    alignItems: 'flex-start',
  },

  '& .MuiButtonBase-root': {
    pt: 0,
  },
};

export const MenuLabelStyle = theme => ({
  display: 'flex',
  height: '20px',
  flexDirection: 'row',
  justifyContent: 'space-between',
  gap: 1,
  [theme.breakpoints.down('def')]: {
    flexDirection: 'column',
  },
});

export const SelectStyle = {
  height: '100%',
  '& .MuiOutlinedInput-notchedOutline': {
    borderStyle: 'none',
  },
};

export const GroupLabelStyle = {
  paddingLeft: 1,
  paddingRight: 1,
};

export const DividerStyle = {
  marginLeft: 1,
  marginRight: 1,
};
export const IconBoxStyle = {
  display: 'flex',
  justifyContent: 'center',
};

export const ExitContainerStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
};

export const ExitIconStyle = {
  pt: 1,
  pb: 2,
  pr: 0,
  pl: 1,
};
