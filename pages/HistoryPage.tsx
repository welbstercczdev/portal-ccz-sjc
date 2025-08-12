import React from 'react';
import { AssessmentResult } from '../types';

interface HistoryPageProps {
  history: AssessmentResult[];
}

const getStatusStyle = (percentage: number) => {
    if (percentage >= 70) return 'border-green-500 bg-green-50 text-green-800';
    if (percentage >= 50) return 'border-amber-500 bg-amber-50 text-amber-800';
    return 'border-red-500 bg-red-50 text-red-800';
}

const HistoryCard: React.FC<{ result: AssessmentResult, index: number }> = ({ result, index }) => {
    const statusStyle = getStatusStyle(result.percentage);

    return (
        <div className={`bg-surface p-5 rounded-lg shadow-card border-l-4 ${statusStyle.split(' ')[0]} transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 animate-stagger-item-in`} style={{ animationDelay: `${index * 50}ms` }}>
            <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                <div>
                    <h3 className="text-lg font-bold text-text-primary">{result.quizTitle}</h3>
                    <p className="text-sm text-text-secondary mt-1">
                        Realizado em: {new Date(result.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </p>
                </div>
                <div className="text-left sm:text-right flex-shrink-0">
                    <p className={`text-2xl font-bold ${statusStyle.split(' ')[2]}`}>{result.percentage.toFixed(0)}%</p>
                    <p className="text-sm font-semibold text-text-secondary">{result.score} / {result.totalQuestions} acertos</p>
                </div>
            </div>
        </div>
    );
};

const HistoryPage: React.FC<HistoryPageProps> = ({ history }) => {
  const sortedHistory = [...history].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="max-w-4xl mx-auto">
        {sortedHistory.length === 0 ? (
            <div className="text-center p-12 bg-surface rounded-lg shadow-card animate-fade-in">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <h3 className="mt-4 text-xl font-semibold text-text-primary">Nenhum histórico encontrado</h3>
                <p className="mt-2 text-text-secondary">Você ainda não completou nenhuma avaliação. Acesse a página de avaliações para começar!</p>
            </div>
        ) : (
            <div className="space-y-4">
                {sortedHistory.map((result, index) => (
                    <HistoryCard key={result.id} result={result} index={index} />
                ))}
            </div>
        )}
    </div>
  );
};

export default HistoryPage;