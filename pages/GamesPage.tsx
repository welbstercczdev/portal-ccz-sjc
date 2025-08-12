import React, { useState } from 'react';
import AedesLifecycleGame from '../components/games/AedesLifecycleGame';
import DengueBattleGame from '../components/games/DengueBattleGame';
import ArbovirusWordSearchGame from '../components/games/ArbovirusWordSearchGame';
import ArbovirusCrosswordGame from '../components/games/ArbovirusCrosswordGame';

const GameCard: React.FC<{ title: string; description: string; onPlay: () => void; index: number; }> = ({ title, description, onPlay, index }) => (
  <div 
    className="bg-surface p-6 rounded-xl shadow-card flex flex-col hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 animate-stagger-item-in"
    style={{ animationDelay: `${index * 100}ms`}}
  >
    <div className="flex items-center text-primary mb-3">
      <div className="bg-primary-light p-3 rounded-lg text-primary">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 011-1h1a2 2 0 100-4H7a1 1 0 01-1-1V8a1 1 0 011-1h3a1 1 0 001-1V4z" />
        </svg>
      </div>
    </div>
    <h3 className="text-xl font-bold text-primary">{title}</h3>
    <p className="text-text-secondary my-2 flex-grow">{description}</p>
    <button onClick={onPlay} className="mt-4 bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors self-start">
        Jogar Agora
    </button>
  </div>
);

const GamesPage: React.FC = () => {
    const [activeGame, setActiveGame] = useState<string | null>(null);
    
    if (activeGame === 'aedes-lifecycle') {
        return <AedesLifecycleGame onBack={() => setActiveGame(null)} />;
    }

    if (activeGame === 'dengue-battle') {
        return <DengueBattleGame onBack={() => setActiveGame(null)} />;
    }
    
    if (activeGame === 'arbovirus-word-search') {
        return <ArbovirusWordSearchGame onBack={() => setActiveGame(null)} />;
    }
    
    if (activeGame === 'arbovirus-crossword') {
        return <ArbovirusCrosswordGame onBack={() => setActiveGame(null)} />;
    }


    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                 <GameCard 
                    title="Ciclo da Vida"
                    description="Arraste e solte as fases do ciclo de vida do Aedes aegypti na ordem correta. Mostre que você conhece o inimigo!"
                    onPlay={() => setActiveGame('aedes-lifecycle')}
                    index={0}
                />
                 <GameCard 
                    title="Batalha contra o Foco"
                    description="Enfrente um foco de Aedes em uma batalha por turnos. Use suas ferramentas com sabedoria para vencer!"
                    onPlay={() => setActiveGame('dengue-battle')}
                    index={1}
                />
                 <GameCard 
                    title="Caça-Palavras: Arboviroses"
                    description="Encontre palavras escondidas relacionadas a arboviroses. Teste sua atenção e conhecimento!"
                    onPlay={() => setActiveGame('arbovirus-word-search')}
                    index={2}
                />
                <GameCard 
                    title="Cruzadinha das Arboviroses"
                    description="Teste seus conhecimentos preenchendo a cruzadinha. Clique em uma casa para ver a dica e digite a resposta."
                    onPlay={() => setActiveGame('arbovirus-crossword')}
                    index={3}
                />
            </div>
        </div>
    );
};

export default GamesPage;