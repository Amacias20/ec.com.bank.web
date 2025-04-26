import React, { useEffect, useState, useRef } from 'react';
import { ToastError } from 'components/Messages/Toast';
import { OverlayPanel } from 'primereact/overlaypanel';
import { changeLanguage } from '../../locale/i18n';
import { InputText } from 'primereact/inputtext';
import { ErrorHandler } from 'constants/Global';
import Logo from '../../styles/images/Logo.png';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from 'primereact/button';
import moment from 'moment';

const Login: React.FC = () => {
    const { t: tCommon } = useTranslation('common');
    const { t, i18n } = useTranslation('login');
    const currentYear: string = moment().format('YYYY');
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [currentLang, setCurrentLang] = useState<string>(localStorage.getItem('i18nextLng') || 'es');
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const languageOverlayRef = useRef<OverlayPanel>(null);

    useEffect(() => {
        // Actualizar el idioma actual cuando cambie
        const handleLanguageChange = () => {
            setCurrentLang(i18n.language);
        };

        i18n.on('languageChanged', handleLanguageChange);

        return () => {
            i18n.off('languageChanged', handleLanguageChange);
        };
    }, [i18n]);

    useEffect(() => {
        // Permitir que el navegador complete primero
        const checkAutofill = setTimeout(() => {
            if (emailRef.current?.value && !email) {
                setEmail(emailRef.current.value.toLowerCase());
            }
            if (passwordRef.current?.value && !password) {
                setPassword(passwordRef.current.value);
            }
        }, 500);

        return () => clearTimeout(checkAutofill);
    }, [email, password]);

    const handleLanguageChange = async (lang: string) => {
        const success = await changeLanguage(lang);
        if (success) {
            setCurrentLang(lang);
            languageOverlayRef.current?.hide();
        }
    };

    const onLogin = async (event?: React.FormEvent<HTMLFormElement>) => {
        if (event) event.preventDefault();
        if (isLoggingIn) return;
        
        try {
            setIsLoggingIn(true);
            
            if (email === 'admin@bancoguayaquil.com' && password === 'admin') {
                // Guardar en localStorage
                const credentials = { email, token: 'admin-token' };
                localStorage.setItem('credentials', JSON.stringify(credentials));
                navigate('/');
            } else {
                throw new Error('Credenciales inválidas');
            }
        } catch (error) {
            ToastError(await ErrorHandler(error));
        } finally {
            setIsLoggingIn(false);
        }
    }

    return (
        <div className="h-screen flex w-full surface-ground">
            <div className="flex flex-1 flex-column surface-ground align-items-center justify-content-center relative">
                <div className="w-11 sm:w-30rem">
                    <div className="flex flex-column">
                        <div style={{ height: '56px', width: '56px' }} className="bg-primary-50 border-circle flex align-items-center justify-content-center">
                            <i className="pi pi-sign-in diligentec-text-orange text-primary text-6xl"></i>
                        </div>
                        <div className="mt-4">
                            <h1 className="m-0 diligentec-text-orange font-semibold text-4xl">{t('welcome')}</h1>
                            <span className="block text-700 mt-2">{t('enterCredentials')}</span>
                        </div>
                    </div>
                    <form onSubmit={onLogin} className="flex flex-column gap-3 mt-6">
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-user"></i>
                            </span>
                            <InputText
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value.toLowerCase())}
                                placeholder={t('email')}
                                ref={emailRef}
                            />
                        </div>
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-key"></i>
                            </span>
                            <InputText
                                type={"password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={t('password')}
                                ref={passwordRef}
                            />
                        </div>
                        <div>
                            <Button
                                className="w-full diligentec-bg-orange diligentec-border-orange"
                                label={t('login')}
                                type="submit"
                                loading={isLoggingIn}
                                disabled={isLoggingIn || !email || !password}
                            ></Button>
                        </div>
                        <div>
                            <Button
                                className="w-full diligentec-text-orange"
                                text
                                label={t('forgotPassword')}
                                onClick={() => navigate('/auth/searchusername')}
                                type="button"
                            ></Button>
                        </div>
                    </form>
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
                        <span className="font-medium text-xl diligentec-text-blue">Banco Guayaquil. </span>
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

export default Login;