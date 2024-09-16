import { Link } from 'react-router-dom';
import {
  Box,
  Grid,
  Link as MuiLink,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ExitIcon from '@mui/icons-material/HighlightOff';
import { useTranslation } from 'react-i18next';

import {
  PageContainerStyle,
  PageDataStyle,
  PageCloseStyle,
  ModalStyle,
  FakePageFooter,
  ScrollableStyle,
} from './styles';
import HeaderBar from '../HeaderBar';

const PageContainer = props => {
  const { children } = props;
  const { t } = useTranslation();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const style = {
    maxHeight: isMobile ? '10vh' : '5vh',
    minHeight: '30px',
    marginBottom: '30px',
  };
  const styleSquared = {
    maxHeight: isMobile ? '16vh' : '7vh',
    minHeight: '30px',
    marginBottom: '30px',
  };
  return (
    <Box>
      <HeaderBar></HeaderBar>
      <Box className="container">
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid item>
            <a
              href={'https://www.arpa.veneto.it/'}
              target={'_blank'}
              rel="noreferrer"
            >
              <img
                src={require('../../../assets/img/logo_arpav.png')}
                style={style}
                alt={'ARPA Veneto'}
              />
            </a>
          </Grid>
          <Grid item>
            <a
              href={'https://www.arpa.fvg.it/'}
              target={'_blank'}
              rel="noreferrer"
            >
              <img
                src={require('../../../assets/img/arpafvg-logo.png')}
                style={style}
                alt={'ARPA Friuli Venezia e Giulia'}
              />
            </a>
          </Grid>
          <Grid item>
            <a
              href={'https://www.snpambiente.it/'}
              target={'_blank'}
              rel="noreferrer"
            >
              <img
                src={require('../../../assets/img/logo_SNPA.png')}
                style={styleSquared}
                alt={'SNPAmbiente'}
              />
            </a>
          </Grid>
          {/*</Grid>*/}
          <Grid item>
            <a
              href={'https://www.regione.veneto.it/'}
              target={'_blank'}
              rel="noreferrer"
            >
              <img
                src={require('../../../assets/img/logo_regione_veneto.png')}
                style={styleSquared}
                alt={'Regione Veneto'}
              />
            </a>
          </Grid>
        </Grid>
      </Box>
      <Box className="container" sx={ScrollableStyle}>
        {children}
      </Box>
      <Box>
        <p />
      </Box>
    </Box>
  );
};

export default PageContainer;
