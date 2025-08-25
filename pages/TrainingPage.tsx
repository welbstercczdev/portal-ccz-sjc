import React, { useState, useEffect } from 'react';
import { TrainingMaterial, TrainingStep } from '../types';

interface TrainingPageProps {
  materials: TrainingMaterial[];
  onUpdateProgress: (trainingId: number, currentStepIndex: number) => void;
  loggedInAgentId: string;
}

// --- Componente Executor do Treinamento ---
const TrainingRunner: React.FC<{
  material: TrainingMaterial;
  onExit: () => void;
  onUpdateProgress: (trainingId: number, currentStepIndex: number) => void;
  initialStep: number;
}> = ({ material, onExit, onUpdateProgress, initialStep }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(initialStep);
  const [quizAnswer, setQuizAnswer] = useState<{ selected: number | null, isCorrect: boolean | null }>({ selected: null, isCorrect: null });

  const currentStep = material.steps[currentStepIndex];
  const totalSteps = material.steps.length;

  useEffect(() => {
    onUpdateProgress(material.id, currentStepIndex);
  }, [material.id, currentStepIndex, onUpdateProgress]);

  const handleNext = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setQuizAnswer({ selected: null, isCorrect: null });
    } else {
        onExit();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      setQuizAnswer({ selected: null, isCorrect: null });
    }
  };

  const handleQuizSubmit = (selectedIndex: number) => {
    if (quizAnswer.isCorrect) return;
    const correct = currentStep.question!.correctAnswerIndex === selectedIndex;
    setQuizAnswer({ selected: selectedIndex, isCorrect: correct });
  };

  return (
    <div className="bg-surface p-6 sm:p-8 rounded-xl shadow-card max-w-4xl mx-auto animate-fade-in">
      {/* Cabeçalho do Módulo */}
      <div className="border-b border-border-color pb-4 mb-6">
        <button onClick={onExit} className="text-sm text-primary font-semibold hover:underline mb-2">&larr; Voltar para todos os módulos</button>
        <h2 className="text-2xl font-bold text-primary">{material.title}</h2>
        <p className="text-text-secondary mt-1">{currentStep.title}</p>
        <div className="w-full bg-slate-200 rounded-full h-2.5 mt-4">
            <div className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${((currentStepIndex + 1) / totalSteps) * 100}%` }}></div>
        </div>
      </div>

      {/* Conteúdo do Passo */}
      <div className="min-h-[300px]">
        {(currentStep.imageUrl || currentStep.videoUrl) && (
            <div className="mb-6 rounded-lg overflow-hidden bg-slate-100 border border-border-color max-h-96 flex justify-center">
                {currentStep.videoUrl ? <video src={currentStep.videoUrl} controls className="w-full h-auto object-contain" />
                : currentStep.imageUrl && <img src={currentStep.imageUrl} alt={currentStep.title} className="w-auto h-auto object-contain max-h-96" />}
            </div>
        )}
        <p className="text-text-primary leading-relaxed whitespace-pre-wrap mb-6">{currentStep.content}</p>

        {currentStep.type === 'quiz' && currentStep.question && (
          <div className="mt-6 p-4 border-t border-dashed">
              <p className="text-lg font-semibold text-text-primary mb-4">{currentStep.question.text}</p>
              <div className="space-y-3">
                  {currentStep.question.options.map((option, index) => {
                      const isSelected = quizAnswer.selected === index;
                      let optionClass = 'border-border-color bg-white hover:bg-slate-50';
                      if (isSelected) {
                          optionClass = quizAnswer.isCorrect ? 'border-green-500 bg-green-100' : 'border-red-500 bg-red-100';
                      }
                      
                      return (
                          <button key={index} onClick={() => handleQuizSubmit(index)} disabled={quizAnswer.isCorrect !== null}
                              className={`w-full text-left p-4 rounded-lg border-2 transition-colors flex items-center ${optionClass}`}>
                              <span className={`w-6 h-6 rounded-full border-2 flex-shrink-0 mr-4 flex items-center justify-center ${isSelected ? (quizAnswer.isCorrect ? 'border-green-600 bg-green-600' : 'border-red-600 bg-red-600') : 'border-slate-300'}`}>
                                  {isSelected && <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                              </span>
                              {option}
                          </button>
                      )
                  })}
              </div>
              {quizAnswer.isCorrect === false && <p className="text-red-600 font-semibold mt-4">Resposta incorreta. Tente novamente!</p>}
              {quizAnswer.isCorrect === true && <p className="text-green-600 font-semibold mt-4">Resposta correta! Você pode avançar.</p>}
          </div>
        )}
      </div>

      {/* Navegação */}
      <div className="flex justify-between items-center mt-8 pt-4 border-t border-border-color">
          <button onClick={handlePrev} disabled={currentStepIndex === 0}
              className="bg-slate-200 text-text-secondary font-bold py-2 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-300 transition-colors">
              Anterior
          </button>
          <span className="text-sm text-text-secondary">Passo {currentStepIndex + 1} de {totalSteps}</span>
          <button onClick={handleNext} disabled={currentStep.type === 'quiz' && !quizAnswer.isCorrect}
              className="bg-primary text-white font-bold py-2 px-6 rounded-lg disabled:bg-slate-400 disabled:cursor-not-allowed hover:bg-primary-dark transition-colors">
              {currentStepIndex < totalSteps - 1 ? 'Próximo' : 'Concluir'}
          </button>
      </div>
    </div>
  );
};


// --- Componente da Lista de Módulos ---
const TrainingList: React.FC<{ materials: TrainingMaterial[]; onStart: (material: TrainingMaterial) => void; loggedInAgentId: string; }> = ({ materials, onStart, loggedInAgentId }) => {
    // Filtra os materiais para mostrar apenas os visíveis para o agente
    const visibleMaterials = materials.filter(m => m.isVisible);

    const agentProgressData = visibleMaterials.map(m => m.agentProgress[loggedInAgentId] || { progress: 0, completed: false });
    const completedCount = agentProgressData.filter(p => p.completed).length;
    const totalCount = visibleMaterials.length;
    const overallProgress = totalCount > 0 ? (agentProgressData.reduce((sum, p) => sum + p.progress, 0) / totalCount) : 0;
    
    return(
        <div>
            <div className="bg-surface p-6 rounded-xl shadow-card border border-border-color mb-8 animate-fade-in">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-bold text-text-primary">Seu Progresso de Capacitação</h2>
                    <span className="text-2xl font-bold text-primary">{overallProgress.toFixed(0)}%</span>
                </div>
                <p className="text-text-secondary mb-4">Você concluiu <span className="font-semibold text-text-primary">{completedCount} de {totalCount}</span> módulos disponíveis. Continue assim!</p>
                <div className="w-full bg-slate-200 rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full transition-all duration-1000 ease-out" style={{ width: `${overallProgress}%` }}></div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {/* CORREÇÃO APLICADA AQUI: iterando sobre 'visibleMaterials' em vez de 'materials' */}
                {visibleMaterials.map((material, index) => {
                    const agentProgress = material.agentProgress[loggedInAgentId] || { progress: 0, completed: false };
                    return (
                        <div key={material.id} className="bg-surface rounded-xl shadow-card transition-all duration-300 flex flex-col hover:shadow-card-hover hover:-translate-y-1 animate-stagger-item-in" style={{ animationDelay: `${index * 75}ms` }}>
                            <div className="p-6 flex-grow flex flex-col">
                                <h3 className="text-xl font-bold text-text-primary">{material.title}</h3>
                                <p className="text-text-secondary my-2 flex-grow">{material.description}</p>
                                <div className="w-full bg-slate-200 rounded-full h-2 my-3">
                                    <div className="bg-primary h-2 rounded-full" style={{ width: `${agentProgress.progress}%` }}></div>
                                </div>
                            </div>
                            <div className="p-6 pt-0 border-t border-border-color">
                                <button onClick={() => onStart(material)} className="w-full bg-primary text-white font-bold py-3 px-5 rounded-lg transition-colors hover:bg-primary-dark disabled:bg-slate-400">
                                    {agentProgress.completed ? 'Revisar' : agentProgress.progress > 0 ? 'Continuar' : 'Iniciar'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


// --- Componente Principal da Página ---
const TrainingPage: React.FC<TrainingPageProps> = ({ materials, onUpdateProgress, loggedInAgentId }) => {
  const [activeTraining, setActiveTraining] = useState<TrainingMaterial | null>(null);

  if (activeTraining) {
      const agentProgress = activeTraining.agentProgress[loggedInAgentId];
      // Se houver progresso e não estiver completo, começa da última etapa. Senão, do início.
      const initialStep = (agentProgress && !agentProgress.completed) ? agentProgress.currentStep : 0;
      
      return <TrainingRunner 
                material={activeTraining} 
                onExit={() => setActiveTraining(null)} 
                onUpdateProgress={onUpdateProgress} 
                initialStep={initialStep}
             />;
  }

  return <TrainingList materials={materials} onStart={setActiveTraining} loggedInAgentId={loggedInAgentId} />;
};

export default TrainingPage;