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

// Import the configured i18n instance
import { i18n } from '../locales/i18n';
import { RequestApi } from './Services/API/Requests';

export function App() {
  const { t, i18n } = useTranslation();
  const api = RequestApi.getInstance();
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

    api.updateCache();
  }, []);

  React.useEffect(() => {
    let year = '';
    let url = new URL(window.location.href);
    try {
      if (url.searchParams.has('year')) {
        //@ts-ignore
        year = url.searchParams.get('year');
        localStorage.setItem('currentYear', year);
      }
    } catch (e) {
      // console.log('no year')
    }
    let lang = 'it';
    try {
      if (url.searchParams.has('lang')) {
        //@ts-ignore
        lang = url.searchParams.get('lang');
        localStorage.setItem('chosenLang', lang);
        localStorage.setItem('i18nextLng', lang);
        i18n.changeLanguage(lang);
      }
    } catch (e) {
      // console.log('no year');
    }
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
