import React from 'react';
import { colors, createTheme, CssBaseline, ThemeProvider } from '@mui/material';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { MainScreen } from './screens/MainScreen';

const theme = createTheme( {
  cssVariables: true,
  colorSchemes: {
    light: {
      palette: {
        primary: colors.blue,
        secondary: colors.amber,
      },
    },
    dark: {
      palette: {
        primary: colors.blue,
        secondary: colors.amber,
      },
    },
  },
} );

export const App: React.FC = () =>
{
  return (
    <ThemeProvider theme={theme} defaultMode="system" storageManager={null}>
      <CssBaseline />
      <MainScreen />
    </ThemeProvider>
  );
};
