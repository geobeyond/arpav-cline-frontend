import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Box,
  AppBar,
  IconButton,
  Link as MuiLink,
  Typography,
  Button,
  Toolbar,
  useMediaQuery,
} from '@mui/material';
import {
  Headers,
  Header,
  HeaderBrand,
  HeaderContent,
  HeaderRightZone,
  HeaderProps,
  HeaderSearch,
  Icon,
  Row,
  HeaderLinkZone,
  HeaderSocialsZone,
  LinkList,
  LinkListItem,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
} from 'design-react-kit';
import 'typeface-titillium-web';

import { useTheme } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';
import {
  AppBarStyle,
  ToolBarStyle,
  BoxTitleStyle,
  BoxMenuStyle,
  BoxImgStyle,
  LogoStyle,
  LogoStyleV,
  HeaderStyle,
  HeaderBrandStyle,
  LinkStyle,
  HeaderTextStyle,
} from './styles';
import MenuIcon from '@mui/icons-material/Menu';

import { Link } from 'react-router-dom';
class HeaderBarProps {
  mode?: 'compact' | 'full' = 'compact';
}

const HeaderBar = (props: HeaderBarProps) => {
  const { t } = useTranslation();
  // const actualstate = useSelector(state => state);
  // const route = useLocation();
  // console.log({ route, actualstate });
  const regioneImg = '/img/logo_regione_veneto.png';
  const arpavImg = '/img/logo_arpav.png';
  const snpaImg = '/img/logo_SNPA.png';

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('def'));

  const style = {
    maxHeight: '7svh',
    minHeight: '30px',
  };

  return (
    <Headers>
      <Header theme="light" type="slim" style={HeaderStyle}>
        <HeaderContent>
          <HeaderBrand style={HeaderBrandStyle} href="/">
            <b className="green">{t('app.header.acronymMeaning')}</b>
          </HeaderBrand>
          {isMobile ? (
            <>
              <b className="green">{t('app.header.acronymMeaning')}</b>

              <Dropdown className="me-3">
                <DropdownToggle tag="a" color="primary">
                  <MenuIcon />
                </DropdownToggle>
                <DropdownMenu>
                  <LinkList>
                    <LinkListItem href="/info" style={LinkStyle}>
                      {t('app.header.menu.info')}
                    </LinkListItem>
                    <LinkListItem href="/privacy" style={LinkStyle}>
                      {t('app.header.menu.privacyPolicy')}
                    </LinkListItem>
                    <LinkListItem href="/data" style={LinkStyle}>
                      {t('app.header.menu.dataPolicy')}
                    </LinkListItem>
                  </LinkList>
                </DropdownMenu>
              </Dropdown>
            </>
          ) : (
            <HeaderRightZone>
              <HeaderLinkZone>
                <LinkList>
                  <LinkListItem href="/info" style={LinkStyle}>
                    {t('app.header.menu.info')}
                  </LinkListItem>
                  <LinkListItem href="/privacy" style={LinkStyle}>
                    {t('app.header.menu.privacyPolicy')}
                  </LinkListItem>
                  <LinkListItem href="/data" style={LinkStyle}>
                    {t('app.header.menu.dataPolicy')}
                  </LinkListItem>
                </LinkList>
              </HeaderLinkZone>
            </HeaderRightZone>
          )}
        </HeaderContent>
      </Header>
      {props.mode === 'full' && !isMobile ? (
        <Header theme="light" type="center">
          <HeaderContent>
            <HeaderBrand>
              <a
                href={'https://www.arpa.veneto.it/'}
                target={'_blank'}
                rel="noreferrer"
              >
                <img
                  src={require('../../../assets/img/logo_arpav.png')}
                  alt="arpav"
                  style={style}
                ></img>
              </a>
            </HeaderBrand>
            <HeaderBrand>
              <a
                href={'https://www.arpa.fvg.it/'}
                target={'_blank'}
                rel="noreferrer"
              >
                <img
                  src={require('../../../assets/img/arpafvg-logo.png')}
                  alt="arpafvg"
                  style={style}
                ></img>
              </a>
            </HeaderBrand>
            <HeaderBrand>
              <a
                href={'https://www.snpambiente.it/'}
                target={'_blank'}
                rel="noreferrer"
              >
                <img
                  src={require('../../../assets/img/logo_SNPA.png')}
                  alt="arpav"
                  style={style}
                ></img>
              </a>
            </HeaderBrand>
            <HeaderBrand>
              <a
                href={'https://www.regione.veneto.it/'}
                target={'_blank'}
                rel="noreferrer"
              >
                <img
                  src={require('../../../assets/img/logo_regione_veneto.png')}
                  alt="arpav"
                  style={style}
                ></img>
              </a>
            </HeaderBrand>
            <HeaderRightZone style={HeaderTextStyle}>
              <HeaderSocialsZone>
                <ul>
                  <li>
                    <a
                      aria-label="Facebook"
                      href="https://www.facebook.com"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Icon icon="it-facebook" />
                    </a>
                  </li>
                  <li>
                    <a
                      aria-label="Github"
                      href="https://www.github.com"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Icon icon="it-github" />
                    </a>
                  </li>
                  <li>
                    <a
                      aria-label="Twitter"
                      href="https://www.x.com"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Icon icon="it-twitter" />
                    </a>
                  </li>
                </ul>
              </HeaderSocialsZone>
              <HeaderSearch iconName="it-search" label="Cerca" />
            </HeaderRightZone>
          </HeaderContent>
        </Header>
      ) : (
        <></>
      )}
    </Headers>
  );
};
export default HeaderBar;

//

//
