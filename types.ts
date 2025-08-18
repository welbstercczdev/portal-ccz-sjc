export enum Page {
  Home = 'Início',
  Training = 'Capacitação',
  Assessments = 'Avaliações',
  Norms = 'Normas Técnicas',
  History = 'Histórico',
  Admin = 'Gestão',
  Ranking = 'Ranking',
  Jogos = 'Jogos'
}

export interface TrainingMaterial {
  id: number;
  title: string;
  type: 'Vídeo' | 'Artigo' | 'Apresentação';
  description: string;
  url: string;
  completed: boolean;
}

export interface NormDocument {
  id: number;
  code: string;
  title: string;
  summary: string;
  url: string;
}

export interface Question {
  id: string; // Unique ID for each question
  text: string;
  options: string[];
  correctAnswerIndex: number;
  imageUrl?: string;
  videoUrl?: string;
}

export interface Quiz {
  id: string;
  title:string;
  description: string;
  questions: Question[];
  isVisible: boolean;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  role: 'agente' | 'gestor';
  password?: string;
}

export interface AssessmentResult {
  id: string;
  quizId: string;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  date: string; // ISO date string
  agentId: string;
  agentName: string;
  userAnswers: { [questionId: string]: number }; // questionId -> selectedOptionIndex
  duration: number; // in seconds
}