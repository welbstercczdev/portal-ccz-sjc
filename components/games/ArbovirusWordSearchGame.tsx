import React, { useState, useEffect, useMemo, useCallback } from 'react';

// --- GAME CONFIG ---
const GAME_DURATION = 180; // 3 minutes
const GRID_SIZE = 15;
const WORDS_TO_FIND = [
    { word: 'DENGUE', clue: 'Causa febre alta e dores no corpo.' },
    { word: 'ZIKA', clue: 'Pode causar microcefalia em bebês.' },
    { word: 'CHIKUNGUNYA', clue: 'Famosa por causar fortes dores nas articulações.' },
    { word: 'FEBRE', clue: 'Sintoma comum em todas as arboviroses.' },
    { word: 'AEDES', clue: 'Gênero do mosquito transmissor.' },
    { word: 'VETOR', clue: 'Organismo que transmite um patógeno.' },
    { word: 'SINTOMAS', clue: 'Manifestações da doença no corpo.' },
    { word: 'PREVENCAO', clue: 'Ações para evitar a doença, como eliminar água parada.' },
    { word: 'MOSQUITO', clue: 'Inseto transmissor.' },
    { word: 'LARVICIDA', clue: 'Produto usado para matar larvas.' },
    { word: 'FOCO', clue: 'Local onde o mosquito se reproduz.' },
    { word: 'EPIDEMIA', clue: 'Ocorrência de uma doença em muitos indivíduos de uma região.' },
    { word: 'VIRUS', clue: 'Agente causador da doença.' },
    { word: 'AGENTE', clue: 'Profissional que combate os focos.' },
];
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

type Cell = { row: number, col: number };
type FoundWord = { word: string; cells: Cell[] };

// --- HELPER FUNCTIONS ---
const generateGrid = (words: string[], size: number): { grid: string[][], success: boolean } => {
    const grid = Array(size).fill(null).map(() => Array(size).fill(''));
    const directions = [
        { r: 0, c: 1 },  // Horizontal
        { r: 1, c: 0 },  // Vertical
        { r: 1, c: 1 },  // Diagonal down-right
        { r: 1, c: -1 }, // Diagonal down-left
    ];

    for (const word of words) {
        let placed = false;
        for (let i = 0; i < 200; i++) { // Attempts to place a word
            const dir = directions[Math.floor(Math.random() * directions.length)];
            const row = Math.floor(Math.random() * size);
            const col = Math.floor(Math.random() * size);

            let canPlace = true;
            for (let j = 0; j < word.length; j++) {
                const newRow = row + j * dir.r;
                const newCol = col + j * dir.c;
                if (newRow < 0 || newRow >= size || newCol < 0 || newCol >= size || (grid[newRow][newCol] !== '' && grid[newRow][newCol] !== word[j])) {
                    canPlace = false;
                    break;
                }
            }

            if (canPlace) {
                for (let j = 0; j < word.length; j++) {
                    grid[row + j * dir.r][col + j * dir.c] = word[j];
                }
                placed = true;
                break;
            }
        }
        if (!placed) {
            console.warn(`Could not place word: ${word}`);
            return { grid: [], success: false }; // Failed to generate
        }
    }

    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (grid[r][c] === '') {
                grid[r][c] = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
            }
        }
    }
    return { grid, success: true };
};

const getCellsInLine = (start: Cell, end: Cell): Cell[] => {
    const cells: Cell[] = [];
    const dx = end.col - start.col;
    const dy = end.row - start.row;

    if (dx === 0 && dy === 0) return [start];
    
    if (dx === 0 || dy === 0 || Math.abs(dx) === Math.abs(dy)) { // It's a straight line
        const stepX = Math.sign(dx);
        const stepY = Math.sign(dy);
        const steps = Math.max(Math.abs(dx), Math.abs(dy));
        for (let i = 0; i <= steps; i++) {
            cells.push({ row: start.row + i * stepY, col: start.col + i * stepX });
        }
    } else { // Not a straight line, invalid selection
        return [];
    }

    return cells;
};


// --- GAME COMPONENT ---
const ArbovirusWordSearchGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    type GameState = 'intro' | 'playing' | 'finished';

    const [gameState, setGameState] = useState<GameState>('intro');
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
    const [foundWords, setFoundWords] = useState<FoundWord[]>([]);
    const [isSelecting, setIsSelecting] = useState(false);
    const [startCell, setStartCell] = useState<Cell | null>(null);
    const [currentCell, setCurrentCell] = useState<Cell | null>(null);
    const [selectionStatus, setSelectionStatus] = useState<'correct' | 'wrong' | null>(null);

    const gameData = useMemo(() => {
        let result;
        do {
            const words = WORDS_TO_FIND.map(w => w.word).sort((a, b) => b.length - a.length);
            result = generateGrid(words, GRID_SIZE);
        } while (!result.success);
        return result.grid;
    }, []);
    const [grid] = useState<string[][]>(gameData);

    const selectedCells = useMemo(() => {
        if (!startCell || !currentCell) return [];
        return getCellsInLine(startCell, currentCell);
    }, [startCell, currentCell]);

    // Timer and game end logic
    useEffect(() => {
        if (gameState !== 'playing') return;

        if (timeLeft <= 0 || foundWords.length === WORDS_TO_FIND.length) {
            setGameState('finished');
            return;
        }

        const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
        return () => clearInterval(timer);
    }, [gameState, timeLeft, foundWords]);

    const checkSelectedWord = useCallback(() => {
        if (selectedCells.length < 2) return;
        const word = selectedCells.map(({ row, col }) => grid[row][col]).join('');
        
        const reversedWord = word.split('').reverse().join('');
        const wordInfo = WORDS_TO_FIND.find(w => w.word === word || w.word === reversedWord);

        const isAlreadyFound = foundWords.some(fw => fw.word === wordInfo?.word);

        if (wordInfo && !isAlreadyFound) {
            setFoundWords(prev => [...prev, { word: wordInfo.word, cells: selectedCells }]);
            setSelectionStatus('correct');
        } else if (!wordInfo) {
            setSelectionStatus('wrong');
        }

        setTimeout(() => setSelectionStatus(null), 500);
    }, [selectedCells, grid, foundWords]);

    // Mouse handlers
    const handleMouseDown = (row: number, col: number) => {
        setIsSelecting(true);
        setStartCell({ row, col });
        setCurrentCell({ row, col });
    };

    const handleMouseEnter = (row: number, col: number) => {
        if (isSelecting) {
            setCurrentCell({ row, col });
        }
    };

    const handleMouseUp = () => {
        if (isSelecting) {
            checkSelectedWord();
            setIsSelecting(false);
            setStartCell(null);
            setCurrentCell(null);
        }
    };
    
    const resetGame = () => {
        setGameState('playing');
        setTimeLeft(GAME_DURATION);
        setFoundWords([]);
    };
    
    const getCellClass = (row: number, col: number) => {
        const isSelected = selectedCells.some(c => c.row === row && c.col === col);
        const isFound = foundWords.some(fw => fw.cells.some(c => c.row === row && c.col === col));

        if (isFound) {
            return 'bg-green-300 text-green-800 transition-all duration-300';
        }

        if (isSelected) {
            if (selectionStatus === 'correct') return 'bg-green-400 text-white scale-110';
            if (selectionStatus === 'wrong') return 'bg-red-400 text-white animate-shake';
            return 'bg-blue-400 text-white scale-110';
        }
        
        return 'bg-slate-50 hover:bg-slate-200';
    };


    if (gameState !== 'playing') {
        const isWin = foundWords.length === WORDS_TO_FIND.length;
        const title = gameState === 'intro' ? 'Caça-Palavras: Arboviroses' : isWin ? 'Parabéns, Agente!' : 'Tempo Esgotado!';
        const message = gameState === 'intro'
            ? `Encontre todas as palavras relacionadas a arboviroses no quadro. Arraste para selecionar as palavras. Você tem ${GAME_DURATION / 60} minutos!`
            : isWin
            ? `Você encontrou todas as ${WORDS_TO_FIND.length} palavras! Seu conhecimento e atenção são excelentes ferramentas contra as arboviroses.`
            : `Você encontrou ${foundWords.length} de ${WORDS_TO_FIND.length} palavras. Estude os termos e tente novamente!`;

        return (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20 animate-fade-in p-4">
                <div className="bg-surface text-center p-8 rounded-xl shadow-2xl max-w-2xl w-full">
                    <h2 className="text-3xl font-bold text-primary mb-4">{title}</h2>
                    <p className="text-text-secondary mb-6">{message}</p>
                    <div className="flex gap-4 justify-center">
                        <button onClick={onBack} className="bg-slate-200 text-text-secondary font-bold py-3 px-6 rounded-lg hover:bg-slate-300 transition-colors">Sair</button>
                        <button onClick={resetGame} className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors">{gameState === 'intro' ? 'Começar' : 'Jogar Novamente'}</button>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="w-full flex-1 overflow-y-auto bg-slate-200 rounded-xl shadow-inner-light p-4 flex flex-col md:flex-row gap-6" onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
            {/* Game Grid */}
            <div className="flex-grow bg-surface rounded-lg shadow-md p-4 flex items-center justify-center">
                 <div className="grid select-none" style={{gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`}}>
                    {grid.map((row, rIndex) => 
                        row.map((letter, cIndex) => (
                            <div 
                                key={`${rIndex}-${cIndex}`}
                                onMouseDown={() => handleMouseDown(rIndex, cIndex)}
                                onMouseEnter={() => handleMouseEnter(rIndex, cIndex)}
                                className={`flex items-center justify-center aspect-square w-full font-bold text-sm md:text-base border border-slate-200 cursor-pointer transition-all duration-150 ${getCellClass(rIndex, cIndex)}`}
                            >
                                {letter}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Side Panel */}
            <div className="w-full md:w-80 lg:w-96 bg-surface rounded-lg shadow-md p-4 flex flex-col flex-shrink-0">
                <div className="flex justify-between items-center mb-4 border-b pb-3">
                    <h2 className="text-xl font-bold text-primary">Palavras</h2>
                    <div className="flex gap-4 text-white font-bold text-center">
                       <div className="bg-primary/80 px-3 py-1.5 rounded-lg shadow-md">
                           <div className="text-xs">Faltam</div>
                           <div>{WORDS_TO_FIND.length - foundWords.length}</div>
                       </div>
                       <div className="bg-red-500/80 px-3 py-1.5 rounded-lg shadow-md">
                           <div className="text-xs">Tempo</div>
                           <div>{Math.floor(timeLeft / 60)}:{('0' + (timeLeft % 60)).slice(-2)}</div>
                       </div>
                    </div>
                </div>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-2 overflow-y-auto pr-2">
                    {WORDS_TO_FIND.map(({ word, clue }) => {
                        const isFound = foundWords.some(fw => fw.word === word);
                        return (
                            <li key={word} title={clue} className={`text-sm md:text-base transition-all duration-300 ${isFound ? 'line-through text-slate-400 font-semibold' : 'text-text-primary font-medium'}`}>
                                {word}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

export default ArbovirusWordSearchGame;
