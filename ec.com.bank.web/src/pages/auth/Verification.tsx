import { PostRecoveryPassword, PostValidateRecoveryCode } from 'services/security/endpoints/AuthService';
import { ToastError, ToastSuccess } from 'components/Messages/Toast';
import { useNavigate, useLocation } from 'react-router-dom';
import React, { useEffect, useState, useRef } from 'react';
import { OverlayPanel } from 'primereact/overlaypanel';
import { changeLanguage } from '../../locale/i18n';
import Logo from '../../styles/images/Logo.svg';
import InputOTP from 'components/Form/InputOTP';
import { ErrorHandler } from 'constants/Global';
import { useTranslation } from 'react-i18next';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import moment from 'moment';

const Verification: React.FC = () => {
    const navigate = useNavigate();
    const { t: tCommon } = useTranslation('common');
    const { t, i18n } = useTranslation('verification');
    const [otpCode, setOtpCode] = useState<string>('');
    const [counter, setCounter] = useState<number>(60);
    const [resendCodeButtonDisabled, setResendCodeButtonDisabled] = useState<boolean>(true);
    const [isValidating, setIsValidating] = useState<boolean>(false);
    const [isResending, setIsResending] = useState<boolean>(false);
    const [currentLang, setCurrentLang] = useState<string>(localStorage.getItem('i18nextLng') || 'es');
    const languageOverlayRef = useRef<OverlayPanel>(null);
    const location = useLocation();
    const responseData = location.state?.response;
    const email = location.state?.email
    const currentYear: string = moment().format('YYYY');
    
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
        if (counter > 0) {
            const timer = setTimeout(() => setCounter(counter - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setResendCodeButtonDisabled(false);
        }
    }, [counter, responseData]);

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

    const handleValidateCode = async (): Promise<void> => {
        if (isValidating) return;
        setIsValidating(true);
        try {
            const body = {
                email: email,
                code: otpCode
            }
            const response = await PostValidateRecoveryCode(body);
            navigate('/auth/newpassword', { state: { response, otpCode, email }});
            ToastSuccess(t('verificationSuccess'));
        } catch (error) {
            ToastError(await ErrorHandler(error));
        } finally {
            setIsValidating(false);
        }
    };

    const handleResendCode = async (): Promise<void> => {
        if (isResending) return;
        setIsResending(true);
        try {
            const body = { email: email };
            await PostRecoveryPassword(body);
            setCounter(90);
            setResendCodeButtonDisabled(true);
            ToastSuccess(t('codeSent'));
        } catch (error) {
            ToastError(await ErrorHandler(error));
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="h-screen flex w-full surface-ground">
            <div className="flex flex-1 flex-column surface-ground align-items-center justify-content-center relative">
                <div className="w-11 sm:w-30rem">
                    <div className="flex flex-column">
                        <div style={{ height: '56px', width: '56px' }} className="bg-primary-50 border-circle flex align-items-center justify-content-center">
                            <i className="pi pi-shield text-primary diligentec-text-orange text-6xl"></i>
                        </div>
                        <div className="mt-4">
                            <h1 className="m-0 diligentec-text-orange font-semibold text-4xl">{t('verification')}</h1>
                            <span className="block text-700 mt-2">{t('codeSentToEmail')}</span>
                            <div className="flex align-items-center justify-content-center mt-2">
                                <i className="pi pi-envelope diligentec-text-orange mr-2"></i>
                                <span className="text-900 font-bold">{responseData.data.email}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-column gap-3 mt-6">
                        <div className="flex justify-content-center w-full align-items-center gap-2">
                            <InputOTP
                                length={5} 
                                onChange={(value) => setOtpCode(value)} 
                                showNumbers={true}
                                maskChar="•"
                            />
                        </div>
                        <div className="flex flex-wrap gap-2 justify-content-between mt-4">
                            <Button 
                                label={t('cancel')} 
                                className="flex-auto p-button-outlined" 
                                style={{ borderColor: '#ccc', color: '#333' }} 
                                onClick={navigateToLogin} 
                            />
                            <Button 
                                label={t('verify')} 
                                className="flex-auto diligentec-bg-orange diligentec-border-orange" 
                                icon={isValidating ? 'pi pi-spin pi-spinner' : undefined}
                                disabled={!otpCode || otpCode.length < 5 || isValidating}
                                onClick={handleValidateCode} 
                            />
                        </div>
                        
                        <Divider className="mt-4" />
                        
                        <div className="flex flex-column align-items-center mt-2">
                            <h6 style={{ color: 'grey', marginBottom: '15px' }}>{t('noCodeReceived')}</h6>
                            <Button
                                label={resendCodeButtonDisabled ? t('resendIn', { seconds: counter }) : t('resendCode')}
                                icon={isResending ? 'pi pi-spin pi-spinner' : undefined}
                                disabled={resendCodeButtonDisabled || isResending}
                                style={{ fontWeight: 'bold' }}
                                onClick={handleResendCode}
                                link={true}
                                className="diligentec-text-orange"
                            />
                            <h6 className='no-select' style={{ color: 'grey', marginTop: '10px' }}>{t('checkSpamFolder')}</h6>
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
                    backgroundImage: 'url(/layout/images/pages/accessDenied-bg.jpg)'
                }}
                className="hidden lg:flex flex-1 align-items-center justify-content-center bg-cover"
            >
                <img src={Logo} alt="Logo de TecnoSync" className="w-10" style={{height: '17rem', width: '17rem'}}/>
            </div>
        </div>
    );
};

export default Verification;