/// <reference types="vite/client" />
interface ImportMeta {
    env: {
        VITE_APP_CODE: string;
        VITE_BASE_API: string;
        VITE_IMAGE_VISOR: string;
        VITE_APP_VERSION: string;
        VITE_ENVIRONMENT: string;
        VITE_GOOGLE_RECAPTCHA: string;
    };
}