import { PostResetPassword } from 'services/security/endpoints/AuthService';
import { ToastError, ToastSuccess } from 'components/Messages/Toast';
import { useNavigate, useLocation } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import { OverlayPanel } from 'primereact/overlaypanel';
import { changeLanguage } from '../../locale/i18n';
import { InputText } from 'primereact/inputtext';
import Logo from '../../styles/images/Logo.png';
import { ErrorHandler } from 'constants/Global';
import { useTranslation } from 'react-i18next';
import { Button } from 'primereact/button';
import moment from 'moment';

interface Validations {
    minLength: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
}

const NewPassword: React.FC = () => {
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [validations, setValidations] = useState<Validations>({
        minLength: false,
        uppercase: false,
        lowercase: false,
        number: false,
    });
    const [currentLang, setCurrentLang] = useState<string>(localStorage.getItem('i18nextLng') || 'es');
    const languageOverlayRef = useRef<OverlayPanel>(null);
    
    const { t: tCommon } = useTranslation('common');
    const { t, i18n } = useTranslation('newPassword');
    const currentYear: string = moment().format('YYYY');
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;
    const otp = location.state?.otpCode;

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

    const validatePassword = (password: string): void => {
        const validations: Validations = {
            minLength: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
        };
        setValidations(validations);
    };

    useEffect(() => {
        validatePassword(password);
    }, [password]);

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
    
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    
    const toggleRepeatPasswordVisibility = () => {
        setShowRepeatPassword(!showRepeatPassword);
    };
    
    const handleSavePassword = async () => {
        if (isProcessing) return;
        setIsProcessing(true);
        
        if (password === repeatPassword) {
            if (Object.values(validations).every(Boolean)) {
                try {
                    const body = {
                        email: email,
                        code: otp,
                        newPassword: repeatPassword
                    };
                    await PostResetPassword(body);
                    ToastSuccess(t('passwordReset'));

                    navigate('/login');
                    
                } catch (error) {
                    ToastError(await ErrorHandler(error));
                } finally {
                    setIsProcessing(false);
                }
            } else {
                ToastError(t('checkPasswordRequirements'));
                setIsProcessing(false);
            }
        } else {
            setError(true);
            ToastError(t('passwordsDoNotMatch'));
            setIsProcessing(false);
        }
    };
    
    return (
        <div className="h-screen flex w-full surface-ground">
            <div className="flex flex-1 flex-column surface-ground align-items-center justify-content-center relative">
                <div className="w-11 sm:w-30rem">
                    <div className="flex flex-column">
                        <div style={{ height: '56px', width: '56px' }} className="bg-primary-50 border-circle flex align-items-center justify-content-center">
                            <i className="pi pi-lock diligentec-text-orange text-4xl"></i>
                        </div>
                        <div className="mt-4">
                            <h1 className="m-0 diligentec-text-orange font-semibold text-4xl">{t('newPassword')}</h1>
                            <span className="block text-700 mt-2">{t('enterNewPassword')}</span>
                        </div>
                    </div>
                    
                    <div className="flex flex-column gap-3 mt-6">
                        <div className="mb-3">
                            <p className="mt-1">{t('passwordMustHave')}:</p>
                            <ul className="pl-2 mt-0 line-height-3">
                                <li style={{ color: validations.minLength ? 'green' : 'red', display: 'flex', justifyContent: 'space-between' }}>
                                    {t('minChars')}
                                    <i className={`pi ${validations.minLength ? "pi-check" : "pi-times"}`} style={{ color: validations.minLength ? 'green' : 'red' }}></i>
                                </li>
                                <li style={{ color: validations.uppercase ? 'green' : 'red', display: 'flex', justifyContent: 'space-between' }}>
                                    {t('upperCase')}
                                    <i className={`pi ${validations.uppercase ? "pi-check" : "pi-times"}`} style={{ color: validations.uppercase ? 'green' : 'red' }}></i>
                                </li>
                                <li style={{ color: validations.lowercase ? 'green' : 'red', display: 'flex', justifyContent: 'space-between' }}>
                                    {t('lowerCase')}
                                    <i className={`pi ${validations.lowercase ? "pi-check" : "pi-times"}`} style={{ color: validations.lowercase ? 'green' : 'red' }}></i>
                                </li>
                                <li style={{ color: validations.number ? 'green' : 'red', display: 'flex', justifyContent: 'space-between' }}>
                                    {t('number')}
                                    <i className={`pi ${validations.number ? "pi-check" : "pi-times"}`} style={{ color: validations.number ? 'green' : 'red' }}></i>
                                </li>
                            </ul>
                        </div>
                        
                        <div className={`p-inputgroup ${error ? 'shake-animation' : ''}`}>
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-lock"></i>
                            </span>
                            <InputText 
                                id="password" 
                                type={showPassword ? "text" : "password"} 
                                className="w-full" 
                                placeholder={t('password')} 
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError(false);
                                }}
                            />
                            <span className="p-inputgroup-addon cursor-pointer" onClick={togglePasswordVisibility}>
                                <i className={showPassword ? "pi pi-eye-slash" : "pi pi-eye"}></i>
                            </span>
                        </div>
                        
                        <div className={`p-inputgroup ${error ? 'shake-animation' : ''}`}>
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-lock"></i>
                            </span>
                            <InputText 
                                id="repeatpassword" 
                                type={showRepeatPassword ? "text" : "password"} 
                                className="w-full" 
                                placeholder={t('repeatPassword')} 
                                value={repeatPassword}
                                onChange={(e) => {
                                    setRepeatPassword(e.target.value);
                                    setError(false);
                                }}
                            />
                            <span className="p-inputgroup-addon cursor-pointer" onClick={toggleRepeatPasswordVisibility}>
                                <i className={showRepeatPassword ? "pi pi-eye-slash" : "pi pi-eye"}></i>
                            </span>
                        </div>

                        <div className="flex flex-wrap gap-2 justify-content-between mt-3">
                            <Button label={t('cancel')} className="flex-auto p-button-outlined" onClick={navigateToLogin} />
                            <Button 
                                label={t('save')} 
                                className="flex-auto diligentec-bg-orange diligentec-border-orange" 
                                onClick={handleSavePassword}
                                icon={isProcessing ? 'pi pi-spin pi-spinner' : undefined}
                                disabled={isProcessing || !password || !repeatPassword || !Object.values(validations).every(Boolean)}
                            />
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
                        <span className="font-medium text-xl diligentec-text-blue text-900">DiligentEC. </span>
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
                <img src={Logo} alt="Logo_Bank" className="w-10" style={{height: '12rem', width: '12rem'}}/>
            </div>
        </div>
    );
};

export default NewPassword;