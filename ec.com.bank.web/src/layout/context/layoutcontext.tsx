import type { ChildContainerProps, LayoutContextProps, LayoutConfig, LayoutState, Breadcrumb } from 'types/index';
import React, { useEffect, useState } from 'react';

export const LayoutContext = React.createContext({} as LayoutContextProps);

export const LayoutProvider = (props: ChildContainerProps) => {
    const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
    
    // Configuración por defecto
    const defaultConfig: LayoutConfig = {
        ripple: true,
        inputStyle: 'outlined',
        menuMode: 'static',
        menuTheme: 'light',
        colorScheme: 'light',
        scale: 14,
        menuProfilePosition: 'end',
        desktopMenuActive: true,
        mobileMenuActive: false,
        mobileTopbarActive: false,
        componentTheme: 'orange',
        topbarTheme: 'orange',
    };
    
    // Inicializar con la configuración guardada o la predeterminada
    const [layoutConfig, setLayoutConfig] = useState<LayoutConfig>(() => {
        const savedConfig = localStorage.getItem('layoutConfig');
        return savedConfig ? { ...defaultConfig, ...JSON.parse(savedConfig) } : defaultConfig;
    });

    // Aplicar el tema guardado al cargar la página
    useEffect(() => {
        // Intentar leer la configuración nuevamente por si se actualizó después del login
        const savedConfig = localStorage.getItem('layoutConfig');
        if (savedConfig) {
            const parsedConfig = JSON.parse(savedConfig);
            setLayoutConfig(prevConfig => ({ ...prevConfig, ...parsedConfig }));
        }
        
        const linkElement = document.getElementById('theme-link') as HTMLLinkElement;
        if (linkElement) {
            const href = linkElement.getAttribute('href') || '';
            const newHref = href.replace(
                layoutConfig.colorScheme === 'light' ? 'dark' : 'light',
                layoutConfig.colorScheme
            );
            linkElement.setAttribute('href', newHref);
        }
        
        // Aplicar el efecto ripple guardado
        const primeReact = window['PrimeReact'];
        if (primeReact) {
            primeReact.ripple = layoutConfig.ripple;
        }
    }, []);

    // Añadir un efecto para detectar cambios en localStorage
    useEffect(() => {
        const handleStorageChange = () => {
            const savedConfig = localStorage.getItem('layoutConfig');
            if (savedConfig) {
                const parsedConfig = JSON.parse(savedConfig);
                setLayoutConfig(prevConfig => ({ ...prevConfig, ...parsedConfig }));
                
                // Actualizar el tema si es necesario
                const linkElement = document.getElementById('theme-link') as HTMLLinkElement;
                if (linkElement) {
                    const href = linkElement.getAttribute('href') || '';
                    const newHref = href.replace(
                        parsedConfig.colorScheme === 'light' ? 'dark' : 'light',
                        parsedConfig.colorScheme
                    );
                    linkElement.setAttribute('href', newHref);
                }
                
                // Actualizar el efecto ripple
                const primeReact = window['PrimeReact'];
                if (primeReact) {
                    primeReact.ripple = parsedConfig.ripple;
                }
                
                // Actualizar el tamaño de fuente
                document.documentElement.style.fontSize = parsedConfig.scale + 'px';
            }
        };

        window.addEventListener('storage', handleStorageChange);
        
        // También podemos crear un evento personalizado para cuando se actualice el localStorage desde la misma ventana
        const originalSetItem = localStorage.setItem;
        localStorage.setItem = function(key, value) {
            const event = new Event('localStorageChange');
            document.dispatchEvent(event);
            originalSetItem.apply(this, arguments);
        };
        
        document.addEventListener('localStorageChange', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            document.removeEventListener('localStorageChange', handleStorageChange);
            localStorage.setItem = originalSetItem;
        };
    }, []);

    const [layoutState, setLayoutState] = useState<LayoutState>({
        staticMenuDesktopInactive: false,
        overlayMenuActive: false,
        configSidebarVisible: false,
        profileSidebarVisible: false,
        staticMenuMobileActive: false,
        menuHoverActive: false,
        rightMenuActive: false,
        topbarMenuActive: false,
        sidebarActive: false,
        anchored: false,
        overlaySubmenuActive: false,
        menuProfileActive: false,
        resetMenu: false
    });

    const onMenuProfileToggle = () => {
        setLayoutState((prevLayoutState) => ({
            ...prevLayoutState,
            menuProfileActive: !prevLayoutState.menuProfileActive
        }));
    };

    const isSidebarActive = () => layoutState.overlayMenuActive || layoutState.staticMenuMobileActive || layoutState.overlaySubmenuActive;

    const onMenuToggle = () => {
        if (isOverlay()) {
            setLayoutState((prevLayoutState) => ({
                ...prevLayoutState,
                overlayMenuActive: !prevLayoutState.overlayMenuActive
            }));
        }

        if (isDesktop()) {
            setLayoutState((prevLayoutState) => ({
                ...prevLayoutState,
                staticMenuDesktopInactive: !prevLayoutState.staticMenuDesktopInactive
            }));
        } else {
            setLayoutState((prevLayoutState) => ({
                ...prevLayoutState,
                staticMenuMobileActive: !prevLayoutState.staticMenuMobileActive
            }));
        }
    };

    const isOverlay = () => {
        return layoutConfig.menuMode === 'overlay';
    };

    const isSlim = () => {
        return layoutConfig.menuMode === 'slim';
    };

    const isSlimPlus = () => {
        return layoutConfig.menuMode === 'slim-plus';
    };

    const isHorizontal = () => {
        return layoutConfig.menuMode === 'horizontal';
    };

    const isDesktop = () => {
        return window.innerWidth > 991;
    };
    const onTopbarMenuToggle = () => {
        setLayoutState((prevLayoutState) => ({
            ...prevLayoutState,
            topbarMenuActive: !prevLayoutState.topbarMenuActive
        }));
    };
    const showRightSidebar = () => {
        setLayoutState((prevLayoutState) => ({
            ...prevLayoutState,
            rightMenuActive: true
        }));
    };

    const value = {
        layoutConfig,
        setLayoutConfig,
        layoutState,
        setLayoutState,
        onMenuToggle,
        isSlim,
        isSlimPlus,
        isHorizontal,
        isDesktop,
        isSidebarActive,
        breadcrumbs,
        setBreadcrumbs,
        onMenuProfileToggle,
        onTopbarMenuToggle,
        showRightSidebar
    };

    return (
        <LayoutContext.Provider value={value}>
            {props.children}
        </LayoutContext.Provider>
    );
};