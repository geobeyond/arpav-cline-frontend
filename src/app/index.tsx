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
import { useTranslation } from 'react-i18next';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ModalRouter from './components/Modals';
import InfoPage from './pages/InfoPage';
import DataPolicyPage from './pages/DataPolicyPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';

import { TolgeeProvider, DevTools, FormatSimple, Tolgee } from '@tolgee/react';

const tolgee = Tolgee().use(DevTools()).use(FormatSimple()).init({
  language: 'en',
  apiUrl: process.env.REACT_APP_TOLGEE_API_URL,
  apiKey: process.env.REACT_APP_TOLGEE_API_KEY,
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

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3}>
        <TolgeeProvider tolgee={tolgee}>
          <BrowserRouter>
            <Helmet
              titleTemplate={`%s - ${t('app.header.acronymMeaning')}`}
              defaultTitle={t('app.header.acronymMeaning')}
              htmlAttributes={{ lang: i18n.language }}
            >
              <meta
                name="description"
                content={t('app.header.acronymMeaning')}
              />
            </Helmet>
            <Routes>
              <Route path="/" element={<IndexPage />} />
              <Route path="/barometer" element={<IndexPage />} />
              <Route
                path="/proiezioni-semplice"
                element={<MapPage map_data="future" map_mode="simple" />}
              />
              <Route
                path="/storico-semplice"
                element={<MapPage map_data="past" map_mode="simple" />}
              />
              <Route
                path="/proiezioni-avanzata"
                element={<MapPage map_data="future" map_mode="advanced" />}
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
        </TolgeeProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}
