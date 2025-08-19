import React, { useState, useEffect, useMemo, useRef } from 'react';

// --- GAME CONFIG ---
const GAME_DURATION = 90; // seconds
const STAGES = [
    { id: 'egg', name: 'Ovo', description: 'Os ovos são depositados nas paredes de recipientes com água parada. Podem sobreviver por mais de um ano em ambiente seco.' },
    { id: 'larva', name: 'Larva', description: 'Ao entrar em contato com a água, o ovo eclode e se torna uma larva. Esta fase dura cerca de 5 dias.' },
    { id: 'pupa', name: 'Pupa', description: 'A pupa é a fase de transição entre a larva e o adulto. Dura cerca de 2 dias e não se alimenta.' },
    { id: 'mosquito', name: 'Mosquito Adulto', description: 'O mosquito adulto emerge da pupa. A fêmea precisa de sangue para maturar seus ovos, reiniciando o ciclo.' },
];

// --- SVG ASSETS ---
const SvgEgg = () => (
    <img src="../../../imagens/ciclo-da-vida/ovo.jpeg" alt="Ovos do Aedes aegypti" className="w-full h-full object-contain" />
);

const SvgLarva = () => (
    <img src="../../../imagens/ciclo-da-vida/larva.jpeg" alt="Larva do Aedes aegypti" className="w-full h-full object-contain" />
);

const SvgPupa = () => (
    <img src="../../../imagens/ciclo-da-vida/pupa.jpeg" alt="Pupa do Aedes aegypti" className="w-full h-full object-contain" />
);

const SvgMosquito = () => (
    <img src="../../../imagens/ciclo-da-vida/aedes.jpeg" alt="Mosquito Aedes aegypti adulto" className="w-full h-full object-contain" />
);


const STAGE_ICONS: Record<string, React.ReactNode> = {
    egg: <SvgEgg />,
    larva: <SvgLarva />,
    pupa: <SvgPupa />,
    mosquito: <SvgMosquito />,
};

// --- COMPONENT ---
const AedesLifecycleGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    type GameState = 'intro' | 'playing' | 'finished';

    const [gameState, setGameState] = useState<GameState>('intro');
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
    const [placedStages, setPlacedStages] = useState<Record<string, string | null>>({ 'zone-0': null, 'zone-1': null, 'zone-2': null, 'zone-3': null });
    const [draggedItem, setDraggedItem] = useState<string | null>(null);

    const availableStages = useMemo(() => STAGES.filter(s => !Object.values(placedStages).includes(s.id)), [placedStages]);
    const correctPlacements = useMemo(() => Object.values(placedStages).filter(Boolean).length, [placedStages]);
    
    // Timer effect
    useEffect(() => {
        if (gameState !== 'playing' || timeLeft === 0) return;
        const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [gameState, timeLeft]);

    // Game end conditions
    useEffect(() => {
        if (gameState === 'playing' && (timeLeft === 0 || correctPlacements === STAGES.length)) {
            setGameState('finished');
        }
    }, [timeLeft, correctPlacements, gameState]);

    const handleDragStart = (stageId: string) => {
        setDraggedItem(stageId);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (zoneIndex: number) => {
        const correctStageId = STAGES[zoneIndex].id;
        if (draggedItem === correctStageId) {
            setPlacedStages(prev => ({ ...prev, [`zone-${zoneIndex}`]: correctStageId }));
        }
        setDraggedItem(null);
    };

    const resetGame = () => {
        setGameState('playing');
        setTimeLeft(GAME_DURATION);
        setPlacedStages({ 'zone-0': null, 'zone-1': null, 'zone-2': null, 'zone-3': null });
    };

    const dropZones = [
        { id: 0, top: '8%', left: '50%', transform: 'translateX(-50%)' },
        { id: 1, top: '50%', left: '8%', transform: 'translateY(-50%)' },
        { id: 2, top: '82%', left: '50%', transform: 'translateX(-50%)' },
        { id: 3, top: '50%', left: '82%', transform: 'translateY(-50%)' },
    ];

    if (gameState === 'intro' || gameState === 'finished') {
        const isWin = correctPlacements === STAGES.length;
        const title = gameState === 'intro' ? 'Jogo: Ciclo da Vida' : isWin ? 'Parabéns!' : 'Tempo Esgotado!';
        const message = gameState === 'intro'
            ? `Arraste cada fase do Aedes aegypti para sua posição correta no ciclo de vida. Você tem ${GAME_DURATION} segundos.`
            : isWin
            ? `Você completou o ciclo com sucesso em ${GAME_DURATION - timeLeft} segundos!`
            : `Você não conseguiu completar o ciclo a tempo. Estude as fases e tente novamente.`;

        return (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20 animate-fade-in p-4">
                <div className="bg-surface text-center p-8 rounded-xl shadow-2xl max-w-2xl w-full">
                    <h2 className="text-3xl font-bold text-primary mb-4">{title}</h2>
                    <p className="text-text-secondary mb-6">{message}</p>
                    {gameState === 'finished' && (
                        <div className="text-left space-y-3 mb-8 bg-slate-50 p-4 rounded-lg border border-border-color">
                            {STAGES.map(stage => (
                                <div key={stage.id}>
                                    <h4 className="font-bold text-text-primary">{stage.name}</h4>
                                    <p className="text-sm text-text-secondary">{stage.description}</p>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="flex gap-4 justify-center">
                        <button onClick={onBack} className="bg-slate-200 text-text-secondary font-bold py-3 px-6 rounded-lg hover:bg-slate-300 transition-colors">Sair</button>
                        <button onClick={resetGame} className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors">{gameState === 'intro' ? 'Começar' : 'Jogar Novamente'}</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-[calc(100vh-10rem)] bg-slate-100 rounded-xl shadow-inner-light p-4 flex flex-col relative overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center mb-4 px-2">
                <h2 className="text-2xl font-bold text-primary">Organize o Ciclo de Vida</h2>
                <div className="flex gap-6 text-xl font-bold text-white">
                    <div className="bg-primary/80 px-4 py-2 rounded-lg shadow-lg">Corretos: <span className="tabular-nums">{correctPlacements}/{STAGES.length}</span></div>
                    <div className="bg-red-500/80 px-4 py-2 rounded-lg shadow-lg">Tempo: <span className="tabular-nums">{timeLeft}s</span></div>
                </div>
            </div>
            
            {/* Game Area */}
            <div className="flex-1 flex gap-6">
                {/* Draggable Items */}
                <div className="w-1/4 bg-surface p-4 rounded-lg shadow-md flex flex-col gap-4">
                    <h3 className="font-bold text-lg text-center border-b pb-2">Fases</h3>
                    {availableStages.map(stage => (
                        <div
                            key={stage.id}
                            draggable
                            onDragStart={() => handleDragStart(stage.id)}
                            className="p-3 bg-white rounded-lg shadow-sm border border-border-color cursor-grab active:cursor-grabbing flex flex-col items-center gap-2"
                        >
                            <div className="w-20 h-20">{STAGE_ICONS[stage.id]}</div>
                            <span className="font-semibold text-text-primary">{stage.name}</span>
                        </div>
                    ))}
                    {availableStages.length === 0 && <p className="text-center text-text-secondary text-sm pt-4">Ciclo completo!</p>}
                </div>

                {/* Drop Area */}
                <div className="w-3/4 bg-white p-4 rounded-lg shadow-md relative">
                    {/* Background Cycle Diagram */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <circle cx="50" cy="50" r="30" stroke="#e2e8f0" strokeWidth="2" fill="none" strokeDasharray="4 4" />
                        {/* Arrows */}
                        <path d="M 50 20 L 45 25 M 50 20 L 55 25" stroke="#e2e8f0" strokeWidth="2" />
                        <path d="M 20 50 L 25 45 M 20 50 L 25 55" stroke="#e2e8f0" strokeWidth="2" />
                        <path d="M 50 80 L 45 75 M 50 80 L 55 75" stroke="#e2e8f0" strokeWidth="2" />
                        <path d="M 80 50 L 75 45 M 80 50 L 75 55" stroke="#e2e8f0" strokeWidth="2" />
                    </svg>

                    {dropZones.map(({id, top, left, transform}) => {
                        const placedId = placedStages[`zone-${id}`];
                        const stage = placedId ? STAGES.find(s => s.id === placedId) : null;
                        const isTarget = draggedItem === STAGES[id].id;
                        
                        return (
                            <div
                                key={id}
                                onDrop={() => handleDrop(id)}
                                onDragOver={handleDragOver}
                                className={`absolute w-36 h-36 rounded-full flex items-center justify-center transition-all duration-200 ${isTarget ? 'bg-green-100 border-2 border-green-400 scale-110' : 'bg-slate-100 border-2 border-dashed border-slate-300'}`}
                                style={{ top, left, transform }}
                            >
                                {stage ? (
                                    <div className="w-full h-full p-2 bg-green-200 rounded-full flex flex-col items-center justify-center animate-fade-in">
                                        <div className="w-20 h-20">{STAGE_ICONS[stage.id]}</div>
                                        <span className="font-bold text-sm text-green-800">{stage.name}</span>
                                    </div>
                                ) : (
                                    <span className="text-sm text-slate-400 font-semibold">Fase {id + 1}</span>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

export default AedesLifecycleGame;