export const TitleDownloadStyle = theme => ({
  color: 'success.dark',
  fontWeight: 'bold',
  display: 'flex',
  justifyContent: 'center',
  mt: 5,
  mb: 3,
});

export const DownloadModalStyle = theme => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
});

export const DownloadContainerStyle = theme => ({
  overflow: 'auto',
  boxSizing: 'border-box',
  width: `calc(100% - ${theme.spacing(4)})`,
  height: `calc(100% - ${theme.spacing(4)})`,
  p: 0,
  m: 0,
  bgcolor: 'background.paper',
  borderRadius: theme.shape.borderRadius,
  boxShadow: 12,
});

export const MapUserContainerStyle = theme => ({
  p: 0,
  pt: 4,
  m: 0,
});

export const CloseIconContStyle = theme => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'flex-start',
  padding: 0,
});

export const DLButtonContStyle = theme => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'flex-end',
  padding: 4,
  [theme.breakpoints.down('def')]: {
    justifyContent: 'center',
    pt: 1,
    pb: 1,
  },
});

export const CloseButtonContStyle = theme => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'flex-end',
  padding: 4,
  [theme.breakpoints.down('def')]: {
    justifyContent: 'center',
    pt: 2,
    pb: 2,
  },
});

export const FieldContainerStyle = theme => ({
  ml: 0,
  mr: 0,
  width: '100%',
  maxWidth: '450px',
});
export const FullWidthStyle = theme => ({
  width: '100%',
  maxWidth: '24vw',
});

export const MapDataContainerStyle = theme => ({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'flex-start',
  gap: 8,
  [theme.breakpoints.down('xl')]: {
    justifyContent: 'space-between',
    gap: 0,
  },
});

export const FieldsStyle = theme => ({
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'wrap',
});

export const MapDataSectionTextStyle = theme => ({
  color: 'success.dark',
  fontWeight: 'bold',
});

export const MapDataValueTextStyle = theme => ({
  color: 'success.dark',
});

export const SliderContainerStyle = theme => ({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'nowrap',
  alignItems: 'center',
  marginTop: 4,
});

export const MapColStyle = theme => ({
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'nowrap',
  marginTop: 4,
  gap: '16px',
  width: '40%',
});

export const RowStyle = theme => ({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'nowrap',
  marginTop: 4,
  gap: '16px',
});

export const YearsSliderStyle = theme => ({
  ml: 3,
  mr: 3,
  maxWidth: '24em',
  [theme.breakpoints.down('def')]: {
    ml: 2,
    mr: 2,
  },
  '& .MuiSlider-valueLabel': {
    backgroundColor: 'success.dark',
  },
});

export const InputYearStyle = theme => ({
  width: '9em',
  [theme.breakpoints.down('def')]: {
    width: '8.5em',
  },
});

export const ImgButtonContainerStyle = theme => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',

  gap: 2,
  [theme.breakpoints.down('def')]: {
    flexDirection: 'column',
  },
});

export const ImgDoubleButtonContainerStyle = theme => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  gap: 2,
});

export const ModalStyle = theme => ({
  display: 'flex',
  flexDirection: 'column',
  width: '90%',
  height: '400px',
  p: 0,
  position: 'fixed',
  left: '16px',
  bottom: '16px',
  bgcolor: 'white',
  borderRadius: theme.shape.borderRadius,
  boxShadow: 12,
});

export const ExtractionStyle = theme => ({
  bottom: '40px',
  position: 'absolute',
  left: '25%',
  right: '25%',
  width: '50%',
  maxWidth: '800px',
});
