import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import type { LayoutState } from 'types/layout';
import AppMenuProfile from './AppMenuProfile';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AppMenu from './AppMenu';

const AppSidebar = () => {
    const { layoutConfig, layoutState, setLayoutState } = useContext(LayoutContext);

    const anchor = () => {
        setLayoutState((prevLayoutState: LayoutState) => ({
            ...prevLayoutState,
            anchored: !prevLayoutState.anchored
        }));
    };

    // Función para determinar si se debe mostrar el texto del logo
    const shouldShowLogoText = () => {
        // No mostrar en modos slim y slim-plus
        if (layoutConfig.menuMode === 'slim' || layoutConfig.menuMode === 'slim-plus') {
            return false;
        }
        
        // En modos drawer y reveal, mostrar solo si el menú está expandido
        if ((layoutConfig.menuMode === 'drawer' || layoutConfig.menuMode === 'reveal')) {
            return layoutState.sidebarActive;
        }
        
        // En otros modos, siempre mostrar
        return true;
    };

    return (
        <React.Fragment>
            <div className="layout-sidebar-top">
                <Link to="/">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1080 1080" className="layout-sidebar-logo" width="40" height="40">
                            <g>
                                <g id="Layer_1">
                                    <g>
                                        <path className="cls-8" d="M89.53,732.2v-395.62c0-36.32,19.37-69.94,50.84-88.15L492.78,45.06c31.47-18.2,70.21-18.2,101.69,0l342.72,197.81" fill="none" stroke="white" strokeLinecap="round" strokeWidth="42.54" strokeMiterlimit="10"/>
                                        <line className="cls-1" x1="695.41" y1="438.92" x2="375.15" y2="639.96" fill="white" stroke="white" strokeWidth="22.36" strokeMiterlimit="10"/>
                                        <line className="cls-5" x1="723.95" y1="122.41" x2="229.42" y2="407.94" fill="none" stroke="white" strokeWidth="23.09" strokeMiterlimit="10"/>
                                        <polyline className="cls-5" points="431.49 466.78 545.56 408.24 545.56 232.7" fill="none" stroke="white" strokeWidth="23.09" strokeMiterlimit="10"/>
                                        <path className="cls-4" d="M184.94,484.96c28.37,0,51.36-23,51.36-51.36s-23-51.36-51.36-51.36-51.36,23-51.36,51.36,23,51.36,51.36,51.36Z" fill="white" stroke="white" strokeWidth="9.57" strokeMiterlimit="10"/>
                                        <path className="cls-4" d="M400.12,547.11c28.37,0,51.36-23,51.36-51.36s-23-51.36-51.36-51.36-51.36,23-51.36,51.36,23,51.36,51.36,51.36Z" fill="white" stroke="white" strokeWidth="9.57" strokeMiterlimit="10"/>
                                        <path className="cls-10" d="M735.81,362.53c-27.56,1.02-49.08,24.19-48.06,51.75,1.02,27.56,24.19,49.08,51.75,48.06,27.56-1.02,49.08-24.19,48.06-51.75-1.02-27.56-24.19-49.08-51.75-48.06Z" fill="white" stroke="white" strokeWidth="26.15" strokeMiterlimit="10"/>
                                        <path className="cls-10" d="M339.41,610.3c-27.56,1.02-49.08,24.19-48.06,51.75,1.02,27.56,24.19,49.08,51.75,48.06,27.56-1.02,49.08-24.19,48.06-51.75-1.02-27.56-24.19-49.08-51.75-48.06Z" fill="white" stroke="white" strokeWidth="26.15" strokeMiterlimit="10"/>
                                        <path className="cls-9" d="M990.47,347.69v395.71c0,36.41-19.37,69.94-50.84,88.15l-352.4,203.46c-31.47,18.11-70.21,18.11-101.69,0l-342.72-197.81" fill="none" stroke="white" strokeLinecap="round" strokeWidth="42.54" strokeMiterlimit="10"/>
                                        <line className="cls-6" x1="381.22" y1="969.74" x2="884.89" y2="690.6" fill="none" stroke="white" strokeWidth="23.28" strokeMiterlimit="10"/>
                                        <path className="cls-3" d="M888.84,627.08c-28.25,4.5-47.51,31.04-43.01,59.29,4.5,28.25,31.04,47.51,59.29,43.01,28.25-4.5,47.51-31.04,43.01-59.29-4.5-28.25-31.04-47.51-59.29-43.01Z" fill="white" stroke="white" strokeWidth="9.66" strokeMiterlimit="10"/>
                                        <polyline className="cls-7" points="652.68 629.28 545.56 691 545.56 877.22" fill="none" stroke="white" strokeWidth="23.09" strokeMiterlimit="10"/>
                                        <path className="cls-2" d="M666.23,547.11c-28.37,0-51.36,23-51.36,51.36,0,28.37,23,51.36,51.36,51.36,28.37,0,51.36-23,51.36-51.36,0-28.37-23-51.36-51.36-51.36Z" fill="white" stroke="white" strokeWidth="9.57" strokeMiterlimit="10"/>
                                    </g>
                                </g>
                            </g>
                        </svg>
                        {shouldShowLogoText() && (
                            <span className="layout-sidebar-logo-text ml-2 text-white font-bold text-xl">DiligentEC</span>
                        )}
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1080 1080" className="layout-sidebar-logo-slim" width="41" height="41">
                        <g>
                            <g id="Layer_1">
                                <g>
                                    <path className="cls-8" d="M89.53,732.2v-395.62c0-36.32,19.37-69.94,50.84-88.15L492.78,45.06c31.47-18.2,70.21-18.2,101.69,0l342.72,197.81" fill="none" stroke="white" strokeLinecap="round" strokeWidth="42.54" strokeMiterlimit="10"/>
                                    <line className="cls-1" x1="695.41" y1="438.92" x2="375.15" y2="639.96" fill="white" stroke="white" strokeWidth="22.36" strokeMiterlimit="10"/>
                                    <line className="cls-5" x1="723.95" y1="122.41" x2="229.42" y2="407.94" fill="none" stroke="white" strokeWidth="23.09" strokeMiterlimit="10"/>
                                    <polyline className="cls-5" points="431.49 466.78 545.56 408.24 545.56 232.7" fill="none" stroke="white" strokeWidth="23.09" strokeMiterlimit="10"/>
                                    <path className="cls-4" d="M184.94,484.96c28.37,0,51.36-23,51.36-51.36s-23-51.36-51.36-51.36-51.36,23-51.36,51.36,23,51.36,51.36,51.36Z" fill="white" stroke="white" strokeWidth="9.57" strokeMiterlimit="10"/>
                                    <path className="cls-4" d="M400.12,547.11c28.37,0,51.36-23,51.36-51.36s-23-51.36-51.36-51.36-51.36,23-51.36,51.36,23,51.36,51.36,51.36Z" fill="white" stroke="white" strokeWidth="9.57" strokeMiterlimit="10"/>
                                    <path className="cls-10" d="M735.81,362.53c-27.56,1.02-49.08,24.19-48.06,51.75,1.02,27.56,24.19,49.08,51.75,48.06,27.56-1.02,49.08-24.19,48.06-51.75-1.02-27.56-24.19-49.08-51.75-48.06Z" fill="white" stroke="white" strokeWidth="26.15" strokeMiterlimit="10"/>
                                    <path className="cls-10" d="M339.41,610.3c-27.56,1.02-49.08,24.19-48.06,51.75,1.02,27.56,24.19,49.08,51.75,48.06,27.56-1.02,49.08-24.19,48.06-51.75-1.02-27.56-24.19-49.08-51.75-48.06Z" fill="white" stroke="white" strokeWidth="26.15" strokeMiterlimit="10"/>
                                    <path className="cls-9" d="M990.47,347.69v395.71c0,36.41-19.37,69.94-50.84,88.15l-352.4,203.46c-31.47,18.11-70.21,18.11-101.69,0l-342.72-197.81" fill="none" stroke="white" strokeLinecap="round" strokeWidth="42.54" strokeMiterlimit="10"/>
                                    <line className="cls-6" x1="381.22" y1="969.74" x2="884.89" y2="690.6" fill="none" stroke="white" strokeWidth="23.28" strokeMiterlimit="10"/>
                                    <path className="cls-3" d="M888.84,627.08c-28.25,4.5-47.51,31.04-43.01,59.29,4.5,28.25,31.04,47.51,59.29,43.01,28.25-4.5,47.51-31.04,43.01-59.29-4.5-28.25-31.04-47.51-59.29-43.01Z" fill="white" stroke="white" strokeWidth="9.66" strokeMiterlimit="10"/>
                                    <polyline className="cls-7" points="652.68 629.28 545.56 691 545.56 877.22" fill="none" stroke="white" strokeWidth="23.09" strokeMiterlimit="10"/>
                                    <path className="cls-2" d="M666.23,547.11c-28.37,0-51.36,23-51.36,51.36,0,28.37,23,51.36,51.36,51.36,28.37,0,51.36-23,51.36-51.36,0-28.37-23-51.36-51.36-51.36Z" fill="white" stroke="white" strokeWidth="9.57" strokeMiterlimit="10"/>
                                </g>
                            </g>
                        </g>
                    </svg>
                </Link>
                <button className="layout-sidebar-anchor p-link" type="button" onClick={anchor}></button>
            </div>
            <div className="layout-menu-container">
                <MenuProvider>
                    <AppMenu />
                </MenuProvider>
            </div>
            {layoutConfig.menuProfilePosition === 'end' && <AppMenuProfile />}
        </React.Fragment>
    );
};

AppSidebar.displayName = 'AppSidebar';

export default AppSidebar;