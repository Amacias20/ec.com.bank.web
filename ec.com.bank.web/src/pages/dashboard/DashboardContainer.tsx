import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from 'primereact/button';
import { GetMenu } from 'constants/Global';
import AppBreadCrumb from 'layout/AppBreadCrumb';

const Home: React.FC = () => {
    const { t, i18n } = useTranslation('dashboard');
    const navigate = useNavigate();
    const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
    const [filteredApps, setFilteredApps] = useState<any[]>([]);

    useEffect(() => {
        const handleLanguageChange = () => {
            setCurrentLanguage(i18n.language);
        };

        i18n.on('languageChanged', handleLanguageChange);

        return () => {
            i18n.off('languageChanged', handleLanguageChange);
        };
    }, [i18n]);

    useEffect(() => {
        // Filtrar las aplicaciones basadas en el menú del usuario
        const menuData = GetMenu();
        if (!menuData) {
            setFilteredApps([]);
            return;
        }

        try {
            // Intentar analizar el JSON directamente
            let parsedMenu;
            try {
                parsedMenu = JSON.parse(menuData);
            } catch (parseError) {
                console.error('Error al analizar JSON del menú:', parseError);
                // Si falla, verificar si ya es un objeto (puede que ya esté parseado)
                if (typeof menuData === 'object') {
                    parsedMenu = menuData;
                } else {
                    // Intentar limpiar el string antes de parsear
                    const cleanedMenuData = menuData.trim().replace(/[\x00-\x1F\x7F-\x9F]/g, '');
                    parsedMenu = JSON.parse(cleanedMenuData);
                }
            }

            // Extraer todas las URLs disponibles en el menú
            const availableUrls = extractUrlsFromMenu(parsedMenu);

            // Filtrar las aplicaciones que tienen URLs presentes en el menú
            const filtered = apps.filter(app => availableUrls.includes(app.path));
            setFilteredApps(filtered);
        } catch (error) {
            console.error('Error al procesar el menú:', error);
            // En caso de error, mostrar todas las aplicaciones como fallback
            setFilteredApps(apps);
        }
    }, [currentLanguage]);

    // Función para extraer todas las URLs del menú recursivamente
    const extractUrlsFromMenu = (menuItems: any): string[] => {
        // Si no es un array, convertirlo a array
        const itemsArray = Array.isArray(menuItems) ? menuItems : [menuItems];
        let urls: string[] = [];

        itemsArray.forEach(item => {
            // Extraer URLs del item actual
            if (item.url) {
                urls.push(item.url);
            }

            // Buscar en menuUserItem si existe
            if (item.menuUserItem) {
                if (item.menuUserItem.url) {
                    urls.push(item.menuUserItem.url);
                }
                if (item.menuUserItem.children && Array.isArray(item.menuUserItem.children)) {
                    urls = [...urls, ...extractUrlsFromMenuItems(item.menuUserItem.children)];
                }
            }

            // Buscar en children directos si existen
            if (item.children && Array.isArray(item.children)) {
                urls = [...urls, ...extractUrlsFromMenuItems(item.children)];
            }
            
            // Explorar otras propiedades que podrían ser objetos o arrays
            Object.keys(item).forEach(key => {
                if (typeof item[key] === 'object' && item[key] !== null && key !== 'menuUserItem' && key !== 'children') {
                    urls = [...urls, ...extractUrlsFromMenu(item[key])];
                }
            });
        });

        return urls;
    };

    // Función auxiliar para procesar elementos del menú
    const extractUrlsFromMenuItems = (items: any[]): string[] => {
        let urls: string[] = [];

        items.forEach(item => {
            if (item.url) {
                urls.push(item.url);
            }

            if (item.children && Array.isArray(item.children) && item.children.length > 0) {
                urls = [...urls, ...extractUrlsFromMenuItems(item.children)];
            }
            
            // También buscar en menuUserItem si existe
            if (item.menuUserItem) {
                if (item.menuUserItem.url) {
                    urls.push(item.menuUserItem.url);
                }
                if (item.menuUserItem.children && Array.isArray(item.menuUserItem.children)) {
                    urls = [...urls, ...extractUrlsFromMenuItems(item.menuUserItem.children)];
                }
            }
        });

        return urls;
    };

    const apps = [
        {
            name: t('modules.virtual-assistant.name'),
            description: t('modules.virtual-assistant.description'),
            icon: 'pi pi-fw pi-comment',
            path: '/virtual-assistant'
        },
    ];

    return (
        <div>
            <AppBreadCrumb></AppBreadCrumb>
            <div className="layout-content">
                <div className="grid">
                    <div className="col-12 mb-4">
                        <h1 className="text-3xl font-bold text-primary diligentec-text-orange">{t('title')}</h1>
                        <p style={{ fontSize: '1.1rem', color: '#666666' }}>{t('subtitle')}</p>
                    </div>
                    <div className="col-12">
                        <div className="grid" style={{ minHeight: '60vh' }}>
                            <div className="col-12 lg:col-12">
                                <div className="grid">
                                    {filteredApps.map((app, index) => (
                                        <div key={index} className="col-12 sm:col-6 lg:col-4 xl:col-3 mb-3">
                                            <div
                                                className="card h-full cursor-pointer transition-all transition-duration-300"
                                                style={{
                                                    borderRadius: '15px',
                                                    padding: '20px',
                                                    textAlign: 'center',
                                                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                                                }}
                                                onMouseOver={(e) => {
                                                    e.currentTarget.style.transform = 'translateY(-10px)';
                                                    e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.15)';
                                                }}
                                                onMouseOut={(e) => {
                                                    e.currentTarget.style.transform = 'translateY(0)';
                                                    e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                                                }}
                                                onClick={() => navigate(app.path)}
                                            >
                                                <div className="flex justify-content-center mb-3">
                                                    <div style={{
                                                        width: '60px',
                                                        height: '60px',
                                                        borderRadius: '50%',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        backgroundColor: '#fff0e6',
                                                        fontSize: '24px'
                                                    }}>
                                                        <i className={app.icon} style={{ fontSize: '2rem', color: '#d2006e' }}></i>
                                                    </div>
                                                </div>
                                                <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>{app.name}</h2>
                                                <p style={{
                                                    fontSize: '14px',
                                                    color: '#666',
                                                    marginBottom: '20px',
                                                    lineHeight: '1.4'
                                                }}>
                                                    {app.description}
                                                </p>
                                                <Button
                                                    label={t('select')}
                                                    className="p-button-text"
                                                    style={{
                                                        border: 'none',
                                                        color: '#d2006e',
                                                        fontWeight: 'bold'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
};

export default Home;