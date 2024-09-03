import { Link } from 'react-router-dom';
import { Box, Link as MuiLink } from '@mui/material';
import ExitIcon from '@mui/icons-material/HighlightOff';
import { useTranslation } from 'react-i18next';

import {
  PageContainerStyle,
  PageDataStyle,
  PageCloseStyle,
  ModalStyle,
  FakePageFooter,
} from './styles';
import HeaderBar from '../HeaderBar';

const PageContainer = props => {
  const { children } = props;
  const { t } = useTranslation();

  return (
    <Box>
      <HeaderBar></HeaderBar>

      <Box>
        <Box>
          {children}
          <Box>
            <p />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PageContainer;
