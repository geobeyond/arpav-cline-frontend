import { Link } from 'react-router-dom';
import { Box, Link as MuiLink } from '@mui/material';
import ExitIcon from '@mui/icons-material/HighlightOff';
import { useTranslation } from 'react-i18next';

import {
  PageContainerStyle,
  PageDataStyle,
  PageCloseStyle,
  FakePageFooter,
} from './styles';
import HeaderBar from '../HeaderBar';

const PageContainer = props => {
  const { children } = props;
  const { t } = useTranslation();

  return (
    <>
      <HeaderBar></HeaderBar>

      <Box sx={PageContainerStyle}>
        <Box sx={PageDataStyle}>
          {children}
          <Box sx={FakePageFooter}>
            <p />
          </Box>
        </Box>
        <Box sx={PageCloseStyle}>
          <MuiLink
            component={Link}
            to="/"
            color="success.dark"
            underline={'none'}
          >
            <ExitIcon
              color={'secondary'}
              fontSize={'large'}
              aria-label={t('app.common.close')}
            />
          </MuiLink>
        </Box>
      </Box>
    </>
  );
};

export default PageContainer;
