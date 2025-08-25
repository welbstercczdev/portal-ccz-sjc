export enum Page {
  Home = 'Início',
  Training = 'Capacitação',
  Assessments = 'Avaliações',
  Norms = 'Normas Técnicas',
  History = 'Meu Histórico',
  Ranking = 'Ranking',
  Jogos = 'Jogos',
  Admin = 'Gestão',
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  role: 'agente' | 'gestor';
  password?: string; // Should be handled securely in a real app
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  imageUrl?: string;
  videoUrl?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  isVisible: boolean;
}

export interface NormDocument {
  id: number;
  code: string;
  title: string;
  summary: string;
  url: string;
}

export interface TrainingStep {
  type: 'content' | 'quiz';
  title: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  question?: Question;
}

export interface TrainingProgress {
    progress: number;
    completed: boolean;
    currentStep: number;
}

export interface TrainingMaterial {
  id: number;
  title: string;
  description: string;
  steps: TrainingStep[];
  // Tracks progress for each agent individually
  agentProgress: { [agentId: string]: TrainingProgress };
  isVisible: boolean;
}


export interface AssessmentResult {
    id: string;
    quizId: string;
    quizTitle: string;
    agentId: string;
    agentName: string;
    score: number;
    totalQuestions: number;
    percentage: number;
    date: string; // ISO string
    userAnswers: { [questionId: string]: number };
    duration: number; // in seconds
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}