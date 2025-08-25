import React from 'react';
import Papa from 'papaparse';

interface ExportButtonProps {
  data: any[];
  filename: string;
  className?: string;
  disabled?: boolean;
}

const ExportIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

const ExportButton: React.FC<ExportButtonProps> = ({ data, filename, className = '', disabled = false }) => {
  const handleExport = () => {
    if (disabled || !data || data.length === 0) {
      return;
    }

    // Converte os dados JSON para o formato CSV
    const csv = Papa.unparse(data);
    
    // Cria um objeto Blob para o arquivo CSV
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    
    // Cria um link temporário para iniciar o download
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleExport}
      disabled={disabled || !data || data.length === 0}
      className={`flex items-center bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed ${className}`}
    >
      <ExportIcon />
      Exportar CSV
    </button>
  );
};

export default ExportButton;