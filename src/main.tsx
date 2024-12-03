import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client';
import { LangueProvider } from './contexts/langue.context';
import './index.css';
import App from './App.tsx';

const root = createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <LangueProvider>
    <App />
    </LangueProvider>
  </StrictMode>
);
