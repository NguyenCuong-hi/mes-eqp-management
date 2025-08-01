import React, { useEffect, useState } from 'react';

// material-ui
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// grid-app
import '@glideapps/glide-data-grid/dist/index.css';

import '../index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// third-party
import { useSelector } from 'react-redux';

// project import
import theme from 'themes';
import NavigationScroll from './NavigationScroll';
import MainRoutes from 'routes/MainRoutes';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { GetByLang } from 'services/Lang/GetByLang';
import LoadingBlur from 'component/Loader/LoadingBlur';
import AuthLogin from 'views/Login/AuthLogin';
import { GetUserService } from 'services/Auth/GetUserService';

// ==============================|| APP ||============================== //

const App = () => {
  const customization = useSelector((state) => state.customization);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingLogin, setCheckingLogin] = useState(true);
  const [languageUser, setLanguageUser] = useState(Number(localStorage.getItem('language')) || 6);

  const LanguageProvider = ({ children, keyLanguage }) => {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      const initializeI18n = async () => {
        try {
          const languageData = await GetByLang(keyLanguage);
          if (!languageData.data) {
            const defaultLanguageData = [
              {
                lang: 1,
                langCode: '1',
                word: 'Từ điển'
              }
            ];
            i18n.use(initReactI18next).init({
              resources: {
                root: {
                  translation: defaultLanguageData.reduce((acc, item) => {
                    acc[item.langCode] = item.word;
                    return acc;
                  }, {})
                }
              },
              lng: 'root',
              fallbackLng: 'root',
              interpolation: {
                escapeValue: false
              }
            });

            setIsReady(true);
            return;
          }

          const translations = languageData.data.reduce((acc, item) => {
            acc[item.langCode] = item.word;
            return acc;
          }, {});

          i18n.use(initReactI18next).init({
            resources: {
              root: {
                translation: translations
              }
            },
            lng: languageUser.toString(),
            fallbackLng: 'root',
            interpolation: {
              escapeValue: false
            }
          });

          setIsReady(true);
        } catch (error) {
          console.error('Error initializing i18n:', error);
          setIsReady(true);
        }
      };

      initializeI18n();
    }, [languageUser]);

    if (!isReady) return null;

    return children;
  };

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await GetUserService();
        if (res.success) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        setIsLoggedIn(false);
      } finally {
        setCheckingLogin(false);
      }
    };
    checkLogin();
  }, []);

  if (checkingLogin) {
    return <LoadingBlur />;
  }
  if (!isLoggedIn) {
    return <AuthLogin languageUser={languageUser} setLanguageUser={setLanguageUser} setIsLoggedIn={setIsLoggedIn} />;
  }

  return (
    <>
      {
        <LanguageProvider keyLanguage={languageUser}>
          <NavigationScroll>
            <StyledEngineProvider injectFirst>
              <ThemeProvider theme={theme(customization)}>
                <CssBaseline />
                <MainRoutes />
              </ThemeProvider>
            </StyledEngineProvider>
          </NavigationScroll>
        </LanguageProvider>
      }
    </>
  );
};

export default App;
