import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enAuth from "./locales/en/auth.json";
import enCommon from "./locales/en/common.json";
import enDashboard from "./locales/en/dashboard.json"

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",

    resources: {
      en: {
        auth: enAuth,
        common: enCommon,
        dashboard: enDashboard
      },
    },

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

export const I18N_NAMESPACES = {
  AUTH: "auth",
  COMMON: "common",
  
};
