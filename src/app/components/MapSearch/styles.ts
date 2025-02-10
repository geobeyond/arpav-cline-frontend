export const MapSearchContainerStyle = theme => ({
  p: 0.5,
  // pt: 0.5,
  backgroundColor: 'background.paper',
  [theme.breakpoints.down('def')]: {
    // pl: 0.1, pr: 0.1,
    pl: 0,
    pr: 0,
  },
});

export const AutocompleteSyle = theme => ({
  width: '20em',
  [theme.breakpoints.down('def')]: {
    width: '18em',
  },
});

export const MapSearchFirstRowStyle = theme => ({
  p: '2px 4px',
  display: 'flex',
  alignItems: 'center',
  gap: 1.5,
  boxShadow: 'none',
});

export const MapSearchSecondRowStyle = theme => ({
  m: 0,
  p: '2px 4px',
  display: 'flex',
  alignItems: 'center',
  gap: 1.5,
  h: 45,
  boxShadow: 'none',
  justifyContent: 'space-around',
});

export const LatLngStyle = theme => ({
  '& input': {
    width: '124px',
    margin: '7px',
    height: '14px',
  },
  height: 'max-content',
});
