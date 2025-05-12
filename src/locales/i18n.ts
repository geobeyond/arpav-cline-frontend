import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import {
  DevTools,
  FormatSimple,
  I18nextPlugin,
  Tolgee,
  withTolgee,
} from '@tolgee/i18next';

import en from './en/translation.json';
import it from './it/translation.json';
import { convertLanguageJsonToObject } from './translations';

export const translationsJson = {
  en: {
    translation: en,
  },
  it: {
    translation: it,
  },
};

let lang = 'it';
let l = localStorage.getItem('chosenLang');
if (l) {
  lang = l;
}
localStorage.setItem('chosenLang', lang);

// Create the 'translations' object to provide full intellisense support
convertLanguageJsonToObject(en);
convertLanguageJsonToObject(it);

const tolgee = Tolgee()
  .use(DevTools())
  .use(FormatSimple())
  .use(I18nextPlugin())
  .init({
    apiUrl:
      process.env.REACT_APP_TOLGEE_API_URL ||
      'https://tolgee.arpav.geobeyond.dev',
    apiKey:
      process.env.REACT_APP_TOLGEE_API_KEY ||
      'tgpak_gfptqodemjztqojvhayxeojrnnrgk3dfnrvxcnjvn5ygq',
    defaultLanguage: lang,
  });

// Initialize i18next without Tolgee first
const i18nextInstance = i18next.use(initReactI18next).use(LanguageDetector);

// Then wrap it with Tolgee
export const i18n = withTolgee(i18nextInstance, tolgee).init({
  resources: translationsJson,
  fallbackLng: lang,
  supportedLngs: ['it', 'en'],
  //lng: lang, // Default language
  interpolation: {
    escapeValue: false,
  },
  debug: true,
});

export default i18n;
