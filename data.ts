import { TrainingMaterial, NormDocument, Quiz, Agent, AssessmentResult } from './types';

// Logged-in user simulation
export const LOGGED_IN_AGENT: Agent = {
  id: 'agent-1',
  name: 'Welbster',
  email: 'welbster.agente@email.com',
  role: 'gestor'
};

export const AGENTS: Agent[] = [
  LOGGED_IN_AGENT,
  { id: 'agent-2', name: 'Agente Silva', email: 'silva.agente@email.com', role: 'agente' },
  { id: 'agent-3', name: 'Agente Souza', email: 'souza.agente@email.com', role: 'agente' },
];

export const INITIAL_TRAINING_DATA: TrainingMaterial[] = [
  {
    id: 1,
    title: 'Controle de Vetores: Aedes aegypti',
    description: 'Um guia completo sobre o ciclo de vida e os métodos de controle do mosquito transmissor da dengue, zika e chikungunya.',
    isVisible: true,
    steps: [
      {
        type: 'content',
        title: 'Introdução ao Aedes aegypti',
        content: 'O Aedes aegypti é um mosquito doméstico, que vive dentro ou ao redor de domicílios. Ele é o principal transmissor das doenças dengue, zika e chikungunya. Conhecer seu comportamento é o primeiro passo para um controle eficaz.',
        imageUrl: 'https://github.com/welbstercczdev/portal-ccz-sjc/blob/main/imagens/ciclo-da-vida/aedes.jpeg?raw=true'
      },
      {
        type: 'content',
        title: 'Identificando Criadouros',
        content: 'Os ovos do mosquito são depositados em recipientes com água parada. Os principais criadouros são pneus, vasos de plantas, garrafas, calhas entupidas e caixas d\'água mal vedadas. A eliminação desses recipientes é a forma mais eficaz de prevenção.',
        imageUrl: 'https://github.com/welbstercczdev/portal-ccz-sjc/blob/main/imagens/batalha-contra-a-dengue/pneu.png?raw=true'
      },
      {
        type: 'quiz',
        title: 'Verificação de Conhecimento',
        content: 'Vamos testar o que você aprendeu até agora.',
        question: {
          id: 'q1-1',
          text: 'Qual das seguintes ações é a MAIS eficaz para prevenir a proliferação do Aedes aegypti?',
          options: ['Usar repelente corporal', 'Eliminar recipientes com água parada', 'Instalar telas em janelas', 'Manter o lixo fechado'],
          correctAnswerIndex: 1
        }
      },
      {
        type: 'content',
        title: 'Conclusão e Próximos Passos',
        content: 'Parabéns por revisar os conceitos básicos! O controle do Aedes aegypti é um esforço contínuo que depende da vigilância e da ação de cada agente. Continue seu excelente trabalho protegendo a comunidade.'
      }
    ],
    agentProgress: {},
  },
  // Add more training modules here
];

export const INITIAL_NORMS_DATA: NormDocument[] = [
  { id: 1, code: 'NT-001/2024', title: 'Norma Técnica para Coleta de Amostras', summary: 'Procedimentos padronizados para a coleta, armazenamento e transporte de amostras biológicas para análise de zoonoses.', url: '#' },
  { id: 2, code: 'POP-005/2023', title: 'Procedimento Operacional Padrão: Controle de Foco', summary: 'Guia passo a passo para a identificação, tratamento e eliminação de focos do Aedes aegypti em visitas domiciliares.', url: '#' },
];

export const INITIAL_ASSESSMENTS_DATA: Quiz[] = [
  {
    id: 'quiz-1',
    title: 'Identificação de Vetores',
    description: 'Teste seu conhecimento na identificação de diferentes tipos de vetores e os riscos associados.',
    isVisible: true,
    questions: [
      { id: 'q1', text: 'Qual destes é o principal vetor da Dengue?', options: ['Aedes aegypti', 'Culex', 'Anopheles', 'Lutzomyia'], correctAnswerIndex: 0 },
      { id: 'q2', text: 'Onde o Aedes aegypti prefere depositar seus ovos?', options: ['Água corrente e limpa', 'Água parada e limpa', 'Água parada e suja', 'Solo úmido'], correctAnswerIndex: 1 },
    ]
  }
];

export const INITIAL_HISTORY_DATA: AssessmentResult[] = [
    {id: 'result-1', quizId: 'quiz-1', quizTitle: 'Identificação de Vetores', agentId: 'agent-2', agentName: 'Agente Silva', score: 1, totalQuestions: 2, percentage: 50, date: new Date().toISOString(), userAnswers: {q1: 0, q2: 2}, duration: 120},
    {id: 'result-2', quizId: 'quiz-1', quizTitle: 'Identificação de Vetores', agentId: 'agent-3', agentName: 'Agente Souza', score: 2, totalQuestions: 2, percentage: 100, date: new Date().toISOString(), userAnswers: {q1: 0, q2: 1}, duration: 95},
];