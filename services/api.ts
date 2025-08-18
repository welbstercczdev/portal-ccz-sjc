import { AssessmentResult, TrainingMaterial, NormDocument, Quiz, Agent } from '../types';

// A URL do seu backend. Mantê-la em um único lugar facilita a manutenção.
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwsazswwzHbNkjngS7PNz90afjxPnRdqUPSY0iCpwle7hqMVU9rUL0_-p8K0U-2tSbi/exec';

/**
 * Função principal para chamar a API usando a técnica JSONP.
 * @param action A ação a ser executada no backend.
 * @param params Um objeto com os parâmetros a serem enviados.
 * @returns Uma Promise com a resposta do servidor.
 */
function callApi(action: string, params: Record<string, any> = {}): Promise<any> {
  return new Promise((resolve, reject) => {
    const callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());

    window[callbackName] = (data: any) => {
      document.body.removeChild(script);
      delete window[callbackName];
      if (data.success) {
        resolve(data.data || data); // Retorna o campo 'data' se existir, ou a resposta completa.
      } else {
        reject(new Error(data.message || 'Ocorreu um erro na API.'));
      }
    };

    const url = new URL(SCRIPT_URL);
    url.searchParams.append('action', action);
    url.searchParams.append('callback', callbackName);
    for (const key in params) {
      // Converte objetos/arrays em strings JSON para o envio
      const value = typeof params[key] === 'object' ? JSON.stringify(params[key]) : params[key];
      url.searchParams.append(key, value);
    }

    const script = document.createElement('script');
    script.src = url.toString();
    script.onerror = () => {
      delete window[callbackName];
      document.body.removeChild(script);
      reject(new Error('Falha na rede ou na chamada da API.'));
    };
    document.body.appendChild(script);
  });
}

// --- Funções da API para o Agente ---

export const getInitialDataForAgent = (agentId: string) => {
  // Corrigido para corresponder à action esperada pelo backend
  return callApi('getInitialDataForAgent', { agentId });
};
export const saveAssessmentResult = (result: Omit<AssessmentResult, 'id' | 'agentName' | 'date'>) => {
  // A ação é a mesma, mas agora passamos o objeto `result` como os parâmetros principais
  return callApi('saveAssessmentResult', { result: JSON.stringify(result) });
};

export const setTrainingProgress = (agentId: string, trainingId: string, completed: boolean) => {
  return callApi('setTrainingProgress', { agentId, trainingId, completed });
};


// --- Funções da API para o Admin ---

export const getAllDataForAdmin = () => {
  return callApi('getAllDataForAdmin');
};

export const saveAgent = (agentData: Agent) => {
  return callApi('saveAgent', { agentData });
};

export const deleteAgent = (id: string) => {
  return callApi('deleteAgent', { id });
};

// ... adicione aqui funções para as outras ações de admin (saveTraining, deleteNorm, etc.)
// Exemplo:
export const saveTraining = (trainingData: TrainingMaterial) => {
  return callApi('saveTraining', { trainingData });
};

export const deleteTraining = (id: string) => {
  return callApi('deleteTraining', { id });
};

export const saveNorm = (normData: NormDocument) => {
    return callApi('saveNorm', {normData})
};

export const deleteNorm = (id: string) => {
    return callApi('deleteNorm', {id})
};

export const saveAssessment = (assessmentData: Quiz) => {
    return callApi('saveAssessment', {assessmentData})
};

export const deleteAssessment = (id: string) => {
    return callApi('deleteAssessment', {id})
};
export const changePassword = (agentId: string, oldPassword: string, newPassword: string) => {
  return callApi('changePassword', { agentId, oldPassword, newPassword });
};