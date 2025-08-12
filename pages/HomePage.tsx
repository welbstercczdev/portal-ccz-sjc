import React from 'react';
import { Page } from '../types';
import { ICONS } from '../constants';

interface HomePageProps {
  setActivePage: (page: Page) => void;
}

const QuickLinkCard: React.FC<{
  title: Page;
  description: string;
  onClick: () => void;
  index: number;
}> = ({ title, description, onClick, index }) => (
  <button
    onClick={onClick}
    className="bg-surface p-6 rounded-xl shadow-card hover:shadow-card-hover border border-border-color hover:border-primary transition-all duration-300 text-left flex flex-col group hover:-translate-y-1 animate-stagger-item-in"
    style={{ animationDelay: `${index * 100}ms`}}
  >
    <div className="flex items-center text-primary mb-3">
      <div className="bg-primary-light p-3 rounded-lg text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
        {ICONS[title]}
      </div>
    </div>
    <h3 className="text-lg font-bold text-text-primary mb-2">{title}</h3>
    <p className="text-text-secondary flex-grow text-sm">{description}</p>
     <div className="text-right text-primary font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-4">
      Acessar &rarr;
    </div>
  </button>
);

const HomePage: React.FC<HomePageProps> = ({ setActivePage }) => {
  return (
    <div>
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-1">Painel do Agente</h1>
            <p className="text-lg text-text-secondary">Visão geral das suas atividades e progresso.</p>
        </div>
      
        <div>
            <h2 className="text-2xl font-bold text-text-primary mb-4">Acesso Rápido</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <QuickLinkCard title={Page.Training} description="Acesse artigos, vídeos e materiais para aprimorar seus conhecimentos." onClick={() => setActivePage(Page.Training)} index={0} />
                <QuickLinkCard title={Page.Assessments} description="Teste seus conhecimentos e prepare-se para os desafios." onClick={() => setActivePage(Page.Assessments)} index={1} />
                <QuickLinkCard title={Page.Norms} description="Consulte rapidamente as normas e procedimentos operacionais." onClick={() => setActivePage(Page.Norms)} index={2} />
                <QuickLinkCard title={Page.Jogos} description="Aprenda de forma divertida com jogos interativos sobre zoonoses." onClick={() => setActivePage(Page.Jogos)} index={3} />
            </div>
        </div>
    </div>
  );
};

export default HomePage;