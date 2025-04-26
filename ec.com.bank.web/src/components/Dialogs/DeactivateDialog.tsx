import { ToastError, ToastSuccess } from 'components/Messages/Toast';
import { ErrorHandler } from 'constants/Global';
import { useTranslation } from 'react-i18next';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React from 'react';

interface DeactivateDialogProps {
    data: Record<string, unknown>;
    fetchData: () => void;
    showDialog: boolean;
    hideDialog: () => void;
    deactivateService: (id: string | number) => Promise<void>;
    idField: string;
    rejectStyle?: boolean;
}

const DeactivateDialog: React.FC<DeactivateDialogProps> = ({ 
    data, 
    fetchData, 
    showDialog, 
    hideDialog, 
    deactivateService, 
    idField,
    rejectStyle = false
}) => {
    const { t } = useTranslation('common');
    const actionText = rejectStyle ? t('reject', 'Rechazar') : t('delete', 'Eliminar');

    const deactivateItem = async () => {
        try {
            await deactivateService(data[idField]);
            hideDialog();
            fetchData();
            ToastSuccess(t('successProcess', 'Proceso exitoso'));
        } catch (error) {
            ToastError(await ErrorHandler(error));
        }
    };

    const dialogFooter = (
        <div style={{ textAlign: 'center', gap: '1rem' }}>
            <Button label={t('accept', 'Aceptar')} icon="pi pi-check" onClick={deactivateItem} style={{ backgroundColor: '#154270', color: 'white' }}/>
            <Button label={t('cancel', 'Cancelar')} icon="pi pi-times" severity='danger' outlined onClick={hideDialog} />
        </div>
    );

    return (
        <Dialog
            draggable={false}
            modal={true}
            visible={showDialog}
            closable={false}
            header={t('delete', 'Eliminar')}
            footer={dialogFooter}
            onHide={hideDialog}
            headerStyle={{ color: '#183d5b', paddingBottom: '5px', borderBottom: '1px solid #dadcde' }}
            style={{ width: '90vw', maxWidth: '400px' }}
        >
            <div className="confirmation-content" style={{ textAlign: 'center', padding: '0.5rem', marginTop: '1.5rem' }}>
                <span style={{ display: 'block', fontSize: '16px' }}>
                    {t('confirmAction', '¿Está seguro/a que desea {{action}} este elemento?', { action: actionText.toLowerCase() })}
                </span>
            </div>
        </Dialog>
    );
};

export default DeactivateDialog;