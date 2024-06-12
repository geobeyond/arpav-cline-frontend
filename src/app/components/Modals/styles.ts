export const ModalStyle = theme => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'flex-start',
  top: theme.custom.headerHeight,
  '& > .MuiBackdrop-root': {
    top: theme.custom.headerHeight,
  },
});

export const PageContainerStyle = theme => ({
  overflow: 'auto',
  mt: '1%',
  height: '96%',
  // pt: 4,
  // pd: 4,
  // pl: 5,
  // pr: 1,
  p: 0,
  bgcolor: 'background.paper',
  width: '70%',
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.down('def')]: {
    mt: '2%',
    width: '98%',
  },
});

export const PageDataStyle = theme => ({
  pt: 4,
  pb: 0,
  pl: 6,
  pr: 1,
});

export const PageCloseStyle = theme => ({
  p: 1,
});

export const FakePageFooter = theme => ({
  '&>p': {
    height: 4,
  },
});
