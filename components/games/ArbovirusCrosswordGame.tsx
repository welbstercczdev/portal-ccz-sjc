import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';

// --- GAME CONFIGURATION ---
const GRID_WIDTH = 14;
const GRID_HEIGHT = 13;

type WordDirection = 'across' | 'down';
interface WordData {
    number: number;
    row: number;
    col: number;
    direction: WordDirection;
    word: string;
    clue: string;
}

const WORDS: WordData[] = [
    { number: 1, row: 0, col: 3, direction: 'across', word: 'CRIADOURO', clue: 'Local com água parada onde o mosquito se prolifera.' },
    { number: 1, row: 0, col: 3, direction: 'down', word: 'CHIKUNGUNYA', clue: 'Famosa por causar fortes dores nas articulações.' },
    { number: 2, row: 0, col: 6, direction: 'down', word: 'AGUA', clue: 'Elemento essencial para a proliferação do Aedes aegypti.' },
    { number: 3, row: 0, col: 10, direction: 'down', word: 'REPELENTE', clue: 'Produto aplicado na pele para afastar mosquitos.' },
    { number: 4, row: 3, col: 1, direction: 'across', word: 'ZIKA', clue: 'Vírus que pode causar microcefalia em recém-nascidos.' },
    { number: 5, row: 5, col: 5, direction: 'down', word: 'VETOR', clue: 'Organismo, como um mosquito, que transmite doenças.' },
    { number: 6, row: 5, col: 9, direction: 'across', word: 'FEBRE', clue: 'Sintoma comum em todas as arboviroses.' },
    { number: 7, row: 6, col: 0, direction: 'across', word: 'DENGUE', clue: 'A arbovirose mais comum no Brasil, com 4 sorotipos.' },
    { number: 8, row: 8, col: 5, direction: 'across', word: 'OVO', clue: 'Primeira fase do ciclo de vida, depositado em água parada.' },
    { number: 9, row: 7, col: 12, direction: 'down', word: 'LARVA', clue: 'Fase aquática do mosquito que se move na água.' },
    { number: 10, row: 10, col: 0, direction: 'across', word: 'PUPA', clue: 'Fase de transformação entre larva e mosquito adulto.' },
    { number: 11, row: 8, col: 9, direction: 'across', word: 'TELA', clue: 'Proteção física contra mosquitos, usada em janelas e portas.' },
];


// --- CELL & GRID TYPES ---
interface CellData {
    isInput: boolean;
    number: number | null;
    char: string | null;
    acrossWordNum: number | null;
    downWordNum: number | null;
}

interface ActiveCell {
    row: number;
    col: number;
}


// --- HELPER FUNCTIONS ---
const initializeGrid = (): CellData[][] => {
    const grid = Array.from({ length: GRID_HEIGHT }, () =>
        Array.from({ length: GRID_WIDTH }, () => ({
            isInput: false,
            number: null,
            char: null,
            acrossWordNum: null,
            downWordNum: null,
        }))
    );

    WORDS.forEach(({ number, row, col, direction, word }) => {
        if (grid[row][col].number === null) {
            grid[row][col].number = number;
        }
        for (let i = 0; i < word.length; i++) {
            const r = row + (direction === 'down' ? i : 0);
            const c = col + (direction === 'across' ? i : 0);
            if(grid[r] && grid[r][c]) {
                grid[r][c].isInput = true;
                grid[r][c].char = word[i];
                if (direction === 'across') {
                    grid[r][c].acrossWordNum = number;
                } else {
                    grid[r][c].downWordNum = number;
                }
            }
        }
    });
    return grid;
};

// --- GAME COMPONENTS ---
const GameScreen: React.FC<{ status: 'intro' | 'won', title: string, message: string, onReset: () => void, onBack: () => void }> = ({ status, title, message, onReset, onBack }) => {
    if (status === 'won') {
        return (
            <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center z-20 animate-fade-in p-4 overflow-hidden font-poppins">
                {Array.from({ length: 100 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-4 animate-confetti-fall"
                        style={{
                            left: `${Math.random() * 100}vw`,
                            transform: `rotate(${Math.random() * 360}deg)`,
                            backgroundColor: ['#ffc700', '#f97316', '#22c55e', '#3b82f6'][i % 4],
                            animationDuration: `${2 + Math.random() * 4}s`,
                            animationDelay: `${Math.random() * 5}s`,
                        }}
                    />
                ))}
                <div className="bg-surface/90 backdrop-blur-sm text-center p-10 rounded-2xl shadow-2xl max-w-2xl w-full animate-modal-pop-in border-4 border-white/50">
                    <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-600 mb-4">{title}</h2>
                    <p className="text-text-secondary text-lg mb-8">{message}</p>
                    <div className="flex gap-4 justify-center">
                        <button onClick={onBack} className="bg-slate-200 text-text-secondary font-bold py-3 px-6 rounded-lg hover:bg-slate-300 transition-colors">Sair</button>
                        <button onClick={onReset} className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors">Jogar Novamente</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20 animate-fade-in p-4">
            <div className="bg-surface text-center p-8 rounded-xl shadow-2xl max-w-2xl w-full animate-modal-drop-in font-poppins">
                <h2 className="text-3xl font-bold text-primary mb-4">{title}</h2>
                <p className="text-text-secondary mb-6">{message}</p>
                <div className="flex gap-4 justify-center">
                    <button onClick={onBack} className="bg-slate-200 text-text-secondary font-bold py-3 px-6 rounded-lg hover:bg-slate-300 transition-colors">Sair</button>
                    <button onClick={onReset} className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors">Começar</button>
                </div>
            </div>
        </div>
    );
};

const ArbovirusCrosswordGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    type GameState = 'intro' | 'playing' | 'won';
    
    const [gameState, setGameState] = useState<GameState>('intro');
    const [grid] = useState<CellData[][]>(initializeGrid());
    const [userInput, setUserInput] = useState<string[][]>(() => Array.from({ length: GRID_HEIGHT }, () => Array(GRID_WIDTH).fill('')));
    const [activeCell, setActiveCell] = useState<ActiveCell | null>({ row: 0, col: 3 });
    const [direction, setDirection] = useState<WordDirection>('across');
    const [correctWords, setCorrectWords] = useState<number[]>([]);
    const [justCompletedWords, setJustCompletedWords] = useState<number[]>([]);
    const [showWinAnimation, setShowWinAnimation] = useState(false);
    
    const inputRefs = useRef<Array<Array<HTMLInputElement | null>>>([]);

    const activeWordNum = useMemo(() => {
        if (!activeCell) return null;
        const cell = grid[activeCell.row][activeCell.col];
        return direction === 'across' ? cell.acrossWordNum : cell.downWordNum;
    }, [activeCell, direction, grid]);

    const wordObjects = useMemo(() => {
        const map = new Map<number, WordData>();
        WORDS.forEach(word => {
            if (!map.has(word.number)) {
                map.set(word.number, word);
            }
        });
        return Array.from(map.values());
    }, []);

    useEffect(() => {
        if (gameState === 'playing' && correctWords.length === wordObjects.length) {
            setShowWinAnimation(true);
            setTimeout(() => setGameState('won'), 2000); // Wait for win animation
        }
    }, [correctWords, gameState, wordObjects]);

    const handleCellClick = (row: number, col: number) => {
        if (!grid[row][col].isInput || showWinAnimation) return;

        if (activeCell && activeCell.row === row && activeCell.col === col) {
            const canGoAcross = grid[row][col].acrossWordNum !== null;
            const canGoDown = grid[row][col].downWordNum !== null;
            if (canGoAcross && canGoDown) {
                setDirection(prev => (prev === 'across' ? 'down' : 'across'));
            }
        } else {
            const canGoAcross = grid[row][col].acrossWordNum !== null;
            setDirection(canGoAcross ? 'across' : 'down');
        }
        
        setActiveCell({ row, col });
        inputRefs.current[row]?.[col]?.focus();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, row: number, col: number) => {
        if (showWinAnimation) return;
        const val = e.target.value.toUpperCase().slice(-1);
        const newUserInput = userInput.map(r => [...r]);
        newUserInput[row][col] = val;
        setUserInput(newUserInput);

        if (val) {
            let nextRow = row;
            let nextCol = col;
            
            do {
                if (direction === 'down') {
                    nextRow++;
                } else {
                    nextCol++;
                }
            } while (grid[nextRow]?.[nextCol] && !grid[nextRow][nextCol].isInput);

            if (grid[nextRow]?.[nextCol]?.isInput) {
                inputRefs.current[nextRow]?.[nextCol]?.focus();
                setActiveCell({ row: nextRow, col: nextCol });
            } else {
                checkAnswers();
            }
        }
    };
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, row: number, col: number) => {
        if (showWinAnimation) return;
        let newRow = row, newCol = col;
        let shouldPreventDefault = true;

        switch(e.key) {
            case 'ArrowUp': 
                setDirection('down');
                do { newRow--; } while(newRow > 0 && !grid[newRow][col].isInput);
                break;
            case 'ArrowDown': 
                setDirection('down');
                do { newRow++; } while(newRow < GRID_HEIGHT - 1 && !grid[newRow][col].isInput);
                break;
            case 'ArrowLeft': 
                setDirection('across');
                do { newCol--; } while(newCol > 0 && !grid[row][newCol].isInput);
                break;
            case 'ArrowRight':
                setDirection('across');
                do { newCol++; } while(newCol < GRID_WIDTH - 1 && !grid[row][newCol].isInput);
                break;
            case 'Backspace':
                if (!userInput[row][col]) {
                    if(direction === 'across') {
                       do { newCol--; } while(newCol > 0 && !grid[row][newCol].isInput);
                    } else {
                       do { newRow--; } while(newRow > 0 && !grid[newRow][col].isInput);
                    }
                }
                break;
            case 'Enter':
            case 'Tab':
                checkAnswers();
                break;
            default:
                shouldPreventDefault = false;
        }
        
        if (shouldPreventDefault) e.preventDefault();
        
        if (grid[newRow]?.[newCol]?.isInput) {
            inputRefs.current[newRow]?.[newCol]?.focus();
            setActiveCell({row: newRow, col: newCol});
        }
    };

    const checkAnswers = useCallback(() => {
        const newlyCorrectedNumbers: number[] = [];
        WORDS.forEach(wordInfo => {
            if (correctWords.includes(wordInfo.number)) return;
            let wordIsCorrect = true;
            for (let i = 0; i < wordInfo.word.length; i++) {
                const r = wordInfo.row + (wordInfo.direction === 'down' ? i : 0);
                const c = wordInfo.col + (wordInfo.direction === 'across' ? i : 0);
                if (userInput[r][c] !== wordInfo.word[i]) {
                    wordIsCorrect = false;
                    break;
                }
            }
            if (wordIsCorrect) {
                 newlyCorrectedNumbers.push(wordInfo.number);
            }
        });
        if (newlyCorrectedNumbers.length > 0) {
            setJustCompletedWords(newlyCorrectedNumbers);
            setTimeout(() => setJustCompletedWords([]), 1000);
            setCorrectWords(prev => [...new Set([...prev, ...newlyCorrectedNumbers])]);
        }
    }, [correctWords, userInput]);

    const resetGame = () => {
        setUserInput(Array.from({ length: GRID_HEIGHT }, () => Array(GRID_WIDTH).fill('')));
        setCorrectWords([]);
        setJustCompletedWords([]);
        setShowWinAnimation(false);
        setActiveCell({ row: 0, col: 3 });
        setDirection('across');
        setGameState('playing');
    };
    
    const clearBoard = () => {
        setUserInput(Array.from({ length: GRID_HEIGHT }, () => Array(GRID_WIDTH).fill('')));
        setCorrectWords([]);
        setJustCompletedWords([]);
    };

    if (gameState !== 'playing') {
        const title = gameState === 'intro' ? 'Cruzadinha das Arboviroses' : 'Parabéns, Mestre das Palavras!';
        const message = gameState === 'intro'
            ? `Teste seus conhecimentos preenchendo a cruzadinha. Clique em uma casa para ver a dica e digite a resposta.`
            : `Você completou a cruzadinha com sucesso! Seu conhecimento é uma arma poderosa na luta contra o Aedes.`;
        return <GameScreen status={gameState} title={title} message={message} onReset={resetGame} onBack={onBack} />;
    }

    return (
        <div className="w-full flex-1 bg-slate-100 rounded-xl p-4 md:p-6 font-poppins flex flex-col gap-4 text-text-primary" onKeyUp={(e) => { if (e.key === 'Enter') checkAnswers() }}>
            <div className="flex-shrink-0 flex flex-col sm:flex-row justify-between items-center gap-4">
                <h1 className="text-3xl font-bold text-primary">Cruzadinha das Arboviroses</h1>
                <div className="flex gap-3">
                    <button onClick={clearBoard} className="bg-amber-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-amber-600 transition-colors shadow-sm">Limpar Tabuleiro</button>
                    <button onClick={checkAnswers} className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors shadow-sm">Verificar</button>
                </div>
            </div>

            <div className="flex-grow flex flex-col lg:flex-row gap-6 min-h-0 overflow-y-auto">
                <div className="w-full lg:w-2/3 flex items-center justify-center p-2 sm:p-4 bg-white/50 rounded-lg shadow-inner-light">
                    <div className="grid bg-slate-800 border-4 border-slate-800 shadow-2xl" style={{ gridTemplateColumns: `repeat(${GRID_WIDTH}, minmax(0, 1fr))`, aspectRatio: `${GRID_WIDTH}/${GRID_HEIGHT}` }}>
                        {grid.map((rowArr, r) =>
                            rowArr.map((cell, c) => {
                                if (!cell.isInput) {
                                    return <div key={`${r}-${c}`} className="bg-slate-700 shadow-inner" style={showWinAnimation ? { animation: `cell-flip-win 0.8s ease-in-out forwards`, animationDelay: `${(r + c) * 0.04}s` } : {}} />;
                                }
                                
                                const cellData = grid[r][c];
                                const isAcrossCorrect = cellData.acrossWordNum !== null && correctWords.includes(cellData.acrossWordNum);
                                const isDownCorrect = cellData.downWordNum !== null && correctWords.includes(cellData.downWordNum);
                                const isCorrect = (isAcrossCorrect || isDownCorrect);
                                const isJustCompleted = (cellData.acrossWordNum !== null && justCompletedWords.includes(cellData.acrossWordNum)) || (cellData.downWordNum !== null && justCompletedWords.includes(cellData.downWordNum));
                                
                                const isActiveWord = (activeCell && !showWinAnimation) && ((direction === 'across' && activeWordNum === cellData.acrossWordNum) || (direction === 'down' && activeWordNum === cellData.downWordNum));
                                const isActiveCell = activeCell?.row === r && activeCell?.col === c && !showWinAnimation;

                                return (
                                    <div 
                                        key={`${r}-${c}`}
                                        className={`relative aspect-square border-r border-b border-slate-400 ${isCorrect ? 'bg-green-200' : isActiveWord ? 'bg-cyan-100' : 'bg-white'} ${isJustCompleted ? 'animate-correct-word-pulse' : ''}`}
                                        style={showWinAnimation ? { animation: `cell-flip-win 0.8s ease-in-out forwards`, animationDelay: `${(r + c) * 0.04}s` } : {}}
                                    >
                                        {cell.number && <span className="absolute top-0 left-0.5 text-slate-500 font-bold text-[0.65rem] sm:text-xs leading-none">{cell.number}</span>}
                                        <input
                                            ref={el => {
                                                if (!inputRefs.current[r]) inputRefs.current[r] = [];
                                                inputRefs.current[r][c] = el;
                                            }}
                                            type="text"
                                            maxLength={1}
                                            value={userInput[r][c]}
                                            onClick={() => handleCellClick(r, c)}
                                            onChange={(e) => handleInputChange(e, r, c)}
                                            onKeyDown={(e) => handleKeyDown(e, r, c)}
                                            className={`w-full h-full text-center uppercase font-bold text-xl md:text-2xl outline-none p-0 bg-transparent transition-colors duration-300 ${isActiveCell ? 'caret-cyan-600 ring-2 ring-cyan-500 z-10' : ''} ${isCorrect ? 'text-green-800' : 'text-slate-800'}`}
                                            aria-label={`célula ${r},${c}`}
                                            readOnly={showWinAnimation}
                                        />
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                <div className="w-full lg:w-1/3 flex flex-col gap-4 min-h-0">
                    <div className="flex-1 flex flex-col bg-white p-4 rounded-lg shadow-md min-h-0">
                        <h3 className="font-bold text-xl text-text-primary border-b-2 border-primary mb-2 pb-1 flex-shrink-0">Horizontais</h3>
                        <ul className="space-y-2 text-sm lg:text-base overflow-y-auto pr-2">
                            {WORDS.filter(w => w.direction === 'across').sort((a,b) => a.number - b.number).map(w => (
                                <li key={`across-${w.number}`} onClick={() => { setDirection('across'); handleCellClick(w.row, w.col); }} className={`p-2 rounded-md cursor-pointer transition-colors ${activeWordNum === w.number && direction === 'across' ? 'bg-cyan-200' : 'hover:bg-cyan-50'} ${correctWords.includes(w.number) ? 'text-slate-400 line-through' : ''}`}>
                                    <strong className="text-primary">{w.number}.</strong> {w.clue}
                                </li>
                            ))}
                        </ul>
                    </div>
                     <div className="flex-1 flex flex-col bg-white p-4 rounded-lg shadow-md min-h-0">
                        <h3 className="font-bold text-xl text-text-primary border-b-2 border-primary mb-2 pb-1 flex-shrink-0">Verticais</h3>
                        <ul className="space-y-2 text-sm lg:text-base overflow-y-auto pr-2">
                            {WORDS.filter(w => w.direction === 'down').sort((a,b) => a.number - b.number).map(w => (
                                 <li key={`down-${w.number}`} onClick={() => { setDirection('down'); handleCellClick(w.row, w.col); }} className={`p-2 rounded-md cursor-pointer transition-colors ${activeWordNum === w.number && direction === 'down' ? 'bg-cyan-200' : 'hover:bg-cyan-50'} ${correctWords.includes(w.number) ? 'text-slate-400 line-through' : ''}`}>
                                    <strong className="text-primary">{w.number}.</strong> {w.clue}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArbovirusCrosswordGame;