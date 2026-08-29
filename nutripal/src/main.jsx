import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { StarsProvider } from './core/context/StarsContext';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StarsProvider>
      <App />
    </StarsProvider>
  </StrictMode>
);
