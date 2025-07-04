import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { Provider } from './components/chakra/provider.tsx';

createRoot(document.getElementById('root')!).render(
  <Provider>
    <App />
  </Provider>
);
