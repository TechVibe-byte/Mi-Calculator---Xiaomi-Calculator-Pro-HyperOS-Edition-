import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {registerSW} from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';

// Automatically register service worker for offline support
registerSW({
  immediate: true,
  onRegistered(r) {
    if (r) {
      console.log('Mi Calculator PWA Service Worker registered for offline use');
    }
  },
  onRegisterError(error) {
    console.warn('PWA Service Worker registration error:', error);
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

