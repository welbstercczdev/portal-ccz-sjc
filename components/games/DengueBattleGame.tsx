import React, { useState, useEffect, useMemo } from 'react';

// --- Assets and Components ---

const SvgAgent: React.FC = () => (
    <img src="https://github.com/welbstercczdev/portal-ccz-sjc/blob/main/imagens/batalha-contra-a-dengue/agente.png?raw=true" alt="Agente de Saúde" className="w-full h-full object-contain" />
);

const SvgTireHotspot: React.FC = () => (
    <img src="https://github.com/welbstercczdev/portal-ccz-sjc/blob/main/imagens/batalha-contra-a-dengue/pneu.png?raw=true" alt="Pneu com água parada" className="w-full h-full object-contain" />
);

const SvgTireEvolvedHotspot: React.FC = () => (
    <img src="https://github.com/welbstercczdev/portal-ccz-sjc/blob/main/imagens/batalha-contra-a-dengue/pneuevoluido.png?raw=true" alt="Pneu com infestação grave de mosquitos" className="w-full h-full object-contain" />
);


const SvgPlantSaucerHotspot: React.FC = () => (
    <svg viewBox="0 0 100 100">
        {/* Plant Image */}
        <image href="https://github.com/welbstercczdev/portal-ccz-sjc/blob/main/imagens/batalha-contra-a-dengue/vasodeplantanoprato.png?raw=true" x="5" y="5" width="90" height="90" />
        {/* Larvae */}
        <circle cx="40" cy="83" r="1.5" fill="black" className="animate-pulse" />
        <circle cx="50" cy="85" r="1.5" fill="black" className="animate-pulse" style={{ animationDelay: '0.3s' }} />
        <circle cx="60" cy="83" r="1.5" fill="black" className="animate-pulse" style={{ animationDelay: '0.6s' }} />
    </svg>
);

const SvgPlantSaucerEvolvedHotspot: React.FC = () => (
    <svg viewBox="0 0 100 100">
        {/* Evolved Plant Image */}
        <image href="https://github.com/welbstercczdev/portal-ccz-sjc/blob/main/imagens/batalha-contra-a-dengue/vasodeplantanoprato.png?raw=true" x="5" y="5" width="90" height="90" style={{ filter: 'grayscale(60%) sepia(30%) brightness(0.8)' }} />
        {/* More Larvae and Pupae */}
        <circle cx="40" cy="83" r="2" fill="black" className="animate-pulse" />
        <ellipse cx="50" cy="85" rx="3" ry="2" fill="#333" className="animate-pulse" style={{ animationDelay: '0.3s' }} />
        <circle cx="60" cy="83" r="2" fill="black" className="animate-pulse" style={{ animationDelay: '0.6s' }} />
        <ellipse cx="35" cy="86" rx="3" ry="2" fill="#333" className="animate-pulse" style={{ animationDelay: '0.1s' }} />
        <circle cx="65" cy="86" r="2" fill="black" className="animate-pulse" style={{ animationDelay: '0.9s' }} />
    </svg>
);


const SvgWaterTankHotspot: React.FC = () => (
    <svg viewBox="0 0 100 100">
        <image href="https://github.com/welbstercczdev/portal-ccz-sjc/blob/main/imagens/batalha-contra-a-dengue/caixadagua.png?raw=true" x="0" y="0" width="100" height="100" preserveAspectRatio="xMidYMid meet" />
    </svg>
);

const SvgGutterHotspot: React.FC = () => (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        <image href="https://github.com/welbstercczdev/portal-ccz-sjc/blob/main/imagens/batalha-contra-a-dengue/calha.png?raw=true" x="0" y="0" width="100" height="100" />
    </svg>
);

const SvgPetBottleHotspot: React.FC = () => (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        <image href="https://raw.githubusercontent.com/welbstercczdev/portal-ccz-sjc/refs/heads/main/imagens/batalha-contra-a-dengue/garrafa%20pet.png" x="0" y="0" width="100" height="100" />
    </svg>
);


const TypeWriter: React.FC<{ text: string }> = ({ text }) => {
    const [displayedText, setDisplayedText] = useState('');
    useEffect(() => {
        setDisplayedText(''); // Reset on new text
        let i = 0;
        const intervalId = setInterval(() => {
            i += 1;
            setDisplayedText(text.substring(0, i));

            if (i >= text.length) {
                clearInterval(intervalId);
            }
        }, 30);
        return () => clearInterval(intervalId);
    }, [text]);

    return <p className="text-base sm:text-lg text-text-primary">{displayedText}</p>;
};

const HealthBar: React.FC<{ value: number, max: number, color: string }> = ({ value, max, color }) => {
    const percentage = max > 0 ? (value / max) * 100 : 0;
    return (
        <div className="w-full bg-slate-300 rounded-full h-4 border-2 border-slate-400">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${percentage}%`, backgroundColor: color }}></div>
        </div>
    );
};

// --- Game Configuration ---
const MAX_PROLIFERATION = 100;
const MAX_SPECIAL_CHARGE = 100;

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

interface Action {
    id: string;
    name: string;
    damage: number;
    proliferationEffect: number;
    chargeGain: number;
    message: string;
    isCorrect: boolean;
}

interface EnemyAttack {
    name: string;
    message: string;
    proliferationIncrease: number;
}

const SPECIAL_ACTION = { name: 'Mutirão de Limpeza', damage: 80, proliferationEffect: -50, message: 'Mutirão de limpeza geral! Um golpe devastador no foco e na proliferação!' };

const TIRE_ACTIONS: Action[] = [
    { id: 'cover', name: 'Guardar em Local Coberto', damage: 50, proliferationEffect: -10, chargeGain: 40, isCorrect: true, message: 'Ação perfeita! Guardar os pneus acaba com o foco e previne futuros problemas.' },
    { id: 'larvicide', name: 'Aplicar Larvicida', damage: 25, proliferationEffect: -5, chargeGain: 25, isCorrect: true, message: 'O larvicida elimina as larvas, mas o pneu ainda pode acumular água.' },
    { id: 'educate', name: 'Educar Morador', damage: 0, proliferationEffect: -15, chargeGain: 40, isCorrect: true, message: 'O morador aprendeu a guardar os pneus! A proliferação na área diminui.' },
    { id: 'ignore', name: 'Ignorar', damage: 0, proliferationEffect: 15, chargeGain: 0, isCorrect: false, message: 'Ignorar não resolve! O foco continua se proliferando rapidamente.' },
];

const PLANT_SAUCER_ACTIONS: Action[] = [
    { id: 'sand', name: 'Colocar Areia no Prato', damage: 45, proliferationEffect: -15, chargeGain: 35, isCorrect: true, message: 'Ótima escolha! A areia absorve a água e impede o desenvolvimento das larvas.' },
    { id: 'clean', name: 'Eliminar Água Parada', damage: 30, proliferationEffect: 0, chargeGain: 25, isCorrect: true, message: 'Ação direta! O prato foi esvaziado, causando impacto nas larvas.' },
    { id: 'water', name: 'Regar a Planta', damage: 0, proliferationEffect: 10, chargeGain: 5, isCorrect: false, message: 'Cuidado! Regar a planta encheu ainda mais o pratinho, ajudando o foco.' },
    { id: 'larvicide', name: 'Aplicar Larvicida', damage: 20, proliferationEffect: -5, chargeGain: 20, isCorrect: true, message: 'O larvicida funciona, mas a areia ou a limpeza semanal são mais eficazes.' },
];

const WATER_TANK_ACTIONS: Action[] = [
    { id: 'cover', name: 'Tampar a Caixa d\'Água', damage: 50, proliferationEffect: -20, chargeGain: 40, isCorrect: true, message: 'Serviço essencial! A caixa tampada impede que mosquitos depositem ovos.' },
    { id: 'clean_tank', name: 'Limpar a Caixa', damage: 30, proliferationEffect: -10, chargeGain: 30, isCorrect: true, message: 'Limpar a caixa remove ovos e larvas. Agora, lembre-se de tampar!' },
    { id: 'larvicide', name: 'Aplicar Larvicida', damage: 20, proliferationEffect: -5, chargeGain: 20, isCorrect: false, message: 'Larvicida em água de consumo? Não é o ideal. A solução é tampar e limpar.' },
    { id: 'look', name: 'Apenas Olhar', damage: 0, proliferationEffect: 5, chargeGain: 5, isCorrect: false, message: 'Apenas olhar não adianta. O foco continua ativo.' },
];

const GUTTER_ACTIONS: Action[] = [
    { id: 'unclog', name: 'Desentupir a Calha', damage: 55, proliferationEffect: -15, chargeGain: 45, isCorrect: true, message: 'Excelente! Calha limpa, água escoando. Foco eliminado com sucesso.' },
    { id: 'larvicide', name: 'Aplicar Larvicida Granulado', damage: 25, proliferationEffect: -5, chargeGain: 25, isCorrect: true, message: 'O larvicida granulado ajuda a tratar a água parada na calha.' },
    { id: 'educate', name: 'Educar Morador', damage: 0, proliferationEffect: -20, chargeGain: 40, isCorrect: true, message: 'O morador agora sabe que precisa limpar as calhas periodicamente. Prevenção é tudo!' },
    { id: 'water_jet', name: 'Jogar Água com Mangueira', damage: 5, proliferationEffect: 10, chargeGain: 10, isCorrect: false, message: 'Isso só espalhou as folhas e as larvas! O foco pode ter se espalhado.' },
];

const PET_BOTTLE_ACTIONS: Action[] = [
    { id: 'discard', name: 'Descartar Corretamente', damage: 50, proliferationEffect: 0, chargeGain: 35, isCorrect: true, message: 'Perfeito! A garrafa foi para o lixo reciclável, eliminando o foco de vez.' },
    { id: 'empty', name: 'Esvaziar a Garrafa', damage: 30, proliferationEffect: -5, chargeGain: 25, isCorrect: true, message: 'Esvaziar elimina as larvas, mas a garrafa pode voltar a acumular água.' },
    { id: 'larvicide', name: 'Aplicar Larvicida', damage: 20, proliferationEffect: -5, chargeGain: 20, isCorrect: false, message: 'Funciona, mas o descarte da garrafa é uma solução muito mais simples e eficaz.' },
    { id: 'kick', name: 'Chutar a Garrafa', damage: 5, proliferationEffect: 10, chargeGain: 5, isCorrect: false, message: 'Chutar a garrafa só espalhou a água e as larvas por perto! A proliferação aumentou.' },
];

const TIRE_EVOLVED_ATTACKS: EnemyAttack[] = [
    { name: 'Enxame de Mosquitos', message: 'Um enxame denso de mosquitos sai do pneu! A proliferação está fora de controle.', proliferationIncrease: 25 },
    { name: 'Ovos Resistentes', message: 'Os ovos no pneu se tornaram mais resistentes, eclodindo em massa!', proliferationIncrease: 20 },
];


const ENEMIES = [
    { 
        id: 'tire', 
        name: 'Pneu com Água Parada', 
        component: SvgTireHotspot, 
        initialHp: 100, 
        proliferationRate: 5, // Lower base rate
        actions: TIRE_ACTIONS,
        evolution: { turnsToEvolve: 4, evolvesTo: 'tire_evolved' },
        attacks: [
            { name: 'Nuvem de Mosquitos', message: 'Mosquitos adultos emergem do pneu! A chance de transmissão na área aumentou.', proliferationIncrease: 15 },
            { name: 'Eclosão de Ovos', message: 'Novos ovos eclodem na água parada do pneu. A infestação cresce!', proliferationIncrease: 10 },
        ] as EnemyAttack[]
    },
    { 
        id: 'plant_saucer', 
        name: 'Prato de Vaso com Água', 
        component: SvgPlantSaucerHotspot, 
        initialHp: 80, 
        proliferationRate: 3, 
        actions: PLANT_SAUCER_ACTIONS, 
        evolution: { turnsToEvolve: 4, evolvesTo: 'plant_saucer_evolved' },
        attacks: [
            { name: 'Eclosão Rápida', message: 'Com o calor, ovos eclodem rapidamente no pratinho! A proliferação acelera.', proliferationIncrease: 10 },
            { name: 'Micro-criadouro', message: 'Pequeno, mas eficiente. O pratinho continua a gerar novas larvas.', proliferationIncrease: 7 },
        ] as EnemyAttack[]
    },
    { 
        id: 'water_tank', 
        name: 'Caixa d\'água destampada', 
        component: SvgWaterTankHotspot, 
        initialHp: 120, 
        proliferationRate: 10, 
        actions: WATER_TANK_ACTIONS,
        attacks: [
            { name: 'Infestação em Larga Escala', message: 'A caixa d\'água é um berçário! Milhares de larvas se desenvolvem.', proliferationIncrease: 15 },
            { name: 'Voo Noturno', message: 'Mosquitos saem da caixa d\'água à noite, procurando por vítimas.', proliferationIncrease: 12 },
        ] as EnemyAttack[]
    },
    { 
        id: 'gutter', 
        name: 'Calha Entupida', 
        component: SvgGutterHotspot, 
        initialHp: 90, 
        proliferationRate: 8, 
        actions: GUTTER_ACTIONS,
        attacks: [
            { name: 'Obstrução Piora', message: 'Mais folhas caem, e a água parada na calha aumenta. Condições ideais para o Aedes!', proliferationIncrease: 12 },
            { name: 'Criadouro Escondido', message: 'A calha é um foco difícil de ver, multiplicando mosquitos sem serem notados.', proliferationIncrease: 10 },
        ] as EnemyAttack[]
    },
    { 
        id: 'pet_bottle', 
        name: 'Garrafa Pet com Água', 
        component: SvgPetBottleHotspot, 
        initialHp: 70, 
        proliferationRate: 4, 
        actions: PET_BOTTLE_ACTIONS,
        attacks: [
            { name: 'Micro-Criadouro Eficaz', message: 'Pequena, mas mortal! A garrafa produz mosquitos rapidamente.', proliferationIncrease: 10 },
            { name: 'Armadilha de Água da Chuva', message: 'A garrafa volta a encher com a chuva, reativando o ciclo.', proliferationIncrease: 8 },
        ] as EnemyAttack[]
    },
    // Evolved form
    { 
        id: 'plant_saucer_evolved', 
        name: 'Prato de Vaso (Evoluído)', 
        component: SvgPlantSaucerEvolvedHotspot, 
        initialHp: 80, 
        proliferationRate: 5, 
        actions: PLANT_SAUCER_ACTIONS, 
        isEvolved: true,
        attacks: [
            { name: 'Super Eclosão', message: 'O foco evoluído explode em larvas! A proliferação é massiva!', proliferationIncrease: 20 },
            { name: 'Resistência Aumentada', message: 'As larvas se tornaram mais fortes e se desenvolvem ainda mais rápido.', proliferationIncrease: 15 },
        ] as EnemyAttack[]
    },
    { 
        id: 'tire_evolved', 
        name: 'Pneu (Infestação Grave)', 
        component: SvgTireEvolvedHotspot, 
        initialHp: 120,
        proliferationRate: 8,
        actions: TIRE_ACTIONS,
        isEvolved: true,
        attacks: TIRE_EVOLVED_ATTACKS,
    },
];

interface GameEndScreenProps {
  status: 'intro' | 'won' | 'lost';
  title: string;
  message: string;
  onReset: () => void;
  onBack: () => void;
}

const GameEndScreen: React.FC<GameEndScreenProps> = ({ status, title, message, onReset, onBack }) => {
  const [showModal, setShowModal] = useState(status === 'intro');

  useEffect(() => {
    if (status === 'won' || status === 'lost') {
      const timer = setTimeout(() => setShowModal(true), 2500); // Wait for background animations to have an effect
      return () => clearTimeout(timer);
    }
  }, [status]);

  const renderWonScreen = () => (
    <div className="absolute inset-0 bg-gradient-to-br from-sky-300 to-blue-400 flex items-center justify-center z-20 animate-fade-in p-4 overflow-hidden">
      {/* Sun Rays Effect */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <div className="w-[200vw] h-2 bg-white/50 animate-sun-rays"></div>
        <div className="w-[200vw] h-2 bg-white/50 animate-sun-rays" style={{ animationDelay: '-15s' }}></div>
      </div>
      {/* Confetti Effect */}
      {Array.from({ length: 50 }).map((_, i) => (
        <div 
          key={i}
          className="absolute top-0 w-2 h-4 rounded-full animate-confetti-fall"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
            backgroundColor: ['#fde047', '#f97316', '#22c55e', '#3b82f6'][i % 4]
          }}
        ></div>
      ))}
      <div className="absolute bottom-0 right-4 h-96 w-96 opacity-80">
        <SvgAgent />
      </div>
      {showModal && (
        <div className="bg-surface/90 backdrop-blur-sm text-center p-8 rounded-2xl shadow-2xl max-w-lg w-full animate-modal-pop-in relative z-10">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-600 mb-4">{title}</h2>
          <p className="text-text-secondary mb-8">{message}</p>
          <div className="flex gap-4 justify-center">
            <button onClick={onBack} className="bg-slate-200 text-text-secondary font-bold py-3 px-6 rounded-lg hover:bg-slate-300 transition-colors">Sair</button>
            <button onClick={onReset} className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors">Jogar Novamente</button>
          </div>
        </div>
      )}
    </div>
  );

  const renderLostScreen = () => (
    <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center z-20 animate-fade-in p-4 overflow-hidden">
        {/* Proliferation pulses */}
        {Array.from({ length: 3 }).map((_, i) => (
            <div 
                key={i}
                className="absolute w-4 h-4 bg-red-500/50 rounded-full animate-proliferation-pulse"
                style={{ animationDelay: `${i * 0.6}s` }}
            ></div>
        ))}
       {showModal && (
         <div className="bg-surface/90 backdrop-blur-sm text-center p-8 rounded-2xl shadow-2xl max-w-lg w-full animate-modal-drop-in relative z-10">
            <h2 className="text-4xl font-extrabold text-red-600 mb-4">{title}</h2>
            <p className="text-text-secondary mb-8">{message}</p>
            <div className="flex gap-4 justify-center">
                <button onClick={onBack} className="bg-slate-200 text-text-secondary font-bold py-3 px-6 rounded-lg hover:bg-slate-300 transition-colors">Sair</button>
                <button onClick={onReset} className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors">Tentar Novamente</button>
            </div>
        </div>
       )}
    </div>
  );

  const renderIntroScreen = () => (
     <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20 animate-fade-in p-4">
        <div className="bg-surface text-center p-8 rounded-xl shadow-2xl max-w-lg w-full">
            <h2 className="text-3xl font-bold text-primary mb-4">{title}</h2>
            <p className="text-text-secondary mb-8">{message}</p>
            <div className="flex gap-4 justify-center">
                <button onClick={onBack} className="bg-slate-200 text-text-secondary font-bold py-3 px-6 rounded-lg hover:bg-slate-300 transition-colors">Sair</button>
                <button onClick={onReset} className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors">Começar Batalha</button>
            </div>
        </div>
    </div>
  );
  
  switch(status) {
    case 'won': return renderWonScreen();
    case 'lost': return renderLostScreen();
    case 'intro':
    default: return renderIntroScreen();
  }
}

const DengueBattleGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    type GameState = 'intro' | 'playing' | 'won' | 'lost';
    
    const initialEnemies = useMemo(() => ENEMIES.filter(e => !e.isEvolved), []);

    const [gameState, setGameState] = useState<GameState>('intro');
    const [currentEnemy, setCurrentEnemy] = useState(initialEnemies[0]);
    const [hp, setHp] = useState(currentEnemy.initialHp);
    const [proliferation, setProliferation] = useState(0);
    const [message, setMessage] = useState('Um foco de Aedes foi encontrado!');
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);
    const [turn, setTurn] = useState(1);
    const [specialCharge, setSpecialCharge] = useState(0);

    const [animations, setAnimations] = useState({
        player: '',
        enemy: '',
        special: '',
        floatingText: null as { text: string; color: string; key: number; target: 'enemy' | 'proliferation' } | null,
    });

    // --- Game Logic ---

    const proceedWithProliferation = async (enemy: typeof ENEMIES[0], actionEffect: number) => {
        const hasAttacks = enemy.attacks && enemy.attacks.length > 0;
        const attack = hasAttacks ? enemy.attacks[Math.floor(Math.random() * enemy.attacks.length)] : null;
    
        const attackMessage = attack ? `O foco usa: ${attack.name}!` : 'O foco está se proliferando...';
        setMessage(attackMessage);
    
        if (attack) {
            setAnimations(prev => ({ ...prev, enemy: 'animate-enemy-attack' }));
            await sleep(800);
        } else {
            await sleep(1000);
        }
    
        const proliferationIncrease = attack ? attack.proliferationIncrease : 0;
        const totalIncrease = enemy.proliferationRate + proliferationIncrease + actionEffect;
        const newProliferation = Math.min(MAX_PROLIFERATION, proliferation + totalIncrease);
        setProliferation(newProliferation);
    
        if (totalIncrease !== 0) {
            setAnimations(prev => ({ 
                ...prev, 
                enemy: '',
                floatingText: { 
                    text: `${totalIncrease > 0 ? '+' : ''}${totalIncrease} Prolif.`, 
                    color: totalIncrease > 0 ? 'text-blue-500' : 'text-green-500',
                    target: 'proliferation', 
                    key: Date.now() 
                }
            }));
        } else {
             setAnimations(prev => ({ ...prev, enemy: '' }));
        }
        
        if (attack) {
            setMessage(attack.message);
        }
        
        await sleep(1500);
        setAnimations(prev => ({ ...prev, floatingText: null }));
    
        if (newProliferation >= MAX_PROLIFERATION) {
            setMessage('A proliferação atingiu o nível máximo!');
            await sleep(1500);
            setGameState('lost');
        } else {
            setMessage('Qual a ação correta para este foco?');
            setIsPlayerTurn(true);
        }
    };

    const enemyTurn = async (actionEffect: number) => {
        const nextTurn = turn + 1;
        setTurn(nextTurn);
        let enemyForTurn = currentEnemy;
    
        if (currentEnemy.evolution && nextTurn >= currentEnemy.evolution.turnsToEvolve) {
            const evolvedForm = ENEMIES.find(e => e.id === currentEnemy.evolution!.evolvesTo);
            if (evolvedForm) {
                setMessage(`${currentEnemy.name} está evoluindo!`);
                setAnimations(prev => ({...prev, enemy: 'animate-evolve-glow'}));
                await sleep(1500);
    
                setCurrentEnemy(evolvedForm);
                setHp(prev => Math.min(evolvedForm.initialHp, prev + 20));
                enemyForTurn = evolvedForm;
                
                setAnimations(prev => ({...prev, enemy: ''}));
                setMessage(`${evolvedForm.name} apareceu!`);
                await sleep(1500);
            }
        }
        
        await proceedWithProliferation(enemyForTurn, actionEffect);
    };

    const handlePlayerAction = async (action: Action) => {
        if (!isPlayerTurn) return;
        setIsPlayerTurn(false);
    
        setMessage(`Agente usou ${action.name}!`);
        setAnimations(prev => ({ ...prev, player: 'animate-player-attack' }));
        await sleep(400); 
    
        const newHp = Math.max(0, hp - action.damage);
        setHp(newHp);
        const newCharge = Math.min(MAX_SPECIAL_CHARGE, specialCharge + action.chargeGain);
        setSpecialCharge(newCharge);
        setAnimations(prev => ({
            ...prev,
            player: 'animate-player-attack',
            enemy: 'animate-shake',
            floatingText: { text: `${action.damage > 0 ? `-${action.damage} HP` : 'Sem dano'}`, color: 'text-red-500', target: 'enemy', key: Date.now() }
        }));
        await sleep(400);
    
        setAnimations({ player: '', enemy: 'animate-shake', special: '', floatingText: null });
        setMessage(action.message);
        await sleep(500);
    
        setAnimations(prev => ({...prev, enemy: ''}));
    
        if (newHp === 0) {
            await sleep(1500);
            setGameState('won');
        } else {
            await sleep(1000);
            enemyTurn(action.proliferationEffect);
        }
    };

    const handleSpecialAction = async () => {
        if (!isPlayerTurn || specialCharge < MAX_SPECIAL_CHARGE) return;
        setIsPlayerTurn(false);
        setSpecialCharge(0);

        setMessage(`Agente convocou um ${SPECIAL_ACTION.name}!`);
        setAnimations(prev => ({...prev, special: 'animate-special-effect' }));
        await sleep(600);

        const newHp = Math.max(0, hp - SPECIAL_ACTION.damage);
        setHp(newHp);
        setAnimations(prev => ({
            ...prev,
            special: 'animate-special-effect',
            enemy: 'animate-shake',
            floatingText: { text: `-${SPECIAL_ACTION.damage} HP`, color: 'text-red-500', target: 'enemy', key: Date.now() }
        }));
        await sleep(600);

        setAnimations(prev => ({...prev, player: '', enemy: 'animate-shake', special: '', floatingText: null }));
        setMessage(SPECIAL_ACTION.message);
        await sleep(500);
        setAnimations(prev => ({...prev, enemy: ''}));

        if (newHp === 0) {
            await sleep(1500);
            setGameState('won');
        } else {
            await sleep(1000);
            enemyTurn(SPECIAL_ACTION.proliferationEffect);
        }
    };

    const resetGame = () => {
        const randomEnemy = initialEnemies[Math.floor(Math.random() * initialEnemies.length)];
        setCurrentEnemy(randomEnemy);
        setHp(randomEnemy.initialHp);
        setProliferation(0);
        setIsPlayerTurn(true);
        setMessage(`${randomEnemy.name} foi encontrado(a)!`);
        setGameState('playing');
        setTurn(1);
        setSpecialCharge(0);
        setAnimations({ player: '', enemy: '', special: '', floatingText: null });
    };

    if (gameState !== 'playing') {
        let title = '';
        let body = '';
        if (gameState === 'intro') {
            title = 'Batalha contra o Foco';
            body = 'Elimine o foco de Aedes antes que a proliferação atinja o máximo. Use a ação correta para cada tipo de criadouro! Alguns focos podem evoluir se demorar muito.';
        } else if (gameState === 'won') {
            title = 'Vitória!';
            body = `Parabéns, Agente! Você eliminou o foco de "${currentEnemy.name}" e protegeu a comunidade. Seu trabalho é fundamental!`;
        } else { // lost
            title = 'Derrota...';
            body = `A proliferação do foco de "${currentEnemy.name}" foi muito rápida. Novos mosquitos nasceram. Estude as ações e tente novamente!`;
        }
        return <GameEndScreen status={gameState} title={title} message={body} onReset={resetGame} onBack={onBack} />;
    }
    
    const chargePercentage = (specialCharge / MAX_SPECIAL_CHARGE) * 100;
    
    return (
        <div className="w-full h-[calc(100vh-10rem)] bg-slate-100 rounded-xl shadow-inner-light p-2 sm:p-4 flex flex-col relative font-sans bg-center bg-cover overflow-hidden" style={{backgroundImage: "url('https://www.toptal.com/designers/subtlepatterns/uploads/watercolor.png')"}}>
            {animations.special && (
                <div key={animations.special} className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none animate-special-effect">
                    <div className="w-96 h-96 bg-yellow-300/50 rounded-full flex items-center justify-center filter blur-xl"></div>
                    <span className="absolute text-white text-5xl font-extrabold uppercase [text-shadow:3px_3px_5px_rgba(0,0,0,0.5)]">Mutirão!</span>
                </div>
            )}
            
            {/* Opponent Area */}
            <div className="flex-grow flex flex-col justify-end items-center pb-2 min-h-0">
                 <div className="relative">
                    <div className={`w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 mb-2 transition-all duration-300 ${animations.enemy}`}>
                        {React.createElement(currentEnemy.component)}
                    </div>
                    {animations.floatingText?.target === 'enemy' && (
                        <div key={animations.floatingText.key} className="absolute inset-0 flex items-center justify-center pointer-events-none animate-float-up z-10">
                            <span className={`text-3xl font-bold ${animations.floatingText.color} [text-shadow:2px_2px_4px_rgba(0,0,0,0.5)]`}>{animations.floatingText.text}</span>
                        </div>
                    )}
                </div>

                <div className="w-full max-w-xs sm:max-w-sm bg-white/80 p-2 sm:p-3 rounded-lg shadow-md border border-slate-300 space-y-2">
                    <div className="flex justify-between font-bold text-sm">
                        <span>{currentEnemy.name}</span>
                        <span>HP</span>
                    </div>
                    <HealthBar value={hp} max={currentEnemy.initialHp} color="#ef4444" />
                </div>
            </div>

            {/* Proliferation Bar */}
            <div className="absolute top-2 sm:top-4 right-2 sm:right-4 w-full max-w-[280px] sm:max-w-xs md:max-w-sm z-20">
                <div className="bg-white/80 p-2 rounded-lg shadow-md border border-slate-300 space-y-1 relative">
                     <p className="text-center font-bold text-xs text-blue-800">Nível de Proliferação</p>
                    <HealthBar value={proliferation} max={MAX_PROLIFERATION} color="#3b82f6" />
                    {animations.floatingText?.target === 'proliferation' && (
                        <div key={animations.floatingText.key} className="absolute -top-6 right-0 pointer-events-none animate-float-up">
                            <span className={`text-lg font-bold ${animations.floatingText.color} [text-shadow:1px_1px_2px_rgba(0,0,0,0.3)]`}>{animations.floatingText.text}</span>
                        </div>
                    )}
                </div>
            </div>
            
             {/* Back button */}
            <button onClick={onBack} className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-white/80 text-text-primary font-bold py-2 px-4 rounded-lg hover:bg-white/90 transition-colors z-20">
                &larr; Voltar
            </button>

            {/* Player Area */}
            <div className="flex-shrink-0 flex justify-center items-end relative mt-2">
                <div className={`absolute bottom-2 right-1 h-36 w-36 sm:h-48 sm:w-48 z-10 pointer-events-none ${animations.player}`}>
                    <SvgAgent />
                </div>
                <div className="w-full bg-white/90 p-3 sm:p-4 pr-24 sm:pr-32 rounded-t-2xl border-t-4 border-primary shadow-2xl space-y-3">
                    <div className="bg-slate-100 border-2 border-slate-300 rounded-lg p-3 sm:p-4 h-auto min-h-[72px] flex items-center">
                        <TypeWriter text={message} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                        {currentEnemy.actions.map(action => (
                             <button 
                                key={action.id}
                                onClick={() => handlePlayerAction(action)}
                                disabled={!isPlayerTurn}
                                className="p-3 text-left rounded-lg shadow-md border-2 border-slate-400 bg-white hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-slate-200 disabled:text-slate-500 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                            >
                                <span className="font-bold text-sm sm:text-base">{action.name}</span>
                            </button>
                        ))}
                    </div>

                     {/* Special Action Area */}
                    <div className="space-y-2">
                        <div className="w-full bg-slate-300 rounded-full h-3 border border-slate-400">
                            <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500" style={{ width: `${chargePercentage}%` }}></div>
                        </div>
                        <button
                            onClick={handleSpecialAction}
                            disabled={!isPlayerTurn || specialCharge < MAX_SPECIAL_CHARGE}
                            className="w-full p-3 text-center rounded-lg shadow-lg border-2 border-amber-500 bg-amber-300 hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 disabled:bg-slate-200 disabled:text-slate-500 disabled:border-slate-400 disabled:cursor-not-allowed transition-all transform hover:scale-105 disabled:transform-none"
                        >
                            <span className="font-bold text-base sm:text-xl text-amber-900">{SPECIAL_ACTION.name} {specialCharge < MAX_SPECIAL_CHARGE && `(${Math.floor(specialCharge)}%)`}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DengueBattleGame;