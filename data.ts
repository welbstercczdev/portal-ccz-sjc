import { TrainingMaterial, NormDocument, Quiz, Agent, AssessmentResult } from './types';

export const LOGGED_IN_AGENT: Agent = {
  id: 'agent-12345',
  name: 'Agente Silva',
  email: 'silva.gestor@ccz.sjc.gov.br',
  role: 'gestor',
  password: 'password123',
};

export const AGENTS: Agent[] = [
  LOGGED_IN_AGENT,
  { id: 'agent-67890', name: 'Agente Costa', email: 'costa.agente@ccz.sjc.gov.br', role: 'agente', password: 'password123' },
  { id: 'agent-13579', name: 'Agente Souza', email: 'souza.agente@ccz.sjc.gov.br', role: 'agente', password: 'password123' },
];

export const INITIAL_TRAINING_DATA: TrainingMaterial[] = [
  {
    id: 1,
    title: 'Controle de Vetores: Aedes aegypti',
    description: 'Um guia completo sobre o ciclo de vida e os métodos de controle do mosquito transmissor da dengue, zika e chikungunya.',
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
    completed: false,
    progress: 0,
  },
  // (Você pode adicionar mais módulos de treinamento aqui)
];

export const INITIAL_NORMS_DATA: NormDocument[] = [
  { id: 1, code: "NT-001/2023", title: "Norma Técnica para Coleta de Amostras Biológicas", summary: "Procedimentos padronizados para coleta, armazenamento e transporte de amostras para diagnóstico de zoonoses.", url: "#" },
  { id: 2, code: "NT-002/2023", title: "Norma Técnica para Bloqueio de Transmissão de Raiva", summary: "Ações de bloqueio vacinal em áreas com casos suspeitos ou confirmados de raiva animal.", url: "#" },
  { id: 3, code: "POP-005/2022", title: "Procedimento Operacional Padrão: Eutanásia", summary: "Diretrizes éticas e técnicas para a realização de eutanásia em animais, conforme legislação vigente.", url: "#" },
];

export const INITIAL_ASSESSMENTS_DATA: Quiz[] = [
  {
    id: "dengue-01",
    title: "Conhecimentos sobre Dengue",
    description: "Teste seus conhecimentos sobre o Aedes aegypti e o controle da Dengue.",
    isVisible: true,
    questions: [
      { id: 'q1d', text: "Qual destes NÃO é um sintoma clássico da Dengue?", options: ["Febre alta", "Dor de cabeça", "Tosse seca", "Manchas vermelhas na pele"], correctAnswerIndex: 2 },
      { id: 'q2d', text: "O ciclo de vida do Aedes aegypti (ovo a adulto) leva em média quantos dias?", options: ["1-2 dias", "7-10 dias", "20-30 dias", "2 meses"], correctAnswerIndex: 1 },
      { id: 'q3d', text: "Qual o principal método para evitar a proliferação do Aedes aegypti?", options: ["Uso de repelente", "Vacinação", "Eliminar água parada", "Telas nas janelas"], correctAnswerIndex: 2 },
    ]
  },
  {
    id: "raiva-01",
    title: "Prevenção da Raiva",
    description: "Avalie seus conhecimentos sobre a raiva e sua profilaxia.",
    isVisible: true,
    questions: [
      { id: 'q1r', text: "A raiva é causada por um(a):", options: ["Bactéria", "Fungo", "Protozoário", "Vírus"], correctAnswerIndex: 3 },
      { id: 'q2r', text: "Qual o principal transmissor da raiva em áreas urbanas no Brasil?", options: ["Morcego", "Gato", "Cão", "Raposa"], correctAnswerIndex: 2 },
      { id: 'q3r', text: "O que fazer imediatamente após ser mordido por um animal suspeito?", options: ["Esperar os sintomas", "Lavar o local com água e sabão", "Tomar um analgésico", "Procurar o dono do animal"], correctAnswerIndex: 1 },
    ]
  }
];

export const INITIAL_HISTORY_DATA: AssessmentResult[] = [
    // Agente Silva's results
    { id: 'res1', quizId: 'dengue-01', quizTitle: 'Conhecimentos sobre Dengue', score: 2, totalQuestions: 3, percentage: 66.67, date: new Date('2023-10-26T10:00:00Z').toISOString(), agentId: LOGGED_IN_AGENT.id, agentName: LOGGED_IN_AGENT.name, userAnswers: {'q1d': 0, 'q2d': 1, 'q3d': 2}, duration: 125 },
    { id: 'res2', quizId: 'dengue-01', quizTitle: 'Conhecimentos sobre Dengue', score: 3, totalQuestions: 3, percentage: 100, date: new Date('2023-10-27T11:00:00Z').toISOString(), agentId: LOGGED_IN_AGENT.id, agentName: LOGGED_IN_AGENT.name, userAnswers: {'q1d': 2, 'q2d': 1, 'q3d': 2}, duration: 95 },
    { id: 'res3', quizId: 'raiva-01', quizTitle: 'Prevenção da Raiva', score: 3, totalQuestions: 3, percentage: 100, date: new Date('2023-10-28T14:00:00Z').toISOString(), agentId: LOGGED_IN_AGENT.id, agentName: LOGGED_IN_AGENT.name, userAnswers: {'q1r': 3, 'q2r': 2, 'q3r': 1}, duration: 88 },

    // Agente Costa's results
    { id: 'res4', quizId: 'dengue-01', quizTitle: 'Conhecimentos sobre Dengue', score: 3, totalQuestions: 3, percentage: 100, date: new Date('2023-10-27T12:00:00Z').toISOString(), agentId: 'agent-67890', agentName: 'Agente Costa', userAnswers: {'q1d': 2, 'q2d': 1, 'q3d': 2}, duration: 110 },
    { id: 'res5', quizId: 'raiva-01', quizTitle: 'Prevenção da Raiva', score: 2, totalQuestions: 3, percentage: 66.67, date: new Date('2023-10-28T15:00:00Z').toISOString(), agentId: 'agent-67890', agentName: 'Agente Costa', userAnswers: {'q1r': 3, 'q2r': 1, 'q3r': 1}, duration: 130 },

    // Agente Souza's results
    { id: 'res6', quizId: 'dengue-01', quizTitle: 'Conhecimentos sobre Dengue', score: 3, totalQuestions: 3, percentage: 100, date: new Date('2023-10-27T13:00:00Z').toISOString(), agentId: 'agent-13579', agentName: 'Agente Souza', userAnswers: {'q1d': 2, 'q2d': 1, 'q3d': 2}, duration: 92 },
    { id: 'res7', quizId: 'raiva-01', quizTitle: 'Prevenção da Raiva', score: 3, totalQuestions: 3, percentage: 100, date: new Date('2023-10-29T09:00:00Z').toISOString(), agentId: 'agent-13579', agentName: 'Agente Souza', userAnswers: {'q1r': 3, 'q2r': 2, 'q3r': 1}, duration: 105 },
    { id: 'res8', quizId: 'raiva-01', quizTitle: 'Prevenção da Raiva', score: 2, totalQuestions: 3, percentage: 66.67, date: new Date('2023-10-28T16:00:00Z').toISOString(), agentId: 'agent-13579', agentName: 'Agente Souza', userAnswers: {'q1r': 1, 'q2r': 2, 'q3r': 1}, duration: 140 },
];