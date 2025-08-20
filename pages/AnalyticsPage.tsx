import React, { useState, useMemo } from 'react';
import { Agent, AssessmentResult, Quiz, TrainingMaterial, Question, TrainingProgress } from '../types';

interface AnalyticsPageProps {
    assessments: Quiz[];
    agents: Agent[];
    history: AssessmentResult[];
    trainings: TrainingMaterial[];
}

const StatCard: React.FC<{ title: string; value: string; subtext?: string }> = ({ title, value, subtext }) => (
    <div className="bg-surface p-5 rounded-xl shadow-card border border-border-color animate-stagger-item-in">
        <p className="text-sm text-text-secondary">{title}</p>
        <p className="text-3xl font-bold text-primary mt-1">{value}</p>
        {subtext && <p className="text-xs text-text-secondary mt-1">{subtext}</p>}
    </div>
);

const BackButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <button onClick={onClick} className="mb-6 text-primary font-semibold hover:underline flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
        Voltar
    </button>
);

const getStatusStyle = (percentage: number) => {
    if (percentage >= 70) return 'text-green-600';
    if (percentage >= 50) return 'text-amber-600';
    return 'text-red-600';
}

const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>;

const AgentResultDetails: React.FC<{ result: AssessmentResult; quiz: Quiz; onBack: () => void }> = ({ result, quiz, onBack }) => {
    return (
        <div className="animate-fade-in">
            <BackButton onClick={onBack} />
            <div className="bg-surface p-6 rounded-xl shadow-card border border-border-color mb-6">
                <h2 className="text-2xl font-bold">{quiz.title}</h2>
                <p className="text-text-secondary mt-1">Resultado de <span className="font-semibold text-text-primary">{result.agentName}</span> em {new Date(result.date).toLocaleDateString('pt-BR')}</p>
                <div className="mt-4 flex items-baseline gap-4">
                    <p className={`text-4xl font-bold ${getStatusStyle(result.percentage)}`}>{result.percentage.toFixed(0)}%</p>
                    <p className="text-lg text-text-secondary font-semibold">{result.score} de {result.totalQuestions} acertos</p>
                </div>
            </div>

             <div className="bg-surface rounded-lg shadow-card p-6">
                <h3 className="text-xl font-bold text-text-primary mb-4">Revisão Detalhada</h3>
                <div className="space-y-4">
                    {quiz.questions.map((q, index) => {
                        const userAnswerIndex = result.userAnswers[q.id];
                        const isCorrect = userAnswerIndex === q.correctAnswerIndex;
                        return (
                            <div key={q.id} className={`p-4 rounded-lg border-l-4 ${isCorrect ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
                                <p className="font-semibold text-text-primary">{index + 1}. {q.text}</p>
                                <div className="mt-3 text-sm space-y-2">
                                    <p className={`flex items-start gap-2 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                                        <span className="mt-0.5">{isCorrect ? <CheckIcon /> : <XIcon />}</span>
                                        <span>Sua resposta: <span className="font-semibold">{userAnswerIndex !== null && userAnswerIndex !== undefined ? q.options[userAnswerIndex] : 'Não respondida'}</span></span>
                                    </p>
                                    {!isCorrect && (
                                        <p className="flex items-start gap-2 text-text-secondary">
                                            <span className="text-green-600 mt-0.5"><CheckIcon /></span>
                                            <span>Resposta correta: <span className="font-semibold text-text-primary">{q.options[q.correctAnswerIndex]}</span></span>
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};


const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ assessments, agents, history, trainings }) => {
    const [selectedItem, setSelectedItem] = useState<{ type: 'assessment' | 'agent', id: string } | null>(null);
    const [selectedResult, setSelectedResult] = useState<AssessmentResult | null>(null);

    const overallStats = useMemo(() => {
        if (history.length === 0) return { avgScore: 0, completions: 0 };
        const totalPercentage = history.reduce((acc, curr) => acc + curr.percentage, 0);
        return {
            avgScore: totalPercentage / history.length,
            completions: history.length,
        }
    }, [history]);
    
    const trainingStats = useMemo(() => {
        return trainings.map(training => {
            // CORREÇÃO APLICADA AQUI:
            const completions = Object.values(training.agentProgress || {}).filter(progress => progress && (progress as TrainingProgress).completed).length;
            const completionRate = agents.length > 0 ? (completions / agents.length) * 100 : 0;
            return {
                id: training.id,
                title: training.title,
                completions,
                completionRate,
            };
        });
    }, [trainings, agents]);

    const assessmentStats = useMemo(() => {
        return assessments.map(quiz => {
            const completions = history.filter(h => h.quizId === quiz.id);
            if (completions.length === 0) {
                return { id: quiz.id, title: quiz.title, completions: 0, avgScore: 0, passRate: 0 };
            }
            const avgScore = completions.reduce((acc, curr) => acc + curr.percentage, 0) / completions.length;
            const passRate = (completions.filter(c => c.percentage >= 70).length / completions.length) * 100;
            return { id: quiz.id, title: quiz.title, completions: completions.length, avgScore, passRate };
        });
    }, [assessments, history]);

    const agentStats = useMemo(() => {
        return agents.map(agent => {
            const completions = history.filter(h => h.agentId === agent.id);
            if (completions.length === 0) {
                return { id: agent.id, name: agent.name, email: agent.email, completions: 0, avgScore: 0 };
            }
            const avgScore = completions.reduce((acc, curr) => acc + curr.percentage, 0) / completions.length;
            return { id: agent.id, name: agent.name, email: agent.email, completions: completions.length, avgScore };
        });
    }, [agents, history]);

    const OverviewDashboard = () => (
        <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Agentes Ativos" value={agents.length.toString()} />
                <StatCard title="Módulos de Capacitação" value={trainings.length.toString()} />
                <StatCard title="Avaliações Concluídas" value={overallStats.completions.toString()} />
                <StatCard title="Média de Avaliações" value={`${overallStats.avgScore.toFixed(1)}%`} />
            </div>

            <div className="bg-surface rounded-lg shadow-card p-6">
                <h3 className="text-xl font-bold mb-4">Progresso por Capacitação</h3>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-border-color">
                            <tr>
                                <th className="p-3 font-semibold">Capacitação</th>
                                <th className="p-3 font-semibold text-center">Conclusões</th>
                                <th className="p-3 font-semibold text-center">Taxa de Conclusão</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trainingStats.map(stat => (
                                <tr key={stat.id} className="border-b border-border-color last:border-b-0">
                                    <td className="p-3 font-semibold text-text-primary">{stat.title}</td>
                                    <td className="p-3 text-center">{stat.completions} de {agents.length}</td>
                                    <td className="p-3 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-24 bg-slate-200 rounded-full h-2.5">
                                                <div className="bg-primary h-2.5 rounded-full" style={{width: `${stat.completionRate}%`}}></div>
                                            </div>
                                            <span className="font-semibold text-primary w-12 text-left">{stat.completionRate.toFixed(0)}%</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-surface rounded-lg shadow-card p-6">
                <h3 className="text-xl font-bold mb-4">Desempenho por Avaliação</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-border-color">
                            <tr>
                                <th className="p-3 font-semibold">Avaliação</th>
                                <th className="p-3 font-semibold text-center">Conclusões</th>
                                <th className="p-3 font-semibold text-center">Média</th>
                                <th className="p-3 font-semibold text-center">Taxa de Aprovação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assessmentStats.map(stat => (
                                <tr key={stat.id} onClick={() => setSelectedItem({ type: 'assessment', id: stat.id })} className="border-b border-border-color last:border-b-0 hover:bg-slate-50 cursor-pointer transition-colors">
                                    <td className="p-3 font-semibold text-primary">{stat.title}</td>
                                    <td className="p-3 text-center">{stat.completions}</td>
                                    <td className={`p-3 text-center font-bold ${getStatusStyle(stat.avgScore)}`}>{stat.avgScore.toFixed(1)}%</td>
                                    <td className={`p-3 text-center font-bold ${getStatusStyle(stat.passRate)}`}>{stat.passRate.toFixed(1)}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-surface rounded-lg shadow-card p-6">
                <h3 className="text-xl font-bold mb-4">Desempenho por Agente</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-border-color">
                            <tr>
                                <th className="p-3 font-semibold">Agente</th>
                                <th className="p-3 font-semibold text-center">Avaliações Concluídas</th>
                                <th className="p-3 font-semibold text-center">Média Geral</th>
                            </tr>
                        </thead>
                        <tbody>
                            {agentStats.map(stat => (
                                <tr key={stat.id} onClick={() => setSelectedItem({ type: 'agent', id: stat.id })} className="border-b border-border-color last:border-b-0 hover:bg-slate-50 cursor-pointer transition-colors">
                                    <td className="p-3 font-semibold text-primary">{stat.name}</td>
                                    <td className="p-3 text-center">{stat.completions}</td>
                                    <td className={`p-3 text-center font-bold ${getStatusStyle(stat.avgScore)}`}>{stat.avgScore.toFixed(1)}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const QuestionAnalysis: React.FC<{ question: Question, results: AssessmentResult[] }> = ({ question, results }) => {
        const questionStats = useMemo(() => {
            const totalAttempts = results.length;
            if (totalAttempts === 0) {
                return { correctPercentage: 0, optionPercentages: question.options.map(() => 0) };
            }
    
            let correctCount = 0;
            const answerCounts = Array(question.options.length).fill(0);
    
            results.forEach(result => {
                const answerIndex = result.userAnswers[question.id];
                if (answerIndex !== undefined && answerIndex !== null) {
                    if (answerIndex === question.correctAnswerIndex) {
                        correctCount++;
                    }
                    if (answerCounts[answerIndex] !== undefined) {
                        answerCounts[answerIndex]++;
                    }
                }
            });
    
            const correctPercentage = (correctCount / totalAttempts) * 100;
            const optionPercentages = answerCounts.map(count => (count / totalAttempts) * 100);
    
            return { correctPercentage, optionPercentages };
        }, [question, results]);
    
        return (
            <div className="p-4 bg-slate-50 rounded-lg border border-border-color">
                <p className="font-semibold">{question.text}</p>
                <p className="text-sm text-green-600 font-semibold my-2">{questionStats.correctPercentage.toFixed(1)}% de acerto</p>
                <div className="space-y-2 mt-2">
                    {question.options.map((opt, index) => (
                        <div key={index}>
                            <div className="flex justify-between text-sm mb-1">
                                <span className={`font-medium ${index === question.correctAnswerIndex ? 'text-green-700' : 'text-text-secondary'}`}>{opt}</span>
                                <span className={`font-semibold ${index === question.correctAnswerIndex ? 'text-green-700' : 'text-text-secondary'}`}>{questionStats.optionPercentages[index].toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2.5">
                                <div className={`h-2.5 rounded-full transition-all duration-500 ${index === question.correctAnswerIndex ? 'bg-green-500' : 'bg-slate-400'}`} style={{ width: `${questionStats.optionPercentages[index]}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const AssessmentReport = ({ quizId }: { quizId: string }) => {
        const quiz = assessments.find(q => q.id === quizId);
        const results = history.filter(h => h.quizId === quizId);
        const stats = assessmentStats.find(s => s.id === quizId);
        if (!quiz || !stats) return <p>Avaliação não encontrada.</p>;

        return (
            <div className="space-y-6 animate-fade-in">
                 <BackButton onClick={() => setSelectedItem(null)} />
                 <h2 className="text-2xl font-bold">{quiz.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard title="Conclusões" value={stats.completions.toString()} />
                    <StatCard title="Média de Acertos" value={`${stats.avgScore.toFixed(1)}%`} />
                    <StatCard title="Taxa de Aprovação" value={`${stats.passRate.toFixed(1)}%`} subtext="Pontuação >= 70%" />
                </div>
                
                <div className="bg-surface rounded-lg shadow-card p-6">
                    <h3 className="text-xl font-bold mb-4">Resultados por Agente</h3>
                     <div className="overflow-x-auto">
                        <table className="w-full text-left">
                           <thead className="bg-slate-50 border-b border-border-color">
                               <tr>
                                   <th className="p-3 font-semibold">Agente</th>
                                   <th className="p-3 font-semibold">Data</th>
                                   <th className="p-3 font-semibold text-center">Acertos</th>
                                   <th className="p-3 font-semibold text-center">Pontuação</th>
                               </tr>
                           </thead>
                           <tbody>
                               {results.map(r => (
                                   <tr key={r.id} className="border-b border-border-color last:border-b-0">
                                       <td className="p-3">{r.agentName}</td>
                                       <td className="p-3">{new Date(r.date).toLocaleDateString('pt-BR')}</td>
                                       <td className="p-3 text-center">{r.score}/{r.totalQuestions}</td>
                                       <td className={`p-3 text-center font-bold ${getStatusStyle(r.percentage)}`}>{r.percentage.toFixed(1)}%</td>
                                   </tr>
                               ))}
                           </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-surface rounded-lg shadow-card p-6">
                    <h3 className="text-xl font-bold mb-4">Análise por Questão</h3>
                    <div className="space-y-4">
                        {quiz.questions.map(q => <QuestionAnalysis key={q.id} question={q} results={results} />)}
                    </div>
                </div>
            </div>
        );
    };
    
    const AgentReport = ({ agentId }: { agentId: string }) => {
        const agent = agentStats.find(a => a.id === agentId);
        const agentHistory = history.filter(h => h.agentId === agentId).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        if (!agent) return <p>Agente não encontrado.</p>;
    
        return (
            <div className="space-y-6 animate-fade-in">
                <BackButton onClick={() => setSelectedItem(null)} />
                <h2 className="text-2xl font-bold">{agent.name} <span className="text-lg font-medium text-text-secondary">({agent.email})</span></h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StatCard title="Avaliações Concluídas" value={agent.completions.toString()} />
                    <StatCard title="Média Geral nas Avaliações" value={`${agent.avgScore.toFixed(1)}%`} />
                </div>
                
                <div className="bg-surface rounded-lg shadow-card p-6">
                    <h3 className="text-xl font-bold mb-4">Histórico de Avaliações</h3>
                     <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-border-color">
                               <tr>
                                   <th className="p-3 font-semibold">Avaliação</th>
                                   <th className="p-3 font-semibold">Data</th>
                                   <th className="p-3 font-semibold text-center">Pontuação</th>
                                   <th className="p-3 font-semibold text-center">Ações</th>
                               </tr>
                           </thead>
                           <tbody>
                               {agentHistory.map(r => (
                                   <tr key={r.id} className="border-b border-border-color last:border-b-0">
                                       <td className="p-3">{r.quizTitle}</td>
                                       <td className="p-3">{new Date(r.date).toLocaleDateString('pt-BR')}</td>
                                       <td className={`p-3 text-center font-bold ${getStatusStyle(r.percentage)}`}>{r.percentage.toFixed(1)}%</td>
                                       <td className="p-3 text-center">
                                           <button onClick={() => setSelectedResult(r)} className="font-semibold text-primary hover:underline">Ver Detalhes</button>
                                       </td>
                                   </tr>
                               ))}
                           </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-surface rounded-lg shadow-card p-6">
                    <h3 className="text-xl font-bold mb-4">Status de Capacitação</h3>
                    <ul className="space-y-2">
                        {trainings.map(t => {
                             const agentProgress = t.agentProgress[agentId];
                             const isCompleted = agentProgress?.completed;
                             const progress = agentProgress?.progress || 0;
                             
                             let statusLabel = "Não Iniciado";
                             let statusStyle = "text-slate-700 bg-slate-100";
                             if (isCompleted) {
                                 statusLabel = "Concluído";
                                 statusStyle = "text-green-700 bg-green-100";
                             } else if (progress > 0) {
                                 statusLabel = `Em Andamento (${progress}%)`;
                                 statusStyle = "text-amber-700 bg-amber-100";
                             }
                            return (
                                <li key={t.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-md">
                                    <span className="font-medium text-text-primary">{t.title}</span>
                                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusStyle}`}>{statusLabel}</span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        );
    }

    if (selectedResult) {
        const quiz = assessments.find(q => q.id === selectedResult.quizId);
        if (!quiz) {
            return <p>Ocorreu um erro: a avaliação para este resultado não foi encontrada.</p>;
        }
        return <AgentResultDetails result={selectedResult} quiz={quiz} onBack={() => setSelectedResult(null)} />;
    }

    if (selectedItem) {
        if (selectedItem.type === 'assessment') {
            return <AssessmentReport quizId={selectedItem.id} />;
        }
        if (selectedItem.type === 'agent') {
            return <AgentReport agentId={selectedItem.id} />;
        }
    }

    return <OverviewDashboard />;
};

export default AnalyticsPage;