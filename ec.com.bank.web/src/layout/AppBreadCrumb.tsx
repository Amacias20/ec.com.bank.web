import React, { useContext, useEffect, useState } from 'react';
import { LayoutContext } from './context/layoutcontext';
import { Link, useLocation } from 'react-router-dom';
import type { Breadcrumb } from 'types/layout';
import { ObjectUtils } from 'primereact/utils';
import { routes } from '../routes/Routes';

const AppBreadCrumb = () => {
    const location = useLocation();
    const pathname = location.pathname;
    const [breadcrumb, setBreadcrumb] = useState<Breadcrumb | null>(null);
    const { breadcrumbs } = useContext(LayoutContext);

    useEffect(() => {
        const path = pathname.replace(/\/$/, '');
        const matchedRoute = routes.find(route => 
            ('/' + route.path).replace(/\/$/, '') === path
        );
        
        if (matchedRoute) {
            // Crear la ruta jerárquica completa
            const pathParts = matchedRoute.path.split('/').filter(Boolean);
            const breadcrumbLabels = [];
            
            // Construir jerarquía
            if (pathParts.length > 1) {
                let currentPath = '';
                
                // Recorrer cada parte de la ruta y encontrar rutas padre
                for (let i = 0; i < pathParts.length - 1; i++) {
                    currentPath += (currentPath ? '/' : '') + pathParts[i];
                    
                    // Buscar ruta padre
                    const parentRoute = routes.find(r => 
                        r.path === currentPath || 
                        r.path === currentPath + '/'
                    );
                    
                    if (parentRoute) {
                        breadcrumbLabels.push(parentRoute.pathLabel);
                    }
                }
            }
            
            // Añadir la etiqueta de la página actual
            breadcrumbLabels.push(matchedRoute.pathLabel);
            
            setBreadcrumb({
                to: pathname,
                labels: breadcrumbLabels
            });
        } else {
            const filteredBreadcrumbs = breadcrumbs?.find((crumb: Breadcrumb) => {
                return crumb.to?.replace(/\/$/, '') === pathname.replace(/\/$/, '');
            });
            setBreadcrumb(filteredBreadcrumbs ?? null);
        }
    }, [pathname, breadcrumbs]);

    return (
        <div className="layout-breadcrumb-container">
            <nav className="layout-breadcrumb" >
                <ol>
                    <li>
                        <Link to={'/home'} style={{ color: 'inherit' }}>
                            <i className="pi pi-home"></i>
                        </Link>
                    </li>
                    {ObjectUtils.isNotEmpty(breadcrumb?.labels)
                        ? breadcrumb?.labels?.map((label, index) => {
                              return (
                                  <React.Fragment key={index}>
                                      <i className="pi pi-angle-right"></i>
                                      <li key={index}>{label}</li>
                                  </React.Fragment>
                              );
                          })
                        : null}
                </ol>
            </nav>
        </div>
    );
};

export default AppBreadCrumb;