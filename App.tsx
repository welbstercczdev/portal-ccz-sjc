import React, { useState } from 'react';
import { Page, TrainingMaterial, NormDocument, Quiz, AssessmentResult, Agent } from './types';
import { INITIAL_TRAINING_DATA, INITIAL_NORMS_DATA, INITIAL_ASSESSMENTS_DATA, AGENTS, INITIAL_HISTORY_DATA } from './data';
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

interface AppProps {
  loggedInAgent: Agent;
  onLogout: () => void;
}

const App: React.FC<AppProps> = ({ loggedInAgent, onLogout }) => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [isAdminMode, setIsAdminMode] = useState(false);

  // Data states
  const [trainingData, setTrainingData] = useState<TrainingMaterial[]>(INITIAL_TRAINING_DATA);
  const [normsData, setNormsData] = useState<NormDocument[]>(INITIAL_NORMS_DATA);
  const [assessmentsData, setAssessmentsData] = useState<Quiz[]>(INITIAL_ASSESSMENTS_DATA);
  const [assessmentHistory, setAssessmentHistory] = useState<AssessmentResult[]>(INITIAL_HISTORY_DATA);
  const [agents, setAgents] = useState<Agent[]>(AGENTS);


  // CRUD Handlers
  const handleSaveTraining = (training: TrainingMaterial) => {
    setTrainingData(prev => {
      const exists = prev.some(t => t.id === training.id);
      if (exists) {
        return prev.map(t => t.id === training.id ? training : t);
      }
      return [...prev, { ...training, id: Date.now() }];
    });
  };
  const handleDeleteTraining = (id: number) => setTrainingData(prev => prev.filter(t => t.id !== id));

  const handleToggleTrainingCompletion = (id: number) => {
    setTrainingData(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleSaveNorm = (norm: NormDocument) => {
    setNormsData(prev => {
      const exists = prev.some(n => n.id === norm.id);
      if (exists) {
        return prev.map(n => n.id === norm.id ? norm : n);
      }
      return [...prev, { ...norm, id: Date.now() }];
    });
  };
  const handleDeleteNorm = (id: number) => setNormsData(prev => prev.filter(n => n.id !== id));

  const handleSaveAssessment = (quiz: Quiz) => {
    setAssessmentsData(prev => {
        const exists = prev.some(q => q.id === quiz.id);
        if (exists) {
            return prev.map(q => (q.id === quiz.id ? quiz : q));
        }
        return [...prev, { ...quiz, id: `quiz-${Date.now()}` }];
    });
  };
  const handleDeleteAssessment = (id: string) => setAssessmentsData(prev => prev.filter(q => q.id !== id));
  
  const handleAddAssessmentResult = (resultData: Omit<AssessmentResult, 'id' | 'date' | 'agentId' | 'agentName'>) => {
    const newResult: AssessmentResult = {
        ...resultData,
        id: `result-${Date.now()}`,
        date: new Date().toISOString(),
        agentId: loggedInAgent.id,
        agentName: loggedInAgent.name,
    };
    setAssessmentHistory(prev => [newResult, ...prev]);
  };

  const handleSaveAgent = (agent: Agent) => {
    setAgents(prev => {
        const exists = prev.some(a => a.id === agent.id);
        if (exists) {
            return prev.map(a => a.id === agent.id ? agent : a);
        }
        return [...prev, { ...agent, id: `agent-${Date.now()}` }];
    });
  };

  const handleDeleteAgent = (id: string) => {
    if (id === loggedInAgent.id) {
      alert("Você não pode excluir seu próprio usuário.");
      return;
    }
    setAgents(prev => prev.filter(a => a.id !== id));
  };


  const handleSetPage = (page: Page) => {
    if (page === Page.Admin && loggedInAgent.role !== 'gestor') {
      return;
    }
    setCurrentPage(page);
  };

  const handleAdminModeToggle = (newMode: boolean) => {
    if (loggedInAgent.role !== 'gestor') return;
    setIsAdminMode(newMode);
    if(newMode && currentPage !== Page.Admin) {
        setCurrentPage(Page.Admin);
    } else if (!newMode && currentPage === Page.Admin) {
        setCurrentPage(Page.Home);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case Page.Home:
        return <HomePage setActivePage={handleSetPage} />;
      case Page.Training:
        return <TrainingPage materials={trainingData} onToggleCompletion={handleToggleTrainingCompletion} />;
      case Page.Assessments:
        return <AssessmentPage assessments={assessmentsData} onAddResult={handleAddAssessmentResult} />;
      case Page.Norms:
        return <NormsPage norms={normsData} />;
       case Page.History:
        return <HistoryPage history={assessmentHistory.filter(h => h.agentId === loggedInAgent.id)} />;
      case Page.Ranking:
        return <RankingPage agents={agents} history={assessmentHistory} assessments={assessmentsData} loggedInAgentId={loggedInAgent.id} />;
      case Page.Jogos:
        return <GamesPage />;
      case Page.Admin:
        if (!isAdminMode || loggedInAgent.role !== 'gestor') {
            return <HomePage setActivePage={handleSetPage} />;
        }
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
                loggedInAgentId={loggedInAgent.id}
            />
        );
      default:
        return <HomePage setActivePage={handleSetPage} />;
    }
  };

  return (
    <div className="flex h-screen font-sans bg-background text-text-primary">
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={handleSetPage} 
        isAdminMode={isAdminMode}
        setIsAdminMode={handleAdminModeToggle}
        agent={loggedInAgent}
        onLogout={onLogout}
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