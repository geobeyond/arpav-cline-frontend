/**
 * index.tsx
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import chalk from 'chalk';

import * as React from 'react';
import ReactDOM, { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

// Use consistent styling
import 'sanitize.css/sanitize.css';
import 'bootstrap-italia/dist/css/bootstrap-italia.min.css';

import 'typeface-titillium-web';

import { TOLGEE_BASE_URL } from 'utils/constants';

import { App } from 'app';

import { HelmetProvider } from 'react-helmet-async';

import { configureAppStore } from 'store/configureStore';

import { ThemeProvider } from 'styles/theme/ThemeProvider';

import reportWebVitals from 'reportWebVitals';
import i18n from 'i18next';

import { withTolgee, Tolgee, I18nextPlugin, DevTools } from '@tolgee/i18next';

// Initialize languages
import './locales/i18n';
import { initReactI18next } from 'react-i18next';

(() => {
  let lang = 'it';
  let l = localStorage.getItem('chosenLang');
  if (l) {
    lang = l;
  }
  localStorage.setItem('chosenLang', lang);
})();

const { store } = configureAppStore();
// console.log({store})
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container!);

let lang = 'it';
const l = localStorage.getItem('chosenLang');
if (l) {
  lang = l;
} else {
  lang = 'it';
}
localStorage.setItem('chosenLang', lang);

console.log(chalk.blue(`USING >> ${process.env.REACT_APP_BACKEND_PUBLIC_URL}`));

root.render(
  <Provider store={store}>
    <ThemeProvider>
      <HelmetProvider>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </HelmetProvider>
    </ThemeProvider>
  </Provider>,
);

// Hot reloadable translation json files
if (module.hot) {
  module.hot.accept(['./locales/i18n'], () => {
    // No need to render the App again because i18next works with the hooks
  });
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
