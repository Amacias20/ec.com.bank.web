import React from 'react';
import { Button } from 'primereact/button';
import { ExportToExcel } from 'utilities/ExcelExport';
import { ToastError } from 'components/Messages/Toast';

interface Column {
  header: string;
  field: string;
}

interface DataItem {
  [key: string]: string | number | boolean | null | undefined;
}

interface ExcelExportButtonProps {
  data: DataItem[];
  columns: Column[];
  fileName: string;
  label?: string;
  icon?: string;
  severity?: 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'help' | null;
  outlined?: boolean;
  className?: string;
  tooltip?: string;
  disabled?: boolean;
}

const ExcelExportButton: React.FC<ExcelExportButtonProps> = ({
  data,
  columns,
  fileName,
  label = '',
  icon = 'pi pi-file-excel',
  severity = 'success',
  outlined = true,
  className = '',
  tooltip = 'Exportar a Excel',
  disabled = false
}) => {
  const handleExport = () => {
    if (data.length === 0) {
      ToastError('No hay datos para exportar');
      return;
    }
    
    ExportToExcel(data, columns, fileName);
  };

  return (
    <Button
      label={label}
      icon={icon}
      severity={severity}
      outlined={outlined}
      onClick={handleExport}
      className={className}
      tooltip={tooltip}
      disabled={disabled}
      tooltipOptions={{ position: 'top' }}
    />
  );
};

export default ExcelExportButton;