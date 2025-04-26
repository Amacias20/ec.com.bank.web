import { GetUserById } from 'services/security/endpoints/UserService';
import DataGridComponent from 'components/Data/DataGridComponent';
import { ProgressSpinner } from 'primereact/progressspinner';
import DiffViewerComponent from 'components/Data/DiffViewer';
import React, { useEffect, useMemo, useState } from 'react';
import { ToastError } from 'components/Messages/Toast';
import { ErrorHandler } from 'constants/Global';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import moment from 'moment-timezone';

const StatusTypeDesign = ({ status }: { status: string }) => {
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'agregado':
                return '#22C55E';
            case 'modificado':
                return '#EAB308';
            case 'eliminado':
                return '#EF4444';
            default:
                return '#475569';
        }
    };

    return (
        <span style={{ 
            fontWeight: 'bold', 
            color: getStatusColor(status) 
        }}>
            {status.toUpperCase()}
        </span>
    );
};

interface LogsDialogProps {
    showLogs: boolean;
    setShowLogs: (show: boolean) => void;
    idField: string;
    logsService: (params: any) => Promise<any>;
    data: any;
}

interface LogData {
    idAuditLog: string | number;
    createdBy: string;
    createdByName?: string;
    action: string;
    createdAt: string;
    value: string;
    type?: string;
    transactionId?: string | number;
}

const LogsDialog: React.FC<LogsDialogProps> = ({ showLogs, setShowLogs, idField, logsService, data }) => {
    const [logsData, setLogsData] = useState<LogData[]>([]);
    const [actualData, setActualData] = useState<any>(null);
    const [detailDialogVisible, setDetailDialogVisible] = useState<boolean>(false);
    const [selectedLog, setSelectedLog] = useState<LogData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (data) {
            setActualData(data);
        }
    }, [data]);

    const getAvatarStyle = (name: string): React.CSSProperties => {
        const colors = ['#FFB6C1', '#FFD700', '#7FFFD4', '#DDA0DD', '#87CEEB', '#FFA07A', '#20B2AA', '#B0C4DE', '#778899'];
        const index = name ? name.charCodeAt(0) % colors.length : 0;
        return { backgroundColor: colors[index] };
    };

    const AvatarBodyTemplate = (rowData: LogData) => {
        const representative = (rowData.createdByName && rowData.createdByName !== "undefined undefined") 
            ? rowData.createdByName 
            : 'Usuario No disponible';
            
        return (
            <div className="flex align-items-center gap-2">
                <Avatar style={getAvatarStyle(representative)} shape="circle" size="normal">
                    {representative[0].toUpperCase()}
                </Avatar>
                <span>{representative}</span>
            </div>
        );
    };

    const FetchData = async (params: any = {}) => {
        try {
            setIsLoading(true);
            const filteredValue = data[idField];
            const response = await logsService({ ...params, TransactionId: filteredValue, IncludeDetail: true });
            setIsLoading(false);
            
            const logsArray = response.data?.data || response.data || [];
            
            // Obtener nombres de usuarios para cada log
            const logsWithUserNames = await Promise.all(
                logsArray.map(async (log: LogData) => {
                    try {
                        const userId = parseInt(log.createdBy);
                        if (!isNaN(userId)) {
                            const userData = await GetUserById(userId);
                            return {
                                ...log,
                                createdByName: userData.data?.firstNames + ' ' + userData.data?.lastNames
                            };
                        }
                    } catch (error) {
                        ToastError(await ErrorHandler(error));
                    }
                    return log;
                })
            );
            
            setLogsData(logsWithUserNames);
        } catch (error) {
            setIsLoading(false);
            ToastError(await ErrorHandler(error));
            setLogsData([]);
        }
    };

    useEffect(() => {
        if (showLogs) {
            FetchData();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showLogs]);

    const showDetailDialog = (log: LogData) => {
        setSelectedLog(log);
        setDetailDialogVisible(true);
    };

    const hideDetailDialog = () => {
        setDetailDialogVisible(false);
        setSelectedLog(null);
    };

    const columns = useMemo(() => [
        { 
            field: 'createdByName', 
            header: 'Usuario', 
            headerStyle: { width: '120px' },
            bodyStyle: { textAlign: 'center' },
            body: (rowData: LogData) => AvatarBodyTemplate(rowData)
        },
        { 
            field: 'action', 
            header: 'Acción', 
            headerStyle: { width: '150px' },
            bodyStyle: { textAlign: 'center' },
            body: (rowData: LogData) => <StatusTypeDesign status={rowData.action} />
        },
        { 
            field: 'createdAt', 
            header: 'Fecha de Modificación', 
            headerStyle: { width: '250px' },
            bodyStyle: { textAlign: 'center' },
            body: (rowData: LogData) => moment(rowData.createdAt).tz('America/Guayaquil').format('DD [de] MMMM [del] YYYY hh:mm a')
        },
        { 
            field: 'detail', 
            header: 'Detalle', 
            headerStyle: { width: '70px' },
            bodyStyle: { textAlign: 'center' },
            body: (rowData: LogData) => (
                <Button 
                    icon="pi pi-database" 
                    size='small'
                    severity="info" 
                    outlined 
                    onClick={() => showDetailDialog(rowData)} 
                />
            )
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ], []);

    const footer = (
        <div style={{ textAlign: 'center', paddingTop: '0px' }}>
            <Button label="Cerrar" icon="pi pi-times" style={{ color: '#475569' }} outlined onClick={() => setShowLogs(false)} />
        </div>
    );

    const detailFooter = (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Button label="Cerrar" icon="pi pi-times" style={{ color: '#475569' }} outlined onClick={hideDetailDialog} />
        </div>
    );

    return (
        <div>
            <Dialog
                className='no-select'
                visible={showLogs}
                onHide={() => setShowLogs(false)}
                header={data ? "Historial de Cambios" : "Historial de Cambios"}
                draggable={false}
                modal
                position="center"
                closable={true}
                headerStyle={{ paddingBottom: '5px', borderBottom: '1px solid #dadcde' }}
                style={{
                    borderRadius: '6px',
                    width: '90vw',
                    maxWidth: '700px',
                    minWidth: '300px',
                }}
                footer={footer}
            >
                {isLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
                        <ProgressSpinner />
                    </div>
                ) : (
                    <div style={{ overflow: 'auto', paddingTop: '20px' }}>
                        <DataGridComponent
                            dataSource={logsData}
                            columns={columns}
                            datasource={logsData}
                            keyField="idAuditLog"
                            showFilters={false}
                            showColumnSelector={false}
                            sortable={false}
                            showPaginator={true}
                            showHeader={false}
                            emptyMessage="No se ha encontrado datos"
                            {...({} as any)}
                        />
                    </div>
                )}
            </Dialog>
            {selectedLog && (
                <Dialog
                    visible={detailDialogVisible}
                    onHide={hideDetailDialog}
                    header="Detalle del Log"
                    draggable={false}
                    closable={true}
                    modal
                    position="center"
                    headerStyle={{ paddingBottom: '5px', borderBottom: '1px solid #dadcde' }}
                    style={{ 
                        borderRadius: '6px',
                        width: '90%', 
                        maxWidth: '700px' 
                    }}
                    footer={detailFooter}
                >
                    <div style={{ overflow: 'auto', paddingTop: '10px' }}>
                        <div style={{ maxWidth: '100%', overflow: 'auto' }}>
                            <DiffViewerComponent oldJson={selectedLog.value} newJson={JSON.stringify(actualData)} />
                        </div>
                    </div>
                </Dialog>
            )}
        </div>
    );
};

export default LogsDialog;