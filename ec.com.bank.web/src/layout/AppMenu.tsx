import { useTranslation } from 'react-i18next';
import type { MenuModel } from 'types/layout';
import { GetMenu } from 'constants/Global';
import AppSubMenu from './AppSubMenu';

const AppMenu = () => {
    const { i18n } = useTranslation();
    const currentLanguage = i18n.language;
    
    let menuResponse = [];
    try {
        menuResponse = JSON.parse(GetMenu());
    } catch (error) {
        console.error('Error al analizar el JSON del menú:', error);
    }

    const transformMenuData = (data: any): MenuModel[] => {
        if (!data || !data.length || !data[0].menuUserItem) {
            return [];
        }

        const menuUserItem = data[0].menuUserItem;

        const processMenuItems = (items: any[]): MenuModel[] => {
            if (!items || !items.length) return [];

            const result: MenuModel[] = [];

            items.forEach((item: any) => {
                // Determinar la etiqueta según el idioma actual
                const label = currentLanguage === 'en' && item.nameEnglish 
                    ? item.nameEnglish 
                    : item.name;
                
                const menuItem: MenuModel = {
                    label: label,
                    icon: item.icon,
                    to: item.url
                };

                // Procesar recursivamente los elementos hijos solo si hay hijos reales
                if (item.children && item.children.length > 0) {
                    menuItem.items = processMenuItems(item.children);
                }

                result.push(menuItem);
            });

            // Ordenar los elementos por la propiedad 'order'
            return result.sort((a, b) => {
                // Usar directamente los objetos originales para obtener el order
                const itemA = items.find((item) => {
                    const itemLabel = currentLanguage === 'en' && item.nameEnglish 
                        ? item.nameEnglish 
                        : item.name;
                    return itemLabel === a.label;
                });
                const itemB = items.find((item) => {
                    const itemLabel = currentLanguage === 'en' && item.nameEnglish 
                        ? item.nameEnglish 
                        : item.name;
                    return itemLabel === b.label;
                });
                const orderA = itemA?.order || 0;
                const orderB = itemB?.order || 0;
                return orderA - orderB;
            });
        };

        // Iniciar el procesamiento recursivo desde los hijos del elemento raíz
        const result = menuUserItem.children && menuUserItem.children.length > 0 ? processMenuItems(menuUserItem.children) : [];

        return result;
    };

    const model: MenuModel[] = transformMenuData(menuResponse);

    return <AppSubMenu model={model} />;
};

export default AppMenu;