import React, { useState, useMemo } from 'react';
import { Agent, AssessmentResult, Quiz } from '../types';

interface RankingPageProps {
  agents: Agent[];
  history: AssessmentResult[];
  assessments: Quiz[];
  loggedInAgentId: string;
}

type RankingMode = 'general' | 'assessment';

// Tipos de dados para o ranking
interface GeneralRankingItem {
    agentId: string;
    agentName: string;
    avgScore: number;
    avgDuration: number;
    completions: number;
}
interface AssessmentRankingItem extends AssessmentResult {}

// Função para formatar a duração em minutos e segundos
const formatDuration = (seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
};

// Função para obter o ícone de medalha
const getMedal = (rank: number) => {
    if (rank === 0) return '🥇';
    if (rank === 1) return '🥈';
    if (rank === 2) return '🥉';
    return null;
};

// Componente para renderizar uma única linha do ranking
const RankingRow: React.FC<{ item: any; index: number; isUser: boolean; mode: RankingMode }> = ({ item, index, isUser, mode }) => (
    <tr className={`border-t border-border-color transition-colors ${isUser ? 'bg-primary-light ring-2 ring-primary' : 'hover:bg-slate-50'}`}>
        <td className="p-4 text-center">
            <span className={`font-bold text-lg ${isUser ? 'text-primary' : 'text-text-primary'}`}>{index + 1}</span>
            <span className="text-xl ml-1">{getMedal(index)}</span>
        </td>
        <td className="p-4 font-semibold text-text-primary">{item.agentName}{isUser && <span className="text-xs text-primary font-bold ml-2">(Você)</span>}</td>
        {mode === 'general' ? (
            <>
                <td className="p-4 text-center text-text-secondary font-medium">{(item as GeneralRankingItem).completions}</td>
                <td className="p-4 text-center font-bold text-lg text-primary">{(item as GeneralRankingItem).avgScore.toFixed(1)}%</td>
                <td className="p-4 text-center text-text-secondary font-medium">{formatDuration((item as GeneralRankingItem).avgDuration)}</td>
            </>
        ) : (
            <>
                <td className="p-4 text-center text-text-secondary font-medium">{(item as AssessmentRankingItem).score}/{(item as AssessmentRankingItem).totalQuestions}</td>
                <td className="p-4 text-center font-bold text-lg text-primary">{(item as AssessmentRankingItem).percentage.toFixed(1)}%</td>
                <td className="p-4 text-center text-text-secondary font-medium">{formatDuration((item as AssessmentRankingItem).duration)}</td>
            </>
        )}
    </tr>
);


const RankingPage: React.FC<RankingPageProps> = ({ agents, history, assessments, loggedInAgentId }) => {
    const [mode, setMode] = useState<RankingMode>('general');
    const [selectedQuizId, setSelectedQuizId] = useState<string>(assessments[0]?.id || '');

    const visibleAssessments = useMemo(() => assessments.filter(q => q.isVisible), [assessments]);

    // --- Lógica de cálculo do ranking (permanece a mesma) ---
    const generalRanking = useMemo((): GeneralRankingItem[] => {
        const agentStats = (agents || []).map(agent => {
            const agentHistory = (history || []).filter(h => h.agentId === agent.id);
            if (agentHistory.length === 0) return null;
            const totalScore = agentHistory.reduce((acc, curr) => acc + curr.percentage, 0);
            const totalDuration = agentHistory.reduce((acc, curr) => acc + curr.duration, 0);
            return {
                agentId: agent.id,
                agentName: agent.name,
                avgScore: totalScore / agentHistory.length,
                avgDuration: totalDuration / agentHistory.length,
                completions: agentHistory.length,
            };
        }).filter((a): a is GeneralRankingItem => a !== null);
        return agentStats.sort((a, b) => b.avgScore - a.avgScore || a.avgDuration - b.avgDuration);
    }, [agents, history]);

    const assessmentRanking = useMemo((): AssessmentRankingItem[] => {
        if (!selectedQuizId) return [];
        const quizHistory = (history || []).filter(h => h.quizId === selectedQuizId);
        const bestAttempts = new Map<string, AssessmentRankingItem>();
        quizHistory.forEach(result => {
            const existing = bestAttempts.get(result.agentId);
            if (!existing || result.score > existing.score || (result.score === existing.score && result.duration < existing.duration)) {
                bestAttempts.set(result.agentId, result);
            }
        });
        const rankedList = Array.from(bestAttempts.values());
        return rankedList.sort((a, b) => b.score - a.score || a.duration - b.duration);
    }, [history, selectedQuizId]);
    
    // --- Lógica de filtragem e exibição ---
    const currentRankingData = mode === 'general' ? generalRanking : assessmentRanking;
    const topThree = currentRankingData.slice(0, 3);
    const userRankInfo = currentRankingData.map((item, index) => ({ item, index })).find(data => data.item.agentId === loggedInAgentId);
    const isUserInTopThree = userRankInfo ? userRankInfo.index < 3 : false;

    return (
        <div className="space-y-6">
            {/* --- Seletor de Modo (permanece o mesmo) --- */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div className="inline-flex rounded-lg shadow-sm bg-surface p-1 border border-border-color">
                    <button onClick={() => setMode('general')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${mode === 'general' ? 'bg-primary text-white' : 'text-text-secondary hover:bg-slate-100'}`}>
                        Ranking Geral
                    </button>
                    <button onClick={() => setMode('assessment')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${mode === 'assessment' ? 'bg-primary text-white' : 'text-text-secondary hover:bg-slate-100'}`}>
                        Por Avaliação
                    </button>
                </div>
                {mode === 'assessment' && (
                     <div className="w-full md:w-auto">
                        <select
                            value={selectedQuizId}
                            onChange={(e) => setSelectedQuizId(e.target.value)}
                            className="w-full md:w-72 p-2.5 border border-border-color rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent transition bg-surface"
                            aria-label="Selecionar avaliação"
                        >
                            {visibleAssessments.map(quiz => (
                                <option key={quiz.id} value={quiz.id}>{quiz.title}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
            
            <div className="bg-surface rounded-xl shadow-card border border-border-color overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-border-color">
                    <h3 className="text-lg font-bold text-text-primary">
                        {mode === 'general' ? 'Classificação Geral de Agentes' : `Melhores Tentativas: ${assessments.find(q => q.id === selectedQuizId)?.title}`}
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white">
                            <tr>
                                <th className="p-4 font-semibold text-sm text-text-secondary w-16 text-center">Pos.</th>
                                <th className="p-4 font-semibold text-sm text-text-secondary">Agente</th>
                                <th className="p-4 font-semibold text-sm text-text-secondary text-center">{mode === 'general' ? 'Avaliações' : 'Acertos'}</th>
                                <th className="p-4 font-semibold text-sm text-text-secondary text-center">{mode === 'general' ? 'Média Geral' : 'Pontuação'}</th>
                                <th className="p-4 font-semibold text-sm text-text-secondary text-center">{mode === 'general' ? 'Tempo Médio' : 'Tempo'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Renderiza o pódio (Top 3) */}
                            {topThree.map((item, index) => (
                                <RankingRow
                                    key={item.agentId}
                                    item={item}
                                    index={index}
                                    isUser={item.agentId === loggedInAgentId}
                                    mode={mode}
                                />
                            ))}

                            {/* Se o usuário não está no pódio, mostra sua posição separadamente */}
                            {!isUserInTopThree && userRankInfo && (
                                <>
                                    {/* Linha de separação visual */}
                                    <tr className="bg-slate-100">
                                        <td colSpan={5} className="py-2 text-center text-xs font-semibold text-text-secondary">...</td>
                                    </tr>
                                    <RankingRow
                                        key={userRankInfo.item.agentId}
                                        item={userRankInfo.item}
                                        index={userRankInfo.index}
                                        isUser={true}
                                        mode={mode}
                                    />
                                </>
                            )}
                            
                            {currentRankingData.length === 0 && (
                                <tr className="border-t border-border-color">
                                    <td colSpan={5} className="text-center p-12 text-text-secondary">
                                        Nenhum dado de ranking disponível para esta seleção.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default RankingPage;