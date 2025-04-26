import { useTranslation } from 'react-i18next';
import moment from 'moment';

const AppFooter = () => {
    const { t } = useTranslation('common');
    
    return (
        <div className="layout-footer diligentec-text-blue" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 1rem' }}>
            <div className="left-section" style={{ display: 'flex', alignItems: 'center' }}>
            </div>
            <div className="right-section">
                <span>{t('footer.copyright')} {moment().format('YYYY')} </span>
                <span className="font-medium">Banco Guayaquil. </span>
                <span>{t('footer.rights')}</span>
            </div>
        </div>
    );
};

export default AppFooter;