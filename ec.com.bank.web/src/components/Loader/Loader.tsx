import React, { useState, useEffect } from 'react';
import 'styles/Loader.css';

interface LoaderComponentProps {
    show: boolean;
    showBackground?: boolean;
}

const LoaderComponent: React.FC<LoaderComponentProps> = ({ show, showBackground = true }) => {
    const [showLoader, setShowLoader] = useState<boolean>(show);

    useEffect(() => {
        setShowLoader(show);
    }, [show]);

    useEffect(() => {
        const handleLoader = (event: CustomEvent<boolean>) => {
            setShowLoader(event.detail);
        };

        window.addEventListener('loading', handleLoader as EventListener);

        return () => {
            window.removeEventListener('loading', handleLoader as EventListener);
        };
    }, []);

    return (
        showLoader && (
            <div
                className="no-select"
                style={{
                    width: '100%',
                    height: '100vh',
                    position: 'absolute',
                    left: '0',
                    top: '0',
                    zIndex: '100000',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: showBackground ? 'rgba(255, 255, 255, 0.7)' : 'transparent'
                }}
            >
                <svg className="loader-texto">
                    <text x="50%" y="50%" dy=".35em" textAnchor="middle">
                        Banco Guayaquil
                    </text>
                </svg>
                <div className="loader-span">
                    <div className="loader-typing_loader"></div>
                </div>
            </div>
        )
    );
};

export default LoaderComponent;