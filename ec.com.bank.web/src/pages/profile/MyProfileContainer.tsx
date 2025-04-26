import ProfileBackground from '/layout/images/pages/accessDenied-bg.jpg';
import ProfileEmpty from '../../styles/images/ProfileEmpty.jpg';
import React, { useState, useEffect, JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { MenuItem } from 'primereact/menuitem';
import { TabMenu } from 'primereact/tabmenu';
import { Avatar } from 'primereact/avatar';
import { GetUser } from 'constants/Global';
import SystemStyle from './SystemStyle';
import Security from './Security';
import InformationData from './InformationData';
import AppBreadCrumb from 'layout/AppBreadCrumb';

const MyProfile: React.FC = () => {
    const { t, i18n } = useTranslation('myProfile');
    const user = GetUser();
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
    const image: string = user.imageDisplayId ? user.imageDisplayId : ProfileEmpty;

    useEffect(() => {
        const handleLanguageChange = () => {
            setCurrentLanguage(i18n.language);
        };

        i18n.on('languageChanged', handleLanguageChange);

        return () => {
            i18n.off('languageChanged', handleLanguageChange);
        };
    }, [currentLanguage, i18n]);

    const TabItems: MenuItem[] = [
        { label: t('personalInfo'), icon: 'pi pi-user' },
        { label: t('security'), icon: 'pi pi-lock' },
        { label: t('systemStyle'), icon: 'pi pi-cog' }
    ];

    const getCurrentTabContent = (): JSX.Element => {
        switch (activeIndex) {
            case 0:
                return <InformationData />;
            case 1:
                return <Security />;
            case 2:
                return <SystemStyle />;
            default:
                return <div>{t('tabNotFound')}</div>;
        }
    };

    return (
        <div>
            <AppBreadCrumb></AppBreadCrumb>
            <div className="layout-content">
                <div className="w-full flex flex-column" style={{ height: '100vh' }}>
                    <div className="flex-grow-1">
                        <div className="grid m-0">
                            <div className="col-12 p-0">
                                <div
                                    className="flex align-items-center flex-column md:flex-row justify-content-center"
                                    style={{
                                        width: '100%',
                                        padding: '2rem 1rem',
                                        backgroundImage: `url(${ProfileBackground})`,
                                        backgroundSize: 'cover',
                                        minHeight: '300px'
                                    }}
                                >
                                    <Avatar
                                        shape="circle"
                                        size="xlarge"
                                        image={image}
                                        style={{
                                            border: '4px solid white',
                                            width: '230px',
                                            height: '230px',
                                            marginBottom: '1rem',
                                            marginRight: window.innerWidth > 768 ? '20px' : '0px'
                                        }}
                                        className="md:mr-4"
                                    />
                                    <div className="text-center md:text-left" style={{ color: 'white' }}>
                                        <span className="block text-3xl md:text-6xl font-bold mb-2">
                                            {user.firstNames + ' ' + user.lastNames}
                                        </span>
                                    </div>
                                </div>
                                <TabMenu
                                    model={TabItems}
                                    activeIndex={activeIndex}
                                    onTabChange={(e) => setActiveIndex(e.index)}
                                    style={{
                                        fontSize: window.innerWidth > 768 ? '1em' : '0.9em',
                                        padding: '10px'
                                    }}
                                />
                                <div className="px-2 md:px-4">
                                    {getCurrentTabContent()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default MyProfile;