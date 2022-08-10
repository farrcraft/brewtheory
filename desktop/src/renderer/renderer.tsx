import { createRoot } from 'react-dom/client';
import App from './App';

// Security - Override & Disable eval
// ESLint will warn about any use of eval(), even this one
// eslint-disable-next-line
window.eval = global.eval = function() {
  throw new Error('Sorry, this app does not support window.eval().');
};

const container = document.getElementById('root');
if (container !== null) {
  const root = createRoot(container);
  root.render(<App />);
}
