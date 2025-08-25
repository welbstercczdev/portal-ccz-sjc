import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast'; 
import { Page, TrainingMaterial, NormDocument, Quiz, AssessmentResult, Agent } from './types';
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
import LoginPage from './pages/LoginPage';
import LoadingScreen from './components/LoadingScreen'; 

// CORREÇÃO APLICADA AQUI: Importa TODAS as funções necessárias do apiService
import {
  getTrainings, getNorms, getAssessments, getAssessmentHistory, getAgents,
  getLoggedInUser, login, logout,
  saveTraining, deleteTraining, updateTrainingProgress,
  saveNorm, deleteNorm,
  saveAssessment, deleteAssessment, addAssessmentResult,
  saveAgent, deleteAgent
} from './services/apiService';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState<Agent | null>(null);

  // Data states
  const [trainingData, setTrainingData] = useState<TrainingMaterial[]>([]);
  const [normsData, setNormsData] = useState<NormDocument[]>([]);
  const [assessmentsData, setAssessmentsData] = useState<Quiz[]>([]);
  const [assessmentHistory, setAssessmentHistory] = useState<AssessmentResult[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
    const user = getLoggedInUser();
    if (user) {
      setLoggedInUser(user);
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      if (!loggedInUser) {
        setTrainingData([]);
        setNormsData([]);
        setAssessmentsData([]);
        setAssessmentHistory([]);
        setAgents([]);
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const [
          trainings,
          norms,
          assessments,
          history,
          agentsData
        ] = await Promise.all([
          getTrainings(),
          getNorms(),
          getAssessments(),
          getAssessmentHistory(),
          loggedInUser.role === 'gestor' ? getAgents() : Promise.resolve([loggedInUser])
        ]);

        setTrainingData(trainings);
        setNormsData(norms);
        setAssessmentsData(assessments);
        setAssessmentHistory(history);
        setAgents(agentsData);

      } catch (error) {
        console.error("Falha ao buscar dados da aplicação:", error);
        handleLogout();
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [loggedInUser]);

  const handleLogout = () => {
    logout();
    setLoggedInUser(null);
    setCurrentPage(Page.Home);
    setIsAdminMode(false);
  };

  // --- Handlers ---
// --- Handlers ---
const handleSaveTraining = async (training: TrainingMaterial) => {
  try {
    await saveTraining(training);
    setTrainingData(await getTrainings());
    toast.success('Capacitação salva com sucesso!');
  } catch (error: any) {
    console.error("Falha ao salvar capacitação:", error);
    toast.error(error.message || 'Falha ao salvar a capacitação.');
  }
};

const handleDeleteTraining = async (id: number) => {
  try {
    await deleteTraining(id);
    setTrainingData(prev => prev.filter(t => t.id !== id));
    toast.success('Capacitação excluída com sucesso!');
  } catch (error: any) {
    console.error("Falha ao deletar capacitação:", error);
    toast.error(error.message || 'Falha ao excluir a capacitação.');
  }
};

const handleUpdateTrainingProgress = async (trainingId: number, currentStepIndex: number) => {
  try {
    await updateTrainingProgress(trainingId, currentStepIndex);
    setTrainingData(await getTrainings()); 
    // Não mostramos toast aqui para não poluir a tela durante o treinamento
  } catch (error: any) {
    console.error("Falha ao atualizar progresso:", error);
    toast.error(error.message || 'Falha ao salvar seu progresso.');
  }
};

const handleSaveNorm = async (norm: NormDocument) => {
  try {
    await saveNorm(norm);
    setNormsData(await getNorms());
    toast.success('Norma técnica salva com sucesso!');
  } catch (error: any) {
    console.error("Falha ao salvar norma:", error);
    toast.error(error.message || 'Falha ao salvar a norma.');
  }
};

const handleDeleteNorm = async (id: number) => {
  try {
    await deleteNorm(id);
    setNormsData(prev => prev.filter(n => n.id !== id));
    toast.success('Norma técnica excluída com sucesso!');
  } catch (error: any) {
    console.error("Falha ao deletar norma:", error);
    toast.error(error.message || 'Falha ao excluir a norma.');
  }
};

const handleSaveAssessment = async (quiz: Quiz) => {
  try {
    await saveAssessment(quiz);
    setAssessmentsData(await getAssessments());
    toast.success('Avaliação salva com sucesso!');
  } catch (error: any) {
    console.error("Falha ao salvar avaliação:", error);
    toast.error(error.message || 'Falha ao salvar a avaliação.');
  }
};

const handleDeleteAssessment = async (id: string) => {
  try {
    await deleteAssessment(id);
    setAssessmentsData(prev => prev.filter(q => q.id !== id));
    toast.success('Avaliação excluída com sucesso!');
  } catch (error: any) {
    console.error("Falha ao deletar avaliação:", error);
    toast.error(error.message || 'Falha ao excluir a avaliação.');
  }
};

const handleAddAssessmentResult = async (resultData: Omit<AssessmentResult, 'id' | 'date' | 'agentId' | 'agentName'>) => {
  try {
    await addAssessmentResult(resultData);
    setAssessmentHistory(await getAssessmentHistory());
    toast.success('Resultado da avaliação enviado com sucesso!');
  } catch (error: any) {
    console.error("Falha ao adicionar resultado:", error);
    toast.error(error.message || 'Falha ao enviar seu resultado.');
  }
};

const handleSaveAgent = async (agent: Agent) => {
  try {
    await saveAgent(agent);
    setAgents(await getAgents());
    toast.success('Usuário salvo com sucesso!');
  } catch (error: any) {
    console.error("Falha ao salvar agente:", error);
    toast.error(error.message || 'Falha ao salvar o usuário.');
  }
};

const handleDeleteAgent = async (id: string) => {
  try {
    await deleteAgent(id);
    setAgents(prev => prev.filter(a => a.id !== id));
    toast.success('Usuário excluído com sucesso!');
  } catch (error: any) {
    console.error("Falha ao deletar agente:", error);
    toast.error(error.message || 'Falha ao excluir o usuário.');
  }
};
  const handleSetPage = (page: Page) => {
    if (page === Page.Admin && !isAdminMode) {
      return;
    }
    setCurrentPage(page);
  }

  if (isLoading) {
    return <LoadingScreen />; 
  }

  if (!loggedInUser) {
    return <LoginPage onLoginSuccess={setLoggedInUser} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case Page.Home:
        return <HomePage setActivePage={handleSetPage} />;
      case Page.Training:
        return <TrainingPage materials={trainingData} onUpdateProgress={handleUpdateTrainingProgress} loggedInAgentId={loggedInUser.id} />;
      case Page.Assessments:
        return <AssessmentPage assessments={assessmentsData} onAddResult={handleAddAssessmentResult} />;
      case Page.Norms:
        return <NormsPage norms={normsData} />;
      case Page.History:
        return <HistoryPage history={assessmentHistory.filter(h => h.agentId === loggedInUser.id)} />;
      case Page.Ranking:
        return <RankingPage agents={agents} history={assessmentHistory} assessments={assessmentsData} loggedInAgentId={loggedInUser.id} />;
      case Page.Jogos:
        return <GamesPage />;
      case Page.Admin:
        return (
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
                loggedInAgentId={loggedInUser.id}
            />
        );
      default:
        return <HomePage setActivePage={handleSetPage} />;
    }
  };

  return (
    <div className="flex h-screen font-sans bg-background text-text-primary">
     <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={handleSetPage} 
        isAdminMode={isAdminMode}
        setIsAdminMode={setIsAdminMode}
        agent={loggedInUser}
        onLogout={handleLogout}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 md:p-8">
            <Header title={currentPage} />
        </div>
        <main className="flex-1 overflow-x-hidden overflow-y-auto px-6 md:px-8 pb-8">
          <div key={currentPage} className="animate-fade-in">
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;