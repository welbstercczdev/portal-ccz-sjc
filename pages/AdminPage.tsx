import React, { useState, useEffect } from 'react';
import { TrainingMaterial, NormDocument, Quiz, Question, Agent, AssessmentResult, TrainingStep } from '../types';
import Modal from '../components/Modal';
import AnalyticsPage from './AnalyticsPage';

type View = 'dashboard' | 'trainings' | 'norms' | 'assessments' | 'analytics' | 'users';

interface AdminPageProps {
    trainings: TrainingMaterial[];
    norms: NormDocument[];
    assessments: Quiz[];
    agents: Agent[];
    assessmentHistory: AssessmentResult[];
    onSaveTraining: (training: TrainingMaterial) => void;
    onDeleteTraining: (id: number) => void;
    onSaveNorm: (norm: NormDocument) => void;
    onDeleteNorm: (id: number) => void;
    onSaveAssessment: (quiz: Quiz) => void;
    onDeleteAssessment: (id: string) => void;
    onSaveAgent: (agent: Agent) => void;
    onDeleteAgent: (id: string) => void;
    loggedInAgentId: string;
}

const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>;
const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>;
const EyeOffIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" /><path d="M12.454 16.697l-1.414-1.414a4 4 0 01-5.478-5.478l-1.414-1.414A10.007 10.007 0 01.458 10C1.732 14.057 5.522 17 10 17a9.958 9.958 0 002.454-.303z" /></svg>;
const ChartBarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const ResetPasswordIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v-2l1-1 1-1 1.257-1.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" /></svg>;


const AdminPage: React.FC<AdminPageProps> = (props) => {
    const [view, setView] = useState<View>('dashboard');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any | null>(null);

    // States for password reset modal
    const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
    const [resettingAgent, setResettingAgent] = useState<Agent | null>(null);

    const openModal = (item: any | null = null) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
    };

    const openResetPasswordModal = (agent: Agent) => {
        setResettingAgent(agent);
        setIsResetPasswordModalOpen(true);
    };

    const closeResetPasswordModal = () => {
        setIsResetPasswordModalOpen(false);
        setResettingAgent(null);
    };

    const handleSavePassword = (agent: Agent, newPassword: string) => {
        props.onSaveAgent({ ...agent, password: newPassword });
        closeResetPasswordModal();
    };

    const handleDelete = (type: View, id: number | string) => {
        if (window.confirm('Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.')) {
            switch(type) {
                case 'trainings': props.onDeleteTraining(id as number); break;
                case 'norms': props.onDeleteNorm(id as number); break;
                case 'assessments': props.onDeleteAssessment(id as string); break;
                case 'users': props.onDeleteAgent(id as string); break;
            }
        }
    }

    const handleToggleVisibility = (quiz: Quiz) => {
        props.onSaveAssessment({ ...quiz, isVisible: !quiz.isVisible });
    };
    
    const renderContent = () => {
        switch (view) {
            case 'trainings':
                return (
                    <div className="bg-surface rounded-lg shadow-card p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Gerenciar Capacitações</h3>
                            <button onClick={() => openModal()} className="flex items-center bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors"><PlusIcon/> Adicionar</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-border-color">
                                    <tr>
                                        <th className="p-3 font-semibold">Título</th>
                                        <th className="p-3 font-semibold">Etapas</th>
                                        <th className="p-3 font-semibold">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {props.trainings.map(item => (
                                        <tr key={item.id} className="border-b border-border-color last:border-b-0">
                                            <td className="p-3">{item.title}</td>
                                            <td className="p-3">{item.steps.length}</td>
                                            <td className="p-3 flex gap-2">
                                                <button onClick={() => openModal(item)} className="text-blue-600 hover:text-blue-800"><EditIcon/></button>
                                                <button onClick={() => handleDelete('trainings', item.id)} className="text-red-600 hover:text-red-800"><DeleteIcon/></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'norms':
                return (
                    <div className="bg-surface rounded-lg shadow-card p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Gerenciar Normas Técnicas</h3>
                            <button onClick={() => openModal()} className="flex items-center bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors"><PlusIcon/> Adicionar</button>
                        </div>
                         <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-border-color">
                                    <tr>
                                        <th className="p-3 font-semibold">Código</th>
                                        <th className="p-3 font-semibold">Título</th>
                                        <th className="p-3 font-semibold">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {props.norms.map(item => (
                                        <tr key={item.id} className="border-b border-border-color last:border-b-0">
                                            <td className="p-3">{item.code}</td>
                                            <td className="p-3">{item.title}</td>
                                            <td className="p-3 flex gap-2">
                                                <button onClick={() => openModal(item)} className="text-blue-600 hover:text-blue-800"><EditIcon/></button>
                                                <button onClick={() => handleDelete('norms', item.id)} className="text-red-600 hover:text-red-800"><DeleteIcon/></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
             case 'assessments':
                return (
                    <div className="bg-surface rounded-lg shadow-card p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Gerenciar Avaliações</h3>
                            <button onClick={() => openModal()} className="flex items-center bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors"><PlusIcon/> Adicionar</button>
                        </div>
                         <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-border-color">
                                    <tr>
                                        <th className="p-3 font-semibold">Título</th>
                                        <th className="p-3 font-semibold">Nº de Questões</th>
                                        <th className="p-3 font-semibold">Visibilidade</th>
                                        <th className="p-3 font-semibold">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {props.assessments.map(item => (
                                        <tr key={item.id} className="border-b border-border-color last:border-b-0">
                                            <td className="p-3">{item.title}</td>
                                            <td className="p-3">{item.questions.length}</td>
                                            <td className="p-3">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${item.isVisible ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                                                    {item.isVisible ? 'Visível' : 'Oculto'}
                                                </span>
                                            </td>
                                            <td className="p-3 flex gap-2">
                                                <button onClick={() => handleToggleVisibility(item)} className="text-gray-600 hover:text-gray-800" title={item.isVisible ? "Ocultar" : "Tornar visível"}>
                                                    {item.isVisible ? <EyeIcon/> : <EyeOffIcon/>}
                                                </button>
                                                <button onClick={() => openModal(item)} className="text-blue-600 hover:text-blue-800"><EditIcon/></button>
                                                <button onClick={() => handleDelete('assessments', item.id)} className="text-red-600 hover:text-red-800"><DeleteIcon/></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'users':
                return (
                    <div className="bg-surface rounded-lg shadow-card p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Gerenciar Usuários</h3>
                            <button onClick={() => openModal()} className="flex items-center bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors"><PlusIcon/> Adicionar Usuário</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-border-color">
                                    <tr>
                                        <th className="p-3 font-semibold">Nome</th>
                                        <th className="p-3 font-semibold">Email</th>
                                        <th className="p-3 font-semibold">Perfil</th>
                                        <th className="p-3 font-semibold">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {props.agents.map(agent => (
                                        <tr key={agent.id} className="border-b border-border-color last:border-b-0">
                                            <td className="p-3">{agent.name}</td>
                                            <td className="p-3">{agent.email}</td>
                                            <td className="p-3 capitalize">{agent.role}</td>
                                            <td className="p-3 flex gap-3">
                                                <button onClick={() => openModal(agent)} className="text-blue-600 hover:text-blue-800" title="Editar Usuário"><EditIcon/></button>
                                                <button onClick={() => openResetPasswordModal(agent)} className="text-amber-600 hover:text-amber-800" title="Resetar Senha"><ResetPasswordIcon/></button>
                                                <button onClick={() => handleDelete('users', agent.id)} className="text-red-600 hover:text-red-800" title="Excluir Usuário" disabled={agent.id === props.loggedInAgentId}><DeleteIcon/></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'analytics':
                return (
                    <AnalyticsPage 
                        assessments={props.assessments}
                        agents={props.agents}
                        history={props.assessmentHistory}
                        trainings={props.trainings}
                    />
                );
            case 'dashboard':
            default:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <button onClick={() => setView('trainings')} className="p-6 bg-surface rounded-xl shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all text-left group">
                            <h3 className="text-xl font-bold text-primary group-hover:underline">Capacitações</h3>
                            <p className="text-text-secondary mt-2">Gerenciar materiais de treinamento.</p>
                            <p className="mt-4 font-bold text-3xl text-text-primary">{props.trainings.length}</p>
                        </button>
                         <button onClick={() => setView('norms')} className="p-6 bg-surface rounded-xl shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all text-left group">
                            <h3 className="text-xl font-bold text-primary group-hover:underline">Normas Técnicas</h3>
                            <p className="text-text-secondary mt-2">Gerenciar normas e procedimentos.</p>
                             <p className="mt-4 font-bold text-3xl text-text-primary">{props.norms.length}</p>
                        </button>
                         <button onClick={() => setView('assessments')} className="p-6 bg-surface rounded-xl shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all text-left group">
                            <h3 className="text-xl font-bold text-primary group-hover:underline">Avaliações</h3>
                            <p className="text-text-secondary mt-2">Gerenciar quizzes e avaliações.</p>
                             <p className="mt-4 font-bold text-3xl text-text-primary">{props.assessments.length}</p>
                        </button>
                         <button onClick={() => setView('users')} className="p-6 bg-surface rounded-xl shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all text-left group">
                            <h3 className="text-xl font-bold text-primary group-hover:underline">Usuários</h3>
                            <p className="text-text-secondary mt-2">Gerenciar agentes e gestores.</p>
                            <p className="mt-4 font-bold text-3xl text-text-primary">{props.agents.length}</p>
                        </button>
                         <button onClick={() => setView('analytics')} className="p-6 bg-surface rounded-xl shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all text-left group md:col-span-2 lg:col-span-4 flex items-center gap-6">
                            <ChartBarIcon />
                            <div>
                                <h3 className="text-xl font-bold text-primary group-hover:underline">Análises e Relatórios</h3>
                                <p className="text-text-secondary mt-2">Visualizar dados de desempenho dos agentes e eficácia das avaliações.</p>
                            </div>
                        </button>
                    </div>
                );
        }
    };
    
    const renderModal = () => {
        if (!isModalOpen) return null;
        
        let title = '';
        let form = null;
        
        switch(view) {
            case 'trainings':
                title = editingItem ? 'Editar Capacitação' : 'Adicionar Capacitação';
                form = <TrainingForm initialData={editingItem} onSave={props.onSaveTraining} onClose={closeModal} />;
                break;
            case 'norms':
                title = editingItem ? 'Editar Norma Técnica' : 'Adicionar Norma Técnica';
                form = <NormForm initialData={editingItem} onSave={props.onSaveNorm} onClose={closeModal} />;
                break;
            case 'assessments':
                title = editingItem ? 'Editar Avaliação' : 'Adicionar Avaliação';
                form = <AssessmentForm initialData={editingItem} onSave={props.onSaveAssessment} onClose={closeModal} />;
                break;
            case 'users':
                title = editingItem ? 'Editar Usuário' : 'Adicionar Usuário';
                form = <AgentForm initialData={editingItem} onSave={props.onSaveAgent} onClose={closeModal} />;
                break;
        }

        return <Modal isOpen={isModalOpen} onClose={closeModal} title={title}>{form}</Modal>;
    }

    return (
        <div>
            {view !== 'dashboard' && (
                <button onClick={() => setView('dashboard')} className="mb-6 text-primary font-semibold hover:underline flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Voltar ao Painel
                </button>
            )}
            {renderContent()}
            {renderModal()}
            {isResetPasswordModalOpen && resettingAgent && (
                <Modal 
                    isOpen={isResetPasswordModalOpen} 
                    onClose={closeResetPasswordModal} 
                    title={`Resetar Senha de ${resettingAgent.name}`}
                >
                    <ResetPasswordForm 
                        agent={resettingAgent}
                        onSave={handleSavePassword}
                        onClose={closeResetPasswordModal}
                    />
                </Modal>
            )}
        </div>
    );
};

// --- FORM COMPONENTS --- //

const FormField: React.FC<{label: string, children: React.ReactNode}> = ({label, children}) => (
    <div className="mb-4">
        <label className="block text-sm font-semibold text-text-secondary mb-1">{label}</label>
        {children}
    </div>
);

const TextInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input {...props} className="w-full p-2 border border-border-color rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent transition" />
);

const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
    <textarea {...props} rows={3} className="w-full p-2 border border-border-color rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent transition" />
);

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
    <select {...props} className="w-full p-2 border border-border-color rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent transition bg-white" />
);


const TrainingForm: React.FC<{initialData: TrainingMaterial | null, onSave: (data: TrainingMaterial) => void, onClose: () => void}> = ({ initialData, onSave, onClose }) => {
    const [training, setTraining] = useState<TrainingMaterial>(
        initialData || {
            id: 0,
            title: '',
            description: '',
            steps: [{ type: 'content', title: '', content: '' }],
            agentProgress: {}
        }
    );

    useEffect(() => {
        if (initialData) {
            setTraining(initialData);
        } else {
            setTraining({
                id: 0,
                title: '',
                description: '',
                steps: [{ type: 'content', title: 'Introdução', content: '' }],
                agentProgress: {}
            });
        }
    }, [initialData]);

    const handleTrainingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTraining(prev => ({ ...prev, [name]: value }));
    };

    const handleStepChange = (stepIndex: number, field: keyof TrainingStep, value: string) => {
        const newSteps = [...training.steps];
        const step = newSteps[stepIndex] as any;
        step[field] = value;
        
        if (field === 'type' && value === 'quiz' && !step.question) {
            step.question = { id: `q-${Date.now()}`, text: '', options: ['', '', '', ''], correctAnswerIndex: 0 };
        }
        setTraining(prev => ({ ...prev, steps: newSteps }));
    };

    const handleQuestionChange = (stepIndex: number, field: 'text' | `option-${number}`, value: string) => {
        const newSteps = [...training.steps];
        const question = newSteps[stepIndex].question;
        if (!question) return;

        if (field.startsWith('option-')) {
            const optIndex = parseInt(field.split('-')[1]);
            question.options[optIndex] = value;
        } else {
            (question as any)[field] = value;
        }
        setTraining(prev => ({ ...prev, steps: newSteps }));
    };

    const handleCorrectAnswerChange = (stepIndex: number, correctIndex: number) => {
        const newSteps = [...training.steps];
        const question = newSteps[stepIndex].question;
        if (!question) return;
        question.correctAnswerIndex = correctIndex;
        setTraining(prev => ({ ...prev, steps: newSteps }));
    };

    const addStep = () => {
        setTraining(prev => ({
            ...prev,
            steps: [...prev.steps, { type: 'content', title: '', content: '' }]
        }));
    };

    const removeStep = (stepIndex: number) => {
        if (training.steps.length <= 1) {
            alert("A capacitação deve ter pelo menos uma etapa.");
            return;
        }
        setTraining(prev => ({
            ...prev,
            steps: prev.steps.filter((_, index) => index !== stepIndex)
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(training);
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <FormField label="Título da Capacitação">
                <TextInput name="title" value={training.title} onChange={handleTrainingChange} required />
            </FormField>
            <FormField label="Descrição da Capacitação">
                <TextArea name="description" value={training.description} onChange={handleTrainingChange} required />
            </FormField>
            
            <h4 className="text-lg font-semibold border-t border-border-color pt-4 mt-6">Etapas da Capacitação</h4>
            <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-2 -mr-2">
                {training.steps.map((step, stepIndex) => (
                    <div key={stepIndex} className="p-4 bg-slate-50 rounded-lg border border-border-color relative">
                        <div className="flex justify-between items-center mb-2">
                            <p className="font-semibold">Etapa {stepIndex + 1}</p>
                            {training.steps.length > 1 && (
                                <button type="button" onClick={() => removeStep(stepIndex)} className="text-red-500 hover:text-red-700"><DeleteIcon/></button>
                            )}
                        </div>

                        <FormField label="Tipo de Etapa">
                            <Select value={step.type} onChange={e => handleStepChange(stepIndex, 'type', e.target.value)}>
                                <option value="content">Conteúdo</option>
                                <option value="quiz">Quiz (Verificação)</option>
                            </Select>
                        </FormField>
                        <FormField label="Título da Etapa">
                            <TextInput value={step.title} onChange={e => handleStepChange(stepIndex, 'title', e.target.value)} required />
                        </FormField>
                        <FormField label="Conteúdo / Descrição">
                            <TextArea value={step.content} onChange={e => handleStepChange(stepIndex, 'content', e.target.value)} required />
                        </FormField>
                        <FormField label="URL da Imagem (Opcional)">
                            <TextInput type="url" placeholder="https://exemplo.com/imagem.png" value={step.imageUrl || ''} onChange={e => handleStepChange(stepIndex, 'imageUrl', e.target.value)} />
                        </FormField>
                         <FormField label="URL do Vídeo (Opcional)">
                            <TextInput type="url" placeholder="https://exemplo.com/video.mp4" value={step.videoUrl || ''} onChange={e => handleStepChange(stepIndex, 'videoUrl', e.target.value)} />
                        </FormField>

                        {step.type === 'quiz' && step.question && (
                             <div className="mt-4 pt-4 border-t border-dashed border-slate-300">
                                <p className="font-semibold mb-2">Configuração do Quiz</p>
                                <FormField label="Texto da Pergunta">
                                    <TextInput value={step.question.text} onChange={e => handleQuestionChange(stepIndex, 'text', e.target.value)} required />
                                </FormField>
                                {step.question.options.map((opt, optIndex) => (
                                    <FormField key={optIndex} label={`Opção ${optIndex + 1}`}>
                                        <div className="flex items-center gap-2">
                                        <TextInput value={opt} onChange={e => handleQuestionChange(stepIndex, `option-${optIndex}`, e.target.value)} required />
                                        <input type="radio" name={`correctAnswer-${stepIndex}`} checked={step.question.correctAnswerIndex === optIndex} onChange={() => handleCorrectAnswerChange(stepIndex, optIndex)} title="Marcar como correta" className="h-5 w-5 text-primary focus:ring-primary"/>
                                        </div>
                                    </FormField>
                                ))}
                             </div>
                        )}
                    </div>
                ))}
            </div>

            <button type="button" onClick={addStep} className="mt-4 text-primary font-semibold hover:underline flex items-center"><PlusIcon/> Adicionar Etapa</button>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-border-color">
                <button type="button" onClick={onClose} className="bg-slate-200 text-text-secondary font-bold py-2 px-4 rounded-lg hover:bg-slate-300">Cancelar</button>
                <button type="submit" className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-dark">Salvar Capacitação</button>
            </div>
        </form>
    );
};


const NormForm: React.FC<{initialData: NormDocument | null, onSave: (data: NormDocument) => void, onClose: () => void}> = ({ initialData, onSave, onClose }) => {
    const [data, setData] = useState<Omit<NormDocument, 'id'>>({ code: '', title: '', summary: '', url: '' });

    useEffect(() => {
        if (initialData) setData(initialData);
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...data, id: initialData?.id ?? 0 });
        onClose();
    };

    return (
        <form onSubmit={handleSubmit}>
            <FormField label="Código"><TextInput name="code" value={data.code} onChange={handleChange} required /></FormField>
            <FormField label="Título"><TextInput name="title" value={data.title} onChange={handleChange} required /></FormField>
            <FormField label="Resumo"><TextArea name="summary" value={data.summary} onChange={handleChange} required /></FormField>
            <FormField label="URL do Documento"><TextInput name="url" type="url" value={data.url} onChange={handleChange} required /></FormField>
            <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={onClose} className="bg-slate-200 text-text-secondary font-bold py-2 px-4 rounded-lg hover:bg-slate-300">Cancelar</button>
                <button type="submit" className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-dark">Salvar</button>
            </div>
        </form>
    );
};

const AssessmentForm: React.FC<{initialData: Quiz | null, onSave: (data: Quiz) => void, onClose: () => void}> = ({ initialData, onSave, onClose }) => {
    const [quiz, setQuiz] = useState<Quiz>({ id: '', title: '', description: '', questions: [], isVisible: true });

    useEffect(() => {
        if (initialData) {
            const sanitizedQuestions = initialData.questions.map(q => ({
                ...q,
                imageUrl: q.imageUrl || '',
                videoUrl: q.videoUrl || '',
            }));
            setQuiz({ ...initialData, questions: sanitizedQuestions, isVisible: initialData.isVisible ?? true });
        } else {
            setQuiz({ id: '', title: '', description: '', questions: [{id: `q${Date.now()}`, text: '', options: ['', '', '', ''], correctAnswerIndex: 0, imageUrl: '', videoUrl: ''}], isVisible: true });
        }
    }, [initialData]);

    const handleQuizChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        if (name === 'isVisible') {
             setQuiz(prev => ({ ...prev, isVisible: checked }));
        } else {
            setQuiz(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleQuestionChange = (qIndex: number, field: 'text' | `option-${number}` | 'imageUrl' | 'videoUrl', value: string) => {
        const newQuestions = [...quiz.questions];
        const question = newQuestions[qIndex] as any;
        if (field.startsWith('option-')) {
            const optIndex = parseInt(field.split('-')[1]);
            question.options[optIndex] = value;
        } else {
            question[field] = value;
        }
        setQuiz(prev => ({ ...prev, questions: newQuestions }));
    };

    const handleCorrectAnswerChange = (qIndex: number, correctIndex: number) => {
        const newQuestions = [...quiz.questions];
        newQuestions[qIndex].correctAnswerIndex = correctIndex;
        setQuiz(prev => ({ ...prev, questions: newQuestions }));
    };
    
    const addQuestion = () => {
        setQuiz(prev => ({
            ...prev,
            questions: [...prev.questions, {id: `q${Date.now()}`, text: '', options: ['', '', '', ''], correctAnswerIndex: 0, imageUrl: '', videoUrl: ''}]
        }));
    };
    
    const removeQuestion = (qIndex: number) => {
        if(quiz.questions.length <= 1) {
            alert("A avaliação deve ter pelo menos uma questão.");
            return;
        }
        setQuiz(prev => ({
            ...prev,
            questions: prev.questions.filter((_, index) => index !== qIndex)
        }));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...quiz, id: initialData?.id ?? '' });
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <FormField label="Título da Avaliação"><TextInput name="title" value={quiz.title} onChange={handleQuizChange} required /></FormField>
            <FormField label="Descrição"><TextArea name="description" value={quiz.description} onChange={handleQuizChange} required /></FormField>
            
            <div className="flex items-center mt-4 p-3 rounded-md bg-slate-50 border border-border-color">
                <input
                    id="isVisible"
                    name="isVisible"
                    type="checkbox"
                    checked={!!quiz.isVisible}
                    onChange={handleQuizChange}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="isVisible" className="ml-3 block text-sm font-medium text-text-primary">
                    Tornar esta avaliação visível para os agentes
                </label>
            </div>
            
            <h4 className="text-lg font-semibold border-t border-border-color pt-4 mt-6">Questões</h4>
            <div className="space-y-6">
            {quiz.questions.map((q, qIndex) => (
                <div key={q.id} className="p-4 bg-slate-50 rounded-lg border border-border-color relative">
                    <p className="font-semibold mb-2">Questão {qIndex + 1}</p>
                    {quiz.questions.length > 1 && (
                        <button type="button" onClick={() => removeQuestion(qIndex)} className="absolute top-2 right-2 text-red-500 hover:text-red-700"><DeleteIcon/></button>
                    )}
                    <FormField label="Texto da Questão">
                        <TextInput value={q.text} onChange={e => handleQuestionChange(qIndex, 'text', e.target.value)} required />
                    </FormField>
                    <FormField label="URL da Imagem (Opcional)">
                        <TextInput type="url" value={q.imageUrl} placeholder="https://exemplo.com/imagem.png" onChange={e => handleQuestionChange(qIndex, 'imageUrl', e.target.value)} />
                    </FormField>
                    <FormField label="URL do Vídeo (Opcional)">
                        <TextInput type="url" value={q.videoUrl} placeholder="https://exemplo.com/video.mp4" onChange={e => handleQuestionChange(qIndex, 'videoUrl', e.target.value)} />
                    </FormField>
                    {q.options.map((opt, optIndex) => (
                         <FormField key={optIndex} label={`Opção ${optIndex + 1}`}>
                            <div className="flex items-center gap-2">
                               <TextInput value={opt} onChange={e => handleQuestionChange(qIndex, `option-${optIndex}`, e.target.value)} required />
                               <input type="radio" name={`correctAnswer-${qIndex}`} checked={q.correctAnswerIndex === optIndex} onChange={() => handleCorrectAnswerChange(qIndex, optIndex)} title="Marcar como correta" className="h-5 w-5 text-primary focus:ring-primary"/>
                            </div>
                        </FormField>
                    ))}
                </div>
            ))}
            </div>

            <button type="button" onClick={addQuestion} className="mt-4 text-primary font-semibold hover:underline">Adicionar Questão</button>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-border-color">
                <button type="button" onClick={onClose} className="bg-slate-200 text-text-secondary font-bold py-2 px-4 rounded-lg hover:bg-slate-300">Cancelar</button>
                <button type="submit" className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-dark">Salvar Avaliação</button>
            </div>
        </form>
    );
};

const AgentForm: React.FC<{initialData: Agent | null, onSave: (data: Agent) => void, onClose: () => void}> = ({ initialData, onSave, onClose }) => {
    const [data, setData] = useState<Partial<Agent>>({ name: '', email: '', role: 'agente', password: '' });

    useEffect(() => {
        if (initialData) {
            setData({ ...initialData, password: '' }); // Don't show existing password
        } else {
            setData({ name: '', email: '', role: 'agente', password: '' });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.name || !data.email) {
            alert("Nome e email são obrigatórios.");
            return;
        }
        if (!initialData && !data.password) {
            alert("A senha é obrigatória para novos usuários.");
            return;
        }

        const saveData: Agent = {
            id: initialData?.id ?? '', // App.tsx will generate ID if empty
            name: data.name,
            email: data.email,
            role: data.role || 'agente',
            password: data.password ? data.password : initialData?.password,
        };

        onSave(saveData);
        onClose();
    };

    return (
        <form onSubmit={handleSubmit}>
            <FormField label="Nome Completo"><TextInput name="name" value={data.name} onChange={handleChange} required /></FormField>
            <FormField label="Email"><TextInput name="email" type="email" value={data.email} onChange={handleChange} required /></FormField>
            <FormField label="Perfil">
                <Select name="role" value={data.role} onChange={handleChange}>
                    <option value="agente">Agente</option>
                    <option value="gestor">Gestor</option>
                </Select>
            </FormField>
            <FormField label={`Senha ${initialData ? '(deixe em branco para não alterar)' : ''}`}>
                <TextInput name="password" type="password" value={data.password || ''} onChange={handleChange} required={!initialData} placeholder={initialData ? "Nova senha" : ""} />
            </FormField>
            <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={onClose} className="bg-slate-200 text-text-secondary font-bold py-2 px-4 rounded-lg hover:bg-slate-300">Cancelar</button>
                <button type="submit" className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-dark">Salvar</button>
            </div>
        </form>
    );
};

const ResetPasswordForm: React.FC<{
    agent: Agent;
    onSave: (agent: Agent, newPassword: string) => void;
    onClose: () => void;
}> = ({ agent, onSave, onClose }) => {
    const [newPassword, setNewPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword.length < 6) {
            alert("A nova senha deve ter pelo menos 6 caracteres.");
            return;
        }
        onSave(agent, newPassword);
    };

    return (
        <form onSubmit={handleSubmit}>
            <p className="mb-4 text-text-secondary">
                Você está resetando a senha para o usuário <span className="font-bold text-text-primary">{agent.name}</span> (<span className="italic">{agent.email}</span>).
            </p>
            <FormField label="Nova Senha">
                <TextInput 
                    name="newPassword" 
                    type="password" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    required 
                    minLength={6}
                    placeholder="Digite a nova senha"
                    autoFocus
                />
            </FormField>
            <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={onClose} className="bg-slate-200 text-text-secondary font-bold py-2 px-4 rounded-lg hover:bg-slate-300">Cancelar</button>
                <button type="submit" className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-dark">Resetar Senha</button>
            </div>
        </form>
    );
};


export default AdminPage;