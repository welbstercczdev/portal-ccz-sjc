import { Agent } from '../types';

const API_URL = import.meta.env.VITE_API_BASE_URL;

async function request(action: string, payload: any = {}) {
    const token = localStorage.getItem('authToken');
    
    const body = {
        action,
        payload,
        token: token,
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(`Erro de rede: ${response.status} ${response.statusText}`);
        }

        const responseData = await response.json();
        
        if (responseData.success === false) {
            // Se o erro for de token, desloga o usuário para evitar loops de erro
            if (responseData.error && (responseData.error.toLowerCase().includes('expirado') || responseData.error.toLowerCase().includes('inválido'))) {
                logout();
                window.location.reload();
            }
            throw new Error(responseData.error || 'Ocorreu um erro desconhecido na API.');
        }
        
        return responseData.data; // Retorna apenas o objeto de dados em caso de sucesso

    } catch (error) {
        console.error("Falha na requisição Fetch:", error);
        throw error;
    }
}

// --- Funções de Autenticação ---
export const login = async (email, password): Promise<Agent> => {
    const data = await request('login', { email, password });
    if (data.token && data.user) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data.user;
};

export const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
};

export const getLoggedInUser = (): Agent | null => {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
};

// --- Funções de Leitura (GET) ---
export const getTrainings = () => request('getTrainings');
export const getNorms = () => request('getNorms');
export const getAssessments = () => request('getAssessments');
export const getAssessmentHistory = () => request('getAssessmentHistory');
export const getAgents = () => request('getAgents');

// --- Funções de Escrita (CREATE, UPDATE, DELETE) ---
export const saveTraining = (trainingData: any) => request('saveTraining', trainingData);
export const deleteTraining = (id: number) => request('deleteTraining', { id });
export const updateTrainingProgress = (trainingId: number, currentStepIndex: number) => request('updateTrainingProgress', { trainingId, currentStepIndex });
export const saveNorm = (normData: any) => request('saveNorm', normData);
export const deleteNorm = (id: number) => request('deleteNorm', { id });
export const saveAssessment = (assessmentData: any) => request('saveAssessment', assessmentData);
export const deleteAssessment = (id: string) => request('deleteAssessment', { id });
export const addAssessmentResult = (resultData: any) => request('addAssessmentResult', resultData);
export const saveAgent = (agentData: any) => request('saveAgent', agentData);
export const deleteAgent = (id: string) => request('deleteAgent', { id });