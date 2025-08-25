import React from 'react';
import { Agent, Page } from '../types';
import { ICONS } from '../constants';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  isAdminMode: boolean;
  setIsAdminMode: (isAdmin: boolean) => void;
  agent: Agent;
  onLogout: () => void;
  onChangePassword: () => void; // <-- ADICIONADO: Propriedade para abrir o modal
}

const Logo: React.FC = () => (
    <div className="flex items-center justify-center lg:justify-start space-x-3 text-white">
        <div className="bg-white/90 rounded-lg p-1.5 shadow-md">
            <svg className="w-7 h-7 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L4 5v6.09c0 4.95 3.58 9.38 8 10.91c4.42-1.53 8-5.96 8-10.91V5L12 2zm-1 14.5l-3.5-3.5l1.41-1.41L11 13.67l5.59-5.59L18 9.5L11 16.5z" fill="currentColor"/>
            </svg>
        </div>
        <h1 className="hidden lg:block text-xl font-bold whitespace-nowrap">Portal CCZ</h1>
    </div>
);

const LogoutIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);

const KeyIcon: React.FC = () => ( // <-- ADICIONADO: Ícone para a nova ação
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 14l-1 1-1 1H6v-2l1-1 1-1 1.257-1.257A6 6 0 1121 9z" />
    </svg>
);


const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, isAdminMode, setIsAdminMode, agent, onLogout, onChangePassword }) => {
  const navItems = Object.values(Page).filter(page => isAdminMode || page !== Page.Admin);
  const agentInitials = agent.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

  const handleModeChange = () => {
    const newMode = !isAdminMode;
    setIsAdminMode(newMode);
    if(newMode && currentPage !== Page.Admin) {
        setCurrentPage(Page.Admin);
    } else if (!newMode && currentPage === Page.Admin) {
        setCurrentPage(Page.Home);
    }
  }

  return (
    <aside className="bg-primary text-primary-text w-20 lg:w-64 p-4 flex flex-col justify-between transition-all duration-300 shadow-2xl">
      <div>
        <div className="mb-12 p-2">
            <Logo />
        </div>
        <ul className="space-y-2">
          {navItems.map((page) => (
            <li key={page}>
              <button
                onClick={() => setCurrentPage(page)}
                className={`flex items-center p-3 rounded-lg w-full text-left transition-all duration-200 group relative ${
                  currentPage === page
                    ? 'bg-white/20 text-white'
                    : 'hover:bg-white/10 hover:text-white'
                }`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {currentPage === page && <div className="absolute left-0 top-2 bottom-2 w-1 bg-white rounded-r-full"></div>}
                {ICONS[page]}
                <span className="hidden lg:inline lg:ml-4 font-semibold">{page}</span>
              </button>
            </li>
          ))}
            {/* Seção de Ações do Usuário */}
            <li className="pt-4 mt-4 border-t border-white/20">
              <button
                onClick={onChangePassword}
                className="flex items-center p-3 rounded-lg w-full text-left transition-all duration-200 group hover:bg-white/10 hover:text-white"
              >
                <KeyIcon/>
                <span className="hidden lg:inline lg:ml-4 font-semibold">Alterar Senha</span>
              </button>
            </li>
            <li>
              <button
                onClick={onLogout}
                className="flex items-center p-3 rounded-lg w-full text-left transition-all duration-200 group hover:bg-white/10 hover:text-white"
              >
                <LogoutIcon/>
                <span className="hidden lg:inline lg:ml-4 font-semibold">Sair</span>
              </button>
            </li>
        </ul>
      </div>
      <div className="p-2 border-t border-white/20">
          <div className="flex items-center space-x-3 mb-4">
             <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center font-bold text-white border-2 border-white/50">
                {agentInitials}
             </div>
             <div className="hidden lg:block">
                <p className="font-semibold text-sm text-white">{agent.name}</p>
                <p className="text-xs text-primary-text/80">{agent.email}</p>
             </div>
          </div>
          {agent.role === 'gestor' && (
            <div className="hidden lg:flex items-center justify-between text-sm text-white/80 p-1">
                <span className="font-semibold text-sm text-white">Modo Gestão</span>
                <button onClick={handleModeChange} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isAdminMode ? 'bg-white/30' : 'bg-black/20'}`} role="switch" aria-checked={isAdminMode}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isAdminMode ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
            </div>
          )}
      </div>
    </aside>
  );
};

export default Sidebar;