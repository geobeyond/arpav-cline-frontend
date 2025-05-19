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
  MenuItem,
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
import { ArrowDropDown } from '@mui/icons-material';
import { useEffect } from 'react';
class HeaderBarProps {
  mode?: 'compact' | 'full' = 'compact';
}

const HeaderBar = (props: HeaderBarProps) => {
  const { t, i18n } = useTranslation();
  // const actualstate = useSelector(state => state);
  // const route = useLocation();
  // console.log({ route, actualstate });
  const regioneImg = '/img/logo_regione_veneto.png';
  const arpavImg = '/img/logo_arpav.png';
  const snpaImg = '/img/logo_SNPA.png';

  const theme = useTheme();
  let lang = i18n.language;
  const isMobile = useMediaQuery(theme.breakpoints.down('def'));

  const style = {
    maxHeight: '7svh',
    minHeight: '30px',
  };

  const setLang = lang => {
    localStorage.setItem('chosenLang', lang);
    localStorage.setItem('chosenLang', lang);
    i18n.changeLanguage(lang);
  };

  useEffect(() => {
    const l = localStorage.getItem('chosenLang');
    if (l) {
      lang = l;
    } else {
      lang = 'it';
    }
    i18n.changeLanguage(lang);
    setTimeout(() => {
      i18n.changeLanguage(lang);
    }, 300);
  }, []);

  return (
    <Headers>
      <Header theme="light" type="slim" style={HeaderStyle}>
        <HeaderContent>
          {isMobile ? (
            <>
              <a style={HeaderBrandStyle} href="/">
                <b className="green">{t('app.header.acronymMeaning')}</b>
              </a>
              <Dropdown className="me-3">
                <DropdownToggle tag="a" color="primary">
                  <MenuIcon />
                </DropdownToggle>
                <DropdownMenu style={{ width: 200 }}>
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
            <>
              <HeaderBrand style={HeaderBrandStyle} href="/">
                <b className="green">{t('app.header.acronymMeaning')}</b>
              </HeaderBrand>
              <HeaderRightZone>
                <Dropdown className="me-3">
                  <DropdownToggle tag="a" color="primary">
                    {lang} <ArrowDropDown />
                  </DropdownToggle>
                  <DropdownMenu>
                    <MenuItem onClick={() => setLang('it')}>IT</MenuItem>
                    <MenuItem onClick={() => setLang('en')}>EN</MenuItem>
                  </DropdownMenu>
                </Dropdown>
              </HeaderRightZone>
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
            </>
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
          </HeaderContent>
        </Header>
      ) : (
        <></>
      )}
    </Headers>
  );
};
export default HeaderBar;
