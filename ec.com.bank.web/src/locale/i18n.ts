import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';

// Importa los módulos de traducción
import dashboardES from './es/dashboard.json';
import dashboardEN from './en/dashboard.json';
import loginES from './es/login.json';
import loginEN from './en/login.json';
import commonES from './es/common.json'
import commonEN from './en/common.json'
import searchUsernameES from './es/searchUsername.json';
import searchUsernameEN from './en/searchUsername.json';
import verificationES from './es/verification.json';
import verificationEN from './en/verification.json';
import newPasswordES from './es/newPassword.json';
import newPasswordEN from './en/newPassword.json';
import myProfileES from './es/myProfile.json';
import myProfileEN from './en/myProfile.json';
import changePasswordES from './es/changePassword.json';
import changePasswordEN from './en/changePassword.json';
import systemStyleES from './es/systemStyle.json';
import systemStyleEN from './en/systemStyle.json';
import segundoFactorAutenticacionES from './es/segundoFactorAutenticacion.json';
import segundoFactorAutenticacionEN from './en/segundoFactorAutenticacion.json';

// Configuración de i18next
i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources: {
      es: {
        common: commonES,
        dashboard: dashboardES,
        login: loginES,
        searchUsername: searchUsernameES,
        verification: verificationES,
        newPassword: newPasswordES,
        myProfile: myProfileES,
        changePassword: changePasswordES,
        systemStyle: systemStyleES,
        segundoFactorAutenticacion: segundoFactorAutenticacionES
      },
      en: {
        common: commonEN,
        dashboard: dashboardEN,
        login: loginEN,
        searchUsername: searchUsernameEN,
        verification: verificationEN,
        newPassword: newPasswordEN,
        myProfile: myProfileEN,
        changePassword: changePasswordEN,
        systemStyle: systemStyleEN,
        segundoFactorAutenticacion: segundoFactorAutenticacionEN
      }
    },
    lng: localStorage.getItem('i18nextLng') || 'es',
    fallbackLng: 'es',
    ns: ['common', 'dashboard', 'login', 'searchUsername', 'verification', 'newPassword', 'myProfile', 'changePassword', 'systemStyle'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export const changeLanguage = async (lang: string) => {
  try {
    await i18n.changeLanguage(lang);
    localStorage.setItem('i18nextLng', lang);
    return true;
  } catch (error) {
    console.error('Error changing language:', error);
    return false;
  }
};

export default i18n;