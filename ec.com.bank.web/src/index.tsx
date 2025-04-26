import { LayoutProvider } from './layout/context/layoutcontext';
import { PrimeReactProvider } from 'primereact/api';
import { ToastContainer } from 'react-toastify';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

import 'primereact/resources/primereact.css';
import './styles/layout/layout.scss';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './styles/custom.css';

const themeLink = document.createElement('link');
themeLink.id = 'theme-link';
themeLink.rel = 'stylesheet';
themeLink.href = '/theme/theme-light/blue/theme.css';
document.head.appendChild(themeLink);

createRoot(document.getElementById('root')!).render(
    <PrimeReactProvider>
        <LayoutProvider>
            <ToastContainer />
            <App />
        </LayoutProvider>
    </PrimeReactProvider>
);