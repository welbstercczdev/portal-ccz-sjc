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

// NOVO: Define a estrutura de uma etapa do treinamento
export interface TrainingStep {
type: 'content' | 'quiz';
title: string;
content: string; // Pode conter markdown ou texto simples
imageUrl?: string;
videoUrl?: string;
question?: Question; // Usado se o tipo for 'quiz'
}
// ATUALIZADO: A estrutura do TrainingMaterial foi modificada
export interface TrainingMaterial {
id: number;
title: string;
description: string;
steps: TrainingStep[];
completed: boolean;
progress: number; // Percentual de 0 a 100
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