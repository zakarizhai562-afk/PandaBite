import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const root = createRoot(document.getElementById('root'));
try {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} catch (err) {
  console.error('RENDER ERROR:', err);
  document.getElementById('root').innerHTML = '<pre>' + err.message + '</pre>';
}
