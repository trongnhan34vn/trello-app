import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { LoadingProvider } from './context/LoadingProvider.tsx';
import './i18n';
import './index.css';
import { store } from './redux/index.ts';

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <LoadingProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,

          style: {
            background: '#ffffff',
            color: '#16191f', // AWS dark text
            border: '1px solid #d5dbdb', // AWS border gray
            borderRadius: '8px',
            padding: '12px 14px',
            boxShadow: '0 6px 20px rgba(0, 28, 36, 0.15)',
          },

          success: {
            style: {
              borderLeft: '4px solid #2bb24c',
            },
            iconTheme: {
              primary: '#2bb24c',
              secondary: '#ffffff',
            },
          },

          error: {
            style: {
              borderLeft: '4px solid #d13212',
            },
            iconTheme: {
              primary: '#d13212',
              secondary: '#ffffff',
            },
          },

          loading: {
            style: {
              borderLeft: '4px solid #0972d3',
            },
            iconTheme: {
              primary: '#0972d3',
              secondary: '#ffffff',
            },
          },
        }}
      />
    </LoadingProvider>
  </Provider>,
);
