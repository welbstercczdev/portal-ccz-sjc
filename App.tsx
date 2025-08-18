import React, { useState, useEffect } from 'react';
import { Page, TrainingMaterial, NormDocument, Quiz, AssessmentResult, Agent } from './types';
import * as api from './services/api'; 
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import TrainingPage from './pages/TrainingPage';
import AssessmentPage from './pages/AssessmentPage';
import NormsPage from './pages/NormsPage';
import AdminPage from './pages/AdminPage';
import HistoryPage from './pages/HistoryPage';
import RankingPage from './pages/RankingPage';
import GamesPage from './pages/GamesPage';
import ChangePasswordModal from './components/ChangePasswordModal'; // 1. Importe o novo modal

interface AppProps {
  loggedInAgent: Agent;
  onLogout: () => void;
}

const App: React.FC<AppProps> = ({ loggedInAgent, onLogout }) => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  
  // Estados de Dados
  const [trainingData, setTrainingData] = useState<TrainingMaterial[]>([]);
  const [normsData, setNormsData] = useState<NormDocument[]>([]);
  const [assessmentsData, setAssessmentsData] = useState<Quiz[]>([]);
  const [assessmentHistory, setAssessmentHistory] = useState<AssessmentResult[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);

  // Estados de Controle da UI
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isChangePasswordModalOpen, setChangePasswordModalOpen] = useState(false); // 2. Adicione o estado para o modal

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        if (!loggedInAgent.id) {
          throw new Error("Agente não está logado.");
        }
        
        let data;
        if (currentPage === Page.Admin && loggedInAgent.role === 'gestor') {
            data = await api.getAllDataForAdmin();
        } else {
            data = await api.getInitialDataForAgent(loggedInAgent.id);
        }

        setAgents(data.agents || []);
        setTrainingData(data.trainings || []);
        setNormsData(data.norms || []);
        setAssessmentHistory(data.history || []);
        
        const parsedAssessments = (data.assessments || []).map(a => ({
          ...a,
          questions: typeof a.questions_json === 'string' 
            ? JSON.parse(a.questions_json) 
            : (a.questions || [])
        }));
        setAssessmentsData(parsedAssessments);

      } catch (err) {
        setError(err instanceof Error ? err.message : "Ocorreu um erro desconhecido.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentPage, loggedInAgent.id]);

  // --- Handlers para Agente ---
  const handleToggleTrainingCompletion = async (id: string) => {
    const material = trainingData.find(t => t.id === id);
    if (!material) return;
    const newCompletedStatus = !material.completed;
    setTrainingData(prev => prev.map(t => (t.id === id ? { ...t, completed: newCompletedStatus } : t)));
    try {
      await api.setTrainingProgress(loggedInAgent.id, id, newCompletedStatus);
    } catch (err) {
      alert("Não foi possível salvar o progresso. Tente novamente.");
      setTrainingData(prev => prev.map(t => (t.id === id ? { ...t, completed: !newCompletedStatus } : t)));
    }
  };

  const handleAddAssessmentResult = async (resultData: Omit<AssessmentResult, 'id' | 'date' | 'agentId' | 'agentName'>) => {
    const newResult: AssessmentResult = {
      ...resultData,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      agentId: loggedInAgent.id,
      agentName: loggedInAgent.name,
    };
    setAssessmentHistory(prev => [newResult, ...prev]);
    try {
      await api.saveAssessmentResult(newResult);
    } catch (err) {
      alert("Falha ao salvar o resultado da avaliação.");
      setAssessmentHistory(prev => prev.filter(r => r.id !== newResult.id));
    }
  };

  // 3. Adicione o handler para alterar a senha
  const handleChangePassword = async (oldPassword: string, newPassword: string) => {
    return await api.changePassword(loggedInAgent.id, oldPassword, newPassword);
  };

  // --- Handlers para Admin ---
  const handleSaveTraining = async (training: TrainingMaterial) => {
    try {
      const { record: savedRecord } = await api.saveTraining(training);
      setTrainingData(prev => {
        const exists = prev.some(t => t.id === savedRecord.id);
        if (exists) return prev.map(t => (t.id === savedRecord.id ? savedRecord : t));
        return [...prev, savedRecord];
      });
    } catch (error) { alert("Falha ao salvar o treinamento."); }
  };
  const handleDeleteTraining = async (id: string) => {
    try {
      await api.deleteTraining(id);
      setTrainingData(prev => prev.filter(t => t.id !== id));
    } catch (error) { alert("Falha ao deletar o treinamento."); }
  };

  const handleSaveNorm = async (norm: NormDocument) => {
    try {
      const { record: savedRecord } = await api.saveNorm(norm);
      setNormsData(prev => {
        const exists = prev.some(n => n.id === savedRecord.id);
        if (exists) return prev.map(n => (n.id === savedRecord.id ? savedRecord : n));
        return [...prev, savedRecord];
      });
    } catch (error) { alert("Falha ao salvar a norma."); }
  };
  const handleDeleteNorm = async (id: string) => {
    try {
      await api.deleteNorm(id);
      setNormsData(prev => prev.filter(n => n.id !== id));
    } catch (error) { alert("Falha ao deletar a norma."); }
  };

  const handleSaveAssessment = async (quiz: Quiz) => {
    const quizToSend = { ...quiz, questions_json: JSON.stringify(quiz.questions) };
    delete (quizToSend as any).questions;
    try {
      const { record: savedRecord } = await api.saveAssessment(quizToSend as any);
      const receivedQuiz = { ...savedRecord, questions: JSON.parse(savedRecord.questions_json || '[]') };
      delete receivedQuiz.questions_json;
      setAssessmentsData(prev => {
        const exists = prev.some(q => q.id === receivedQuiz.id);
        if (exists) return prev.map(q => (q.id === receivedQuiz.id ? receivedQuiz : q));
        return [...prev, receivedQuiz];
      });
    } catch (error) { alert("Falha ao salvar a avaliação."); }
  };
  const handleDeleteAssessment = async (id: string) => {
    try {
      await api.deleteAssessment(id);
      setAssessmentsData(prev => prev.filter(q => q.id !== id));
    } catch (error) { alert("Falha ao deletar a avaliação."); }
  };

  const handleSaveAgent = async (agent: Agent) => {
    try {
      const { record: savedRecord } = await api.saveAgent(agent);
      setAgents(prev => {
        const exists = prev.some(a => a.id === savedRecord.id);
        if (exists) return prev.map(a => (a.id === savedRecord.id ? savedRecord : a));
        return [...prev, savedRecord];
      });
    } catch (error) { alert("Falha ao salvar o agente."); }
  };
  const handleDeleteAgent = async (id: string) => {
    if (id === loggedInAgent.id) {
      alert("Você não pode excluir seu próprio usuário.");
      return;
    }
    try {
      await api.deleteAgent(id);
      setAgents(prev => prev.filter(a => a.id !== id));
    } catch (error) { alert("Falha ao deletar o agente."); }
  };

  const handleSetPage = (page: Page) => {
    if (page === Page.Admin && loggedInAgent.role !== 'gestor') {
      setCurrentPage(Page.Home); 
      return;
    }
    setCurrentPage(page);
  };

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Carregando dados...</div>;
  }
  if (error) {
    return <div className="flex h-screen items-center justify-center text-red-500">Erro: {error}</div>;
  }

  const renderPage = () => {
    switch (currentPage) {
      case Page.Home: return <HomePage setActivePage={handleSetPage} />;
      case Page.Jogos: return <GamesPage />;
      case Page.Training: return <TrainingPage materials={trainingData} onToggleCompletion={handleToggleTrainingCompletion} />;
      case Page.Assessments: return <AssessmentPage assessments={assessmentsData} onAddResult={handleAddAssessmentResult} />;
      case Page.Norms: return <NormsPage norms={normsData} />;
      case Page.History: 
        const personalHistory = assessmentHistory.filter(h => h.agentId === loggedInAgent.id);
        return <HistoryPage history={personalHistory} />;
      case Page.Ranking: return <RankingPage agents={agents} history={assessmentHistory} assessments={assessmentsData} loggedInAgentId={loggedInAgent.id} />;
      case Page.Admin:
        return loggedInAgent.role === 'gestor' ? (
            <AdminPage 
                trainings={trainingData}
                norms={normsData}
                assessments={assessmentsData}
                agents={agents}
                assessmentHistory={assessmentHistory}
                onSaveTraining={handleSaveTraining}
                onDeleteTraining={handleDeleteTraining}
                onSaveNorm={handleSaveNorm}
                onDeleteNorm={handleDeleteNorm}
                onSaveAssessment={handleSaveAssessment}
                onDeleteAssessment={handleDeleteAssessment}
                onSaveAgent={handleSaveAgent}
                onDeleteAgent={handleDeleteAgent}
                loggedInAgentId={loggedInAgent.id}
            />
        ) : <HomePage setActivePage={handleSetPage} />;
      default: return <HomePage setActivePage={handleSetPage} />;
    }
  };

  return (
    <div className="flex h-screen font-sans bg-background text-text-primary">
      <Sidebar 
         currentPage={currentPage} 
         setCurrentPage={handleSetPage} 
         agent={loggedInAgent}
         onLogout={onLogout}
         onOpenChangePassword={() => setChangePasswordModalOpen(true)} // 4. Passe a função para a Sidebar
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6 md:px-8 py-4">
            <Header title={currentPage} />
        </div>
        <main className="flex-1 overflow-x-hidden overflow-y-auto px-6 md:px-8 pb-8">
          <div key={currentPage} className="animate-fade-in h-full flex flex-col">
            {renderPage()}
          </div>
        </main>
      </div>
      
      {/* 5. Renderize o modal aqui */}
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setChangePasswordModalOpen(false)}
        onSave={handleChangePassword}
      />
    </div>
  );
};

export default App;