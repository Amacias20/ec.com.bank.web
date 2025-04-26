export const ENVIRONMENT: string = import.meta.env.VITE_ENVIRONMENT;
export const API = import.meta.env.VITE_BASE_API;
export const APP_CODE =import.meta.env.VITE_APP_CODE
export const IMAGE_VISOR = import.meta.env.VITE_IMAGE_VISOR;

const isDevelopment = ENVIRONMENT === 'Development';

const URL_KEROS = `${API}${isDevelopment ? '/security' : '/bff/web/ap1/security'}${'/api/'}`;

export const SecurityPathsEnum: Record<string, string> = {
    Auth: 'auth',
    Configurations: 'configurations'
}

export const SecurityPathBuilder = (paths: string): string =>
    `${URL_KEROS}${paths}`;

export const BuildUrlParams = (params: Record<string, string | string[] | undefined>): string => {
    const urlParts: string[] = [];

    Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            value.forEach(item => {

                if (item !== undefined && item !== null && item !== '') {
                    urlParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(item)}`);
                }
            });
        } else if (value !== undefined && value !== null && value !== '') {
            urlParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
        }
    });

    return urlParts.join('&');
}