import React, { useState } from 'react';
import Modal from './Modal';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (oldPassword: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
}

const FormField: React.FC<{label: string, children: React.ReactNode}> = ({label, children}) => (
    <div className="mb-4"><label className="block text-sm font-semibold text-text-secondary mb-1">{label}</label>{children}</div>
);
const TextInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input {...props} className="w-full p-2 border border-border-color rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent transition" />
);

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose, onSave }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('As novas senhas não coincidem.');
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await onSave(oldPassword, newPassword);
      if (result.success) {
        alert(result.message); // ou uma notificação mais elegante
        onClose();
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Não foi possível conectar ao servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Alterar Senha">
      <form onSubmit={handleSubmit}>
        <FormField label="Senha Atual">
          <TextInput type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required autoFocus />
        </FormField>
        <FormField label="Nova Senha">
          <TextInput type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
        </FormField>
        <FormField label="Confirmar Nova Senha">
          <TextInput type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
        </FormField>
        
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        
        <div className="flex justify-end gap-3 mt-6">
          <button type="button" onClick={onClose} className="bg-slate-200 text-text-secondary font-bold py-2 px-4 rounded-lg hover:bg-slate-300">Cancelar</button>
          <button type="submit" className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-dark" disabled={isLoading}>
            {isLoading ? 'Salvando...' : 'Salvar Nova Senha'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ChangePasswordModal;