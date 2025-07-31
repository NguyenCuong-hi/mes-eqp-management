import React, { useEffect, useState } from 'react';

// material-ui
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// grid-app
import '@glideapps/glide-data-grid/dist/index.css'

import '../index.css'
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

// ==============================|| APP ||============================== //

const App = () => {
  const customization = useSelector((state) => state.customization);

    const LanguageProvider = ({ children, keyLanguage }) => {
    const [isReady, setIsReady] = useState(false);
    const [languageUser, setLanguageUser] = useState(Number(localStorage.getItem('language')) || 6);

    console.log('languageUser', languageUser);

    useEffect(() => {
      const initializeI18n = async () => {
        try {
          const languageData = await GetByLang(1);
          if (!languageData.data) {
            const defaultLanguageData = [
              {
                IdSeq: 1,
                Word: 'Từ điển mẫu',
                WordSeq: 'Từ điển'
              }
            ];
            i18n.use(initReactI18next).init({
              resources: {
                root: {
                  translation: defaultLanguageData.reduce((acc, item) => {
                    acc[item.WordSeq] = item.Word;
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
            acc[item.WordSeq] = item.Word;
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

  return (
    <>
      {
        <LanguageProvider >
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
