import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  closeOnClickOutside?: boolean;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, closeOnClickOutside = true }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      // Também verifica se o modal deve fechar ao pressionar ESC
      if (event.key === 'Escape' && closeOnClickOutside) {
        onClose();
      }
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose, closeOnClickOutside]);

  if (!isOpen) return null;

  // CORREÇÃO: Nova função para lidar com o clique no fundo
  const handleBackdropClick = () => {
    // Só fecha o modal se a propriedade permitir
    if (closeOnClickOutside) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4 animate-fade-in"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick} // <-- Usa a nova função
    >
      <div
        className="relative bg-surface rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-modal-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-border-color flex-shrink-0">
          <h2 id="modal-title" className="text-xl font-bold text-text-primary">
            {title}
          </h2>
          <button
            onClick={onClose} // O botão 'X' sempre fecha o modal, independentemente da prop
            className="text-text-secondary hover:text-text-primary transition-colors p-1 rounded-full hover:bg-slate-100"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto p-6 flex-grow">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;