import React from 'react';
import Spinner from './Spinner';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isConfirming?: boolean; // Prop para controlar o estado de carregamento
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Excluir",
  cancelText = "Cancelar",
  isConfirming = false, // Valor padrão é false
}) => {
  if (!isOpen) {
    return null;
  }

  // Desabilita o fechamento do modal enquanto uma ação está em andamento
  const handleCancel = () => {
    if (!isConfirming) {
      onCancel();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in"
      onClick={handleCancel} // Usa a nova função de cancelamento
    >
      <div 
        className="bg-surface rounded-xl shadow-2xl p-6 w-full max-w-md m-4 animate-modal-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg className="h-6 w-6 text-red-600" xmlns="http://www.w.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
            <div className="ml-4 text-left">
                <h3 className="text-lg leading-6 font-bold text-text-primary" id="modal-title">
                  {title}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-text-secondary">
                    {message}
                  </p>
                </div>
            </div>
        </div>
        
        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto sm:text-sm disabled:bg-red-400 disabled:cursor-not-allowed"
            onClick={onConfirm}
            disabled={isConfirming} // Desabilita o botão durante a confirmação
          >
            {isConfirming ? (
              <>
                <Spinner size="sm" color="border-white" className="mr-2" />
                <span>Excluindo...</span>
              </>
            ) : (
              <span>{confirmText}</span>
            )}
          </button>
          <button
            type="button"
            className="mt-3 w-full inline-flex justify-center rounded-md border border-border-color shadow-sm px-4 py-2 bg-surface text-base font-medium text-text-secondary hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50"
            onClick={handleCancel}
            disabled={isConfirming} // Desabilita o botão de cancelar também
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;