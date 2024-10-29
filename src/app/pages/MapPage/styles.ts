export const mapStyle = theme => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100vw',
  alighItems: 'stretch',
  // minHeight: "80vh",
  // height: '80vh'
  // height: '92vh',
  // marginTop: theme.custom.headerHeight,
  marginTop: 0,
  // height: `calc(100vh - ${theme.custom.headerHeight})`,
  height: '100vh',
  // minHeight: '92vh'
  '& .leaflet-bottom .leaflet-bar-timecontrol': {
    // width: '10px',
    flexWrap: 'nowrap',
    mb: 3,
    '&>.timecontrol-date': {
      minWidth: 'fit-content',
      width: 'auto',
      pt: 0,
      pb: 0,
      pl: 2.5,
      pr: 2.5,
      '&:hover': {
        position: 'static',
        minWidth: 'fit-content',
        width: 'auto',
        pt: 0,
        pb: 0,
        pl: 2.5,
        pr: 2.5,
        whiteSpace: 'nowrap',
      },
      [theme.breakpoints.down('def')]: {
        pl: 1,
        pr: 1,
        '&:hover': {
          pl: 1,
          pr: 1,
        },
      },
    },
    '& .timecontrol-dateslider .slider': {
      [theme.breakpoints.down('def')]: {
        width: '110px',
      },
    },
  },
});

export const MapLoadingContainerStyle = theme => ({
  height: '100%',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

export const SpinnerStyle = theme => ({
  position: 'fixed',
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  top: 0,
});
