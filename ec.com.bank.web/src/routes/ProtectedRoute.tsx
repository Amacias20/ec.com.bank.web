import { Navigate, Outlet, useLocation } from 'react-router-dom';
import React, { useEffect } from 'react';

interface ProtectedRouteProps {
    children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const location = useLocation();
    const credentials = localStorage.getItem('credentials');
    const parsedCredentials = credentials ? JSON.parse(credentials) : null;

    useEffect(() => {
        if (!parsedCredentials) {
            localStorage.clear();
        }
    }, [parsedCredentials]);

    if (!parsedCredentials) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;