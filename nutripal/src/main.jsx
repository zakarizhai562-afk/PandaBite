import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { StarsProvider } from './core/context/StarsContext';
import { PetStateProvider } from './core/context/PetStateContext';
import './index.css';

const root = createRoot(document.getElementById('root'));
try {
  root.render(
    <StrictMode>
      <StarsProvider>
        <PetStateProvider>
          <App />
        </PetStateProvider>
      </StarsProvider>
    </StrictMode>
  );
} catch (err) {
  console.error('RENDER ERROR:', err);
  document.getElementById('root').innerHTML = '<pre>' + err.message + '</pre>';
}
