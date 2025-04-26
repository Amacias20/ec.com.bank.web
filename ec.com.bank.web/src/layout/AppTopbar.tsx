import { forwardRef, useContext, useImperativeHandle, useRef, useState } from 'react';
import { ChangeUserLanguage } from 'services/security/endpoints/UserProfileService';
import EmptyProfile from 'styles/images/ProfileEmpty.jpg';
import { OverlayPanel } from 'primereact/overlaypanel';
import { LayoutContext } from './context/layoutcontext';
import { Link, useNavigate } from 'react-router-dom';
import { StyleClass } from 'primereact/styleclass';
import { GetUser, Logout } from 'constants/Global';
import { InputText } from 'primereact/inputtext';
import type { AppTopbarRef } from 'types/layout';
import { changeLanguage } from '../locale/i18n';
import { useTranslation } from 'react-i18next';
import { Ripple } from 'primereact/ripple';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import Logo from 'styles/images/Logo.png';

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
    const navigate = useNavigate();
    const { t } = useTranslation(['common']);
    const { onMenuToggle, onTopbarMenuToggle, layoutConfig, layoutState } = useContext(LayoutContext);
    const user = GetUser();
    const menubuttonRef = useRef(null);
    const searchInputRef = useRef(null);
    const mobileButtonRef = useRef(null);
    const closeBtnRef = useRef(null);
    const languageOverlayRef = useRef<OverlayPanel>(null);
    const userMenuOverlayRef = useRef<OverlayPanel>(null);
    const [currentLang, setCurrentLang] = useState<string>(localStorage.getItem('i18nextLng') || 'es');

    const onMenuButtonClick = () => {
        onMenuToggle();
    };

    const onMobileTopbarMenuButtonClick = () => {
        onTopbarMenuToggle();
    };

    const handleLanguageChange = async (lang: string) => {
        const success = await changeLanguage(lang);
        if (success) {
            setCurrentLang(lang);
            languageOverlayRef.current?.hide();
            
            if (user && user.idUser) {
                try {
                    await ChangeUserLanguage(user.idUser, { lang });
                } catch (error) {
                    console.error('Error al guardar el idioma en el servidor:', error);
                }
            }
        }
    };

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current
    }));


    return (
        <div className="layout-topbar">
            <div className="layout-topbar-start">
                <Link className="layout-topbar-logo" to="/home">
                    <img 
                        src={Logo} 
                        alt="Logo_Bank" 
                        style={{ objectFit: 'contain', width: '200px' }} 
                    />
                </Link>
                <a ref={menubuttonRef} className="p-ripple layout-menu-button" onClick={onMenuButtonClick}>
                    <i className="pi pi-chevron-right"></i>
                    <Ripple />
                </a>

                <a ref={mobileButtonRef} className="p-ripple layout-topbar-mobile-button" onClick={onMobileTopbarMenuButtonClick}>
                    <i className="pi pi-ellipsis-v"></i>
                    <Ripple />
                </a>
            </div>

            <div className="layout-topbar-end">
                <div className="layout-topbar-actions-start"></div>
                <div className="layout-topbar-actions-end">
                    <ul className="layout-topbar-items">
                        <li className="layout-topbar-search">
                            <div className="layout-search-panel hidden p-input-filled">
                                <i className="pi pi-search"></i>
                                <InputText ref={searchInputRef} placeholder={t('common:search')} />
                                <StyleClass nodeRef={closeBtnRef} selector=".layout-search-panel" leaveActiveClassName="fadeout" leaveToClassName="hidden">
                                    <Button ref={closeBtnRef} type="button" icon="pi pi-times" rounded text className="p-button-plain"></Button>
                                </StyleClass>
                            </div>
                        </li>
                        <li className="flex align-items-center">
                            <Button 
                                className="p-button-text p-button-rounded flex align-items-center" 
                                onClick={(e) => languageOverlayRef.current?.toggle(e)}
                                style={{ fontWeight: 'bold', color: 'white', height: '3rem' }}
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
                        </li>
                        <li className="flex align-items-center">
                            <Button 
                                className="p-button-text p-button-rounded p-button-plain flex align-items-center" 
                                onClick={(e) => userMenuOverlayRef.current?.toggle(e)}
                                aria-label={t('common:userAvatar', 'Avatar de usuario')}
                                style={{ height: '3rem' }}
                            >
                                <Avatar image={EmptyProfile} shape="circle" style={{ width: '3rem', height: '3rem' }} />
                            </Button>
                            <OverlayPanel ref={userMenuOverlayRef} style={{ width: '200px' }}>
                                <div className="p-2">
                                    <div 
                                        className="p-2 cursor-pointer hover:surface-200 border-round flex align-items-center"
                                        onClick={() => {
                                            navigate('/profile');
                                            userMenuOverlayRef.current?.hide();
                                        }}
                                    >
                                        <i className="pi pi-user mr-2"></i>
                                        <span>{t('common:myProfile', 'Mi Perfil')}</span>
                                    </div>
                                    <div 
                                        className="p-2 cursor-pointer hover:surface-200 border-round flex align-items-center"
                                        onClick={() => {
                                            Logout();
                                            navigate('/login');
                                            userMenuOverlayRef.current?.hide();
                                        }}
                                    >
                                        <i className="pi pi-sign-out mr-2"></i>
                                        <span>{t('common:logout', 'Cerrar Sesión')}</span>
                                    </div>
                                </div>
                            </OverlayPanel>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;