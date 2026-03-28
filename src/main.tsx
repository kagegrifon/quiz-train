import '@mantine/core/styles.css';
import './index.css';
import { localStorageColorSchemeManager, MantineProvider } from '@mantine/core';
import { RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { router } from './app/router';

const colorSchemeManager = localStorageColorSchemeManager({ key: 'programmingQuizTheme' });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider colorSchemeManager={colorSchemeManager} defaultColorScheme="auto">
      <RouterProvider router={router} />
    </MantineProvider>
  </StrictMode>
);
