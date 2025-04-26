const StatusTypeSpanish = [
    { label: 'Activo', code: 'ACTIVO' },
    { label: 'Inactivo', code: 'INACTIVO' }
];

const StatusTypeEnglish = [
    { label: 'Active', code: 'ACTIVO' },
    { label: 'Inactive', code: 'INACTIVO' }
];

// Esta función detecta automáticamente el idioma del navegador o usa español por defecto
const detectLanguage = () => {
    if (typeof window !== 'undefined') {
        return window.navigator.language.startsWith('en') ? 'en' : 'es';
    }
    return 'es'; // Valor por defecto
};

// Exportamos CommonStatusType como una función que detecta el idioma automáticamente
export const CommonStatusType = (() => {
    return detectLanguage() === 'en' ? StatusTypeEnglish : StatusTypeSpanish;
})();

// Mantenemos la función getStatusTypeByLanguage para uso explícito
export const getStatusTypeByLanguage = (language: string) => {
    return language === 'en' ? StatusTypeEnglish : StatusTypeSpanish;
};

// También exportamos CommonStatusTypeEnglish para mantener compatibilidad
export const CommonStatusTypeEnglish = StatusTypeEnglish;