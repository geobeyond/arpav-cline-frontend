/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { lightTheme, darkTheme } from './utils/theme';
import { SnackbarProvider, useSnackbar } from 'notistack';

import { MapPage } from './pages/MapPage/Loadable';
import IndexPage from './pages/IndexPage';
import { initReactI18next, useTranslation } from 'react-i18next';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ModalRouter from './components/Modals';
import InfoPage from './pages/InfoPage';
import DataPolicyPage from './pages/DataPolicyPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';

import { DevTools, Tolgee } from '@tolgee/react';
import { FormatSimple, I18nextPlugin, withTolgee } from '@tolgee/i18next';
import i18next from 'i18next';

const i18n = i18next;
//@ts-ignore
const tolgee = Tolgee().use(I18nextPlugin()).use(FormatSimple()).init({
  apiUrl: 'https://tolgee.arpav.geobeyond.dev',
  apiKey: 'tgpak_gfpwkzbqhbtgo4tcnfzge5leou4tezldnnsgo4tportds',
  defaultLanguage: 'it',
});

//require('@dotenvx/dotenvx').config({ path: ['.env.staging', '.env'] });

//@ts-ignore
withTolgee(i18n, tolgee)
  .use(initReactI18next)
  .init({
    //lng: 'en', // or use i18next language detector
    supportedLngs: ['it', 'en'],
    debug: false,
  });

export function App() {
  const { t, i18n } = useTranslation();
  // const {enqueueSnackbar, closeSnackbar} = useSnackbar();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = React.useMemo(
    () => createTheme(prefersDarkMode ? darkTheme : lightTheme),
    [prefersDarkMode],
  );
  // console.log('MOUNTING APP');

  React.useEffect(() => {
    // @ts-ignore
    var _paq = (window._paq = window._paq || []);
    /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
    _paq.push(['trackPageView']);
    _paq.push(['enableLinkTracking']);
    (function () {
      var u = 'https://ingestion.webanalytics.italia.it/';
      _paq.push(['setTrackerUrl', u + 'matomo.php']);
      _paq.push(['setSiteId', '41461']);
      var d = document,
        g = d.createElement('script'),
        s = d.getElementsByTagName('script')[0];
      g.async = true;
      g.src = u + 'matomo.js';
      s.parentNode?.insertBefore(g, s);
    })();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3}>
        <BrowserRouter>
          <Helmet
            titleTemplate={`%s - ${t('app.header.acronymMeaning')}`}
            defaultTitle={t('app.header.acronymMeaning')}
            htmlAttributes={{ lang: i18n.language }}
          >
            <meta name="description" content={t('app.header.acronymMeaning')} />
          </Helmet>
          <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/barometer" element={<IndexPage />} />
            <Route
              path="/proiezioni-semplice"
              element={<MapPage map_data="forecast" map_mode="simple" />}
            />
            <Route
              path="/storico-semplice"
              element={<MapPage map_data="past" map_mode="simple" />}
            />
            <Route
              path="/proiezioni-avanzata"
              element={<MapPage map_data="forecast" map_mode="advanced" />}
            />
            <Route
              path="/storico-avanzata"
              element={<MapPage map_data="past" map_mode="advanced" />}
            />

            <Route path="/info" element={<InfoPage />} />
            <Route path="/data" element={<DataPolicyPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
          </Routes>
          {/*<Routes>*/}
          {/*  <Route path="*" element={<MapPage />} />*/}
          {/*</Routes>*/}
          {/*<GlobalStyle />*/}
        </BrowserRouter>
      </SnackbarProvider>
    </ThemeProvider>
  );
}
