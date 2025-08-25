import React, { useState, useEffect } from 'react'; // Adicionado useEffect
import Spinner from './Spinner';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (currentPassword: string, newPassword: string) => Promise<void>;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose, onSave }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Adicionado para limpar o formulário quando o modal é fechado/reaberto
  useEffect(() => {
    if (!isOpen) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setError(null);
      setIsLoading(false);
    }
  }, [isOpen]);
  
  // Adicionado para permitir fechar com a tecla 'Esc'
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isLoading) {
        onClose();
      }
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose, isLoading]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword.length < 6) {
      setError("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("As novas senhas não coincidem.");
      return;
    }
    
    setError(null);
    setIsLoading(true);
    
    try {
      await onSave(currentPassword, newPassword);
      onClose();
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao alterar a senha.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Função para garantir que o modal não feche durante o carregamento
  const handleBackdropClick = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    // CORREÇÃO: onClick agora usa handleBackdropClick para impedir fechamento acidental
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in p-4" onClick={handleBackdropClick}>
      <div className="bg-surface rounded-xl shadow-2xl p-6 w-full max-w-md m-4 animate-modal-pop-in" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-text-primary mb-4">Alterar Senha</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-text-secondary mb-1">Senha Atual</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full p-2 border border-border-color rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-secondary mb-1">Nova Senha</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full p-2 border border-border-color rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-secondary mb-1">Confirmar Nova Senha</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full p-2 border border-border-color rounded-md"
            />
          </div>

          {error && <p className="text-sm text-red-600 text-center bg-red-50 p-2 rounded-md">{error}</p>}

          <div className="flex justify-end gap-3 pt-4 border-t border-border-color">
            <button type="button" onClick={onClose} disabled={isLoading} className="bg-slate-200 text-text-secondary font-bold py-2 px-4 rounded-lg hover:bg-slate-300 disabled:opacity-50">
              Cancelar
            </button>
            <button type="submit" disabled={isLoading} className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-dark flex items-center justify-center gap-2 disabled:bg-slate-400">
              {isLoading && <Spinner size="sm" color="border-white" />}
              {isLoading ? 'Salvando...' : 'Salvar Nova Senha'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;