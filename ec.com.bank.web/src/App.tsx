import React, { Suspense, lazy, useState, useEffect } from 'react';
import { LayoutProvider } from './layout/context/layoutcontext';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import LoaderComponent from 'components/Loader/Loader';
import ProtectedRoute from './routes/ProtectedRoute';
import { PrimeReactProvider } from 'primereact/api';
import PublicRoute from './routes/PublicRoute';
import { IRoute, routes } from 'routes/Routes';
import Layout from './layout/layout';
import Home from 'pages/dashboard/DashboardContainer';

const Login = lazy(() => import('./pages/auth/login'));
const ForgotPassword = lazy(() => import('./pages/auth/SearchUsername'));
const NotFound = lazy(() => import('./pages/common/NotFoundScreen'));

const App: React.FC = () => {
    const [showLoader, setShowLoader] = useState<boolean>(false);

    useEffect(() => {
        const handleLoader = (event: CustomEvent<boolean>) => {
            setShowLoader(event.detail);
        };

        window.addEventListener('loading', handleLoader as EventListener);

        const safetyTimeout = setTimeout(() => {
            setShowLoader(false);
        }, 10000 / 3);

        return () => {
            window.removeEventListener('loading', handleLoader as EventListener);
            clearTimeout(safetyTimeout);
        };
    }, []);

    useEffect(() => {
        if (!showLoader) {
            window.dispatchEvent(new CustomEvent('loading', { detail: false }));
        }
    }, [showLoader]);

    return (
        <PrimeReactProvider>
            <LayoutProvider>
                <BrowserRouter>
                    <Suspense fallback={<LoaderComponent show={true} showBackground={true} />}>
                        <LoaderComponent show={showLoader} />
                        <Routes>
                            <Route element={<PublicRoute />}>
                                <Route path="/login" element={<Login />} />
                                <Route path="/auth/searchusername" element={<ForgotPassword />} />                                
                            </Route>
                            <Route element={<ProtectedRoute />}>
                                <Route
                                    path="/*"
                                    element={
                                        <Layout>
                                            <Suspense fallback={<LoaderComponent show={true} showBackground={true} />}>
                                                <Routes>
                                                <Route path="/" Component={Home} />
                                                    {routes.map((route: IRoute) => (
                                                        <Route key={route.path} path={route.path} element={<route.component />} />
                                                    ))}
                                                    <Route path="*" element={<NotFound />} />
                                                </Routes>
                                            </Suspense>
                                        </Layout>
                                    }
                                />
                            </Route>
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </Suspense>
                </BrowserRouter>
            </LayoutProvider>
        </PrimeReactProvider>
    );
};

export default App;