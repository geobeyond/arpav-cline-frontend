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
              path="/fs"
              element={<MapPage map_data="future" map_mode="simple" />}
            />
            <Route
              path="/ps"
              element={<MapPage map_data="past" map_mode="simple" />}
            />
            <Route
              path="/fa"
              element={<MapPage map_data="future" map_mode="advanced" />}
            />
            <Route
              path="/pa"
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
