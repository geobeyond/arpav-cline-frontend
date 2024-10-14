export const TopHeroStyle: React.CSSProperties = {
  backgroundColor: 'white',
  height: '700px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  fontFamily: 'Titillium Web, Helvetica Neue, Helvetica, Arial, sans-serif',
};

export const HeroStyle = {
  backgroundColor: 'white',
};

export const TitleTSStyle = theme => ({
  color: 'success.dark',
  fontWeight: 'bold',
  display: 'flex',
  justifyContent: 'center',
  mt: 5,
  mb: 3,
});

export const TSModalStyle = theme => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
});

export const TSContainerStyle = theme => ({
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

export const TSDataContainerStyle = theme => ({
  width: '100%',
  height: '300px',
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
    pt: 2,
    pb: 2,
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
  display: 'flex',
  flexDirection: 'row',
  gap: '0.5em',
  ml: 5,
  mr: 5,
  mt: 3,
  mb: 3,
  [theme.breakpoints.down('def')]: {
    mt: 1,
    mb: 1,
  },
});

export const RowContainerStyle = theme => ({
  display: 'flex',
  flexDirection: 'row',
  [theme.breakpoints.down('def')]: {
    flexDirection: 'column',
    mt: 5,
    mb: 5,
  },
});

export const FormTitleTextStyle = theme => ({
  color: 'secondary.dark',
  fontWeight: 'bold',
  pt: 8,
});

export const ChartContainerStyle = theme => ({
  '& .echarts-for-react': {
    minHeight: '500px',
  },
});

export const ChartLoaderContainerStyle = theme => ({
  display: 'flex',
  justifyContent: 'center',
  paddingTop: 18,
});
