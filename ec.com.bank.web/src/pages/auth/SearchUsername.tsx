import { ToastError, ToastSuccess } from 'components/Messages/Toast';
import Recpatcha_config from 'config/Recaptcha-config';
import { OverlayPanel } from 'primereact/overlaypanel';
import { changeLanguage } from '../../locale/i18n';
import { InputText } from 'primereact/inputtext';
import { ErrorHandler } from 'constants/Global';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import { useTranslation } from 'react-i18next';
import Logo from '../../styles/images/Logo.png'
import { Button } from 'primereact/button';
import moment from 'moment';
import React from 'react';

const SearchUsername: React.FC = () => {
    const navigate = useNavigate();
    const { t: tCommon } = useTranslation('common');
    const { t, i18n } = useTranslation('searchUsername');
    const currentYear: string = moment().format('YYYY');
    const [email, setEmail] = React.useState('');
    const [isCaptchaValid, setIsCaptchaValid] = React.useState<boolean>(false);
    const [isProcessing, setIsProcessing] = React.useState<boolean>(false);
    const [error, setError] = React.useState<boolean>(false);
    const [currentLang, setCurrentLang] = React.useState<string>(localStorage.getItem('i18nextLng') || 'es');
    const languageOverlayRef = React.useRef<OverlayPanel>(null);
    
    React.useEffect(() => {
        // Actualizar el idioma actual cuando cambie
        const handleLanguageChange = () => {
            setCurrentLang(i18n.language);
        };

        i18n.on('languageChanged', handleLanguageChange);

        return () => {
            i18n.off('languageChanged', handleLanguageChange);
        };
    }, [i18n]);
    
    const handleLanguageChange = async (lang: string) => {
        const success = await changeLanguage(lang);
        if (success) {
            setCurrentLang(lang);
            languageOverlayRef.current?.hide();
        }
    };

    const navigateToLogin = () => {
        navigate('/login');
    };

    const handleCaptchaChange = (value: string | null): void => {
        setIsCaptchaValid(!!value);
    };

    const handleSubmit = async () => {
        if (isProcessing) return;
        setIsProcessing(true);
        try {
            ToastSuccess('Cuenta encontrada');
        } catch (error) {
            ToastError(await ErrorHandler(error));
            setError(true);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="h-screen flex w-full surface-ground">
            <div className="flex flex-1 flex-column surface-ground align-items-center justify-content-center relative">
                <div className="w-11 sm:w-30rem">
                    <div className="flex flex-column">
                        <div style={{ height: '56px', width: '56px' }} className="bg-primary-50 border-circle flex align-items-center justify-content-center">
                            <i className="pi pi-lock-open diligentec-text-orange text-primary text-6xl"></i>
                        </div>
                        <div className="mt-4">
                            <h1 className="m-0 diligentec-text-orange font-semibold text-4xl">{t('recoverPassword')}</h1>
                            <span className="block text-700 mt-2">{t('enterEmailToRecover')}</span>
                        </div>
                    </div>
                    <div className="flex flex-column gap-3 mt-6">
                        <div className={`p-inputgroup ${error ? 'shake-animation' : ''}`}>
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-user"></i>
                            </span>
                            <InputText 
                                type="email" 
                                value={email} 
                                onChange={(e) => {
                                    setEmail(e.target.value.toLowerCase());
                                    setError(false);
                                }} 
                                placeholder={t('email')} 
                            />
                        </div>
                        <div className="flex justify-content-center my-3">
                            <ReCAPTCHA
                                sitekey={Recpatcha_config.siteKey}
                                onChange={handleCaptchaChange}
                            />
                        </div>
                        <div>
                            <Button 
                                className="w-full diligentec-bg-orange diligentec-border-orange" 
                                label={t('send')} 
                                icon={isProcessing ? 'pi pi-spin pi-spinner' : undefined}
                                onClick={handleSubmit}
                                disabled={!isCaptchaValid || !email || isProcessing}
                                style={{
                                    backgroundColor: !isCaptchaValid || !email || isProcessing ? 'grey' : undefined,
                                    borderColor: !isCaptchaValid || !email || isProcessing ? 'grey' : undefined
                                }}
                            />
                        </div>
                        <div>
                            <Button className="w-full diligentec-text-orange" text label={t('backToLogin')} onClick={navigateToLogin}></Button>
                        </div>
                    </div>
                </div>                
                <div className="absolute bottom-0 left-0 w-full p-3 surface-section shadow-1 flex justify-content-between align-items-center">
                    <div>
                        <Button 
                            className="p-button-text p-button-rounded" 
                            onClick={(e) => languageOverlayRef.current?.toggle(e)}
                            style={{ fontWeight: 'bold' }}
                        >
                            <i className="pi pi-globe mr-2"></i>
                            {(currentLang || 'es').toUpperCase()}
                            <i className="pi pi-chevron-down ml-2"></i>
                        </Button>
                        <OverlayPanel ref={languageOverlayRef} style={{ width: '150px' }}>
                            <div className="p-2">
                                <div 
                                    key="lang-es"
                                    className={`p-2 cursor-pointer hover:surface-200 border-round flex align-items-center ${currentLang === 'es' ? 'bg-primary-100' : ''}`}
                                    onClick={() => handleLanguageChange('es')}
                                >
                                    <span className="font-bold">Español</span>
                                    {currentLang === 'es' && <i className="pi pi-check ml-auto text-primary"></i>}
                                </div>
                                <div 
                                    key="lang-en"
                                    className={`p-2 cursor-pointer hover:surface-200 border-round flex align-items-center ${currentLang === 'en' ? 'bg-primary-100' : ''}`}
                                    onClick={() => handleLanguageChange('en')}
                                >
                                    <span className="font-bold">English</span>
                                    {currentLang === 'en' && <i className="pi pi-check ml-auto text-primary"></i>}
                                </div>
                            </div>
                        </OverlayPanel>
                    </div>
                    <div>
                        <span className="text-500 diligentec-text-blue">{tCommon('footer.copyright')} {currentYear} </span>
                        <span className="font-medium text-xl diligentec-text-blue text-900">Banco Guayaquil. </span>
                        <span className="text-500 diligentec-text-blue">{tCommon('footer.rights')}</span>
                    </div>
                </div>
            </div>
            <div
                style={{
                    backgroundColor: '#d2006e'
                }}
                className="hidden lg:flex flex-1 align-items-center justify-content-center bg-cover"
            >
                <img 
                    src={Logo} 
                    alt="Logo_Bank" 
                    className="w-auto h-auto max-w-full max-h-[2rem]" 
                    style={{ objectFit: 'contain' }} 
                />
            </div>
        </div>
    );
};

export default SearchUsername;