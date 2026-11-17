import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';
import { applyTheme, getStoredThemeConfig } from './lib/theme';

// Apply cached theme immediately to prevent any theme flash on load
applyTheme(getStoredThemeConfig());

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

