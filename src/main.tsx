import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { LanguageProvider } from './context/LanguageContext';

// Robust Network Disruption & Vite HMR WebSocket Error Shield
if (typeof window !== 'undefined') {
  const isDevOrWsDisruption = (errOrReason: any): boolean => {
    const text = String(
      errOrReason?.message ||
      errOrReason?.reason?.message ||
      errOrReason?.reason ||
      errOrReason?.detail ||
      errOrReason ||
      ''
    ).toLowerCase();

    return (
      text.includes('websocket') ||
      text.includes('ws://') ||
      text.includes('wss://') ||
      text.includes('vite') ||
      text.includes('hmr') ||
      text.includes('closed without opened') ||
      text.includes('connection reset') ||
      text.includes('failed to fetch') ||
      text.includes('network request failed')
    );
  };

  window.addEventListener('unhandledrejection', (event) => {
    if (isDevOrWsDisruption(event.reason || event)) {
      event.preventDefault();
      if (typeof event.stopImmediatePropagation === 'function') {
        event.stopImmediatePropagation();
      }
    }
  });

  window.addEventListener('error', (event) => {
    if (isDevOrWsDisruption(event.error || event.message || event)) {
      event.preventDefault();
      if (typeof event.stopImmediatePropagation === 'function') {
        event.stopImmediatePropagation();
      }
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
);

