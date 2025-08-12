import React, { useState, useEffect } from 'react';
import { TrainingMaterial } from '../types';

interface TrainingPageProps {
  materials: TrainingMaterial[];
  onToggleCompletion: (id: number) => void;
}

const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => {
    const [width, setWidth] = useState(0);
    useEffect(() => {
        const timer = setTimeout(() => setWidth(progress), 100);
        return () => clearTimeout(timer);
    }, [progress]);

    return (
        <div className="w-full bg-slate-200 rounded-full h-2.5">
            <div className="bg-primary h-2.5 rounded-full transition-all duration-1000 ease-out" style={{ width: `${width}%` }}></div>
        </div>
    );
};

const TrainingCard: React.FC<{ material: TrainingMaterial, index: number, onToggleCompletion: (id: number) => void }> = ({ material, index, onToggleCompletion }) => {
  const typeStyles = {
    'Vídeo': 'bg-green-100 text-green-800 border-green-200',
    'Artigo': 'bg-blue-100 text-blue-800 border-blue-200',
    'Apresentação': 'bg-sky-100 text-sky-800 border-sky-200',
  };

  return (
    <div className={`bg-surface rounded-xl shadow-card overflow-hidden transition-all duration-300 flex flex-col animate-stagger-item-in ${material.completed ? 'bg-slate-50' : 'hover:shadow-card-hover hover:-translate-y-1'}`} style={{ animationDelay: `${index * 75}ms` }}>
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-3">
            <h3 className={`text-xl font-bold text-text-primary pr-4 ${material.completed ? 'line-through text-text-secondary' : ''}`}>{material.title}</h3>
            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full whitespace-nowrap border ${typeStyles[material.type]} ${material.completed ? 'opacity-60' : ''}`}>
                {material.type}
            </span>
        </div>
        <p className={`text-text-secondary mb-4 flex-grow ${material.completed ? 'line-through' : ''}`}>{material.description}</p>
      </div>
       <div className="p-6 pt-4 border-t border-border-color flex justify-between items-center">
        <a 
          href={material.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className={`inline-block text-white font-bold py-2 px-5 rounded-lg transition-colors ${material.completed ? 'bg-slate-400' : 'bg-primary hover:bg-primary-dark'}`}
        >
          Acessar Material
        </a>
        <div className="flex items-center">
            <input
                type="checkbox"
                id={`complete-${material.id}`}
                checked={material.completed}
                onChange={() => onToggleCompletion(material.id)}
                className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
            />
            <label htmlFor={`complete-${material.id}`} className="ml-2 text-sm font-medium text-text-secondary cursor-pointer">
                {material.completed ? 'Concluído' : 'Concluir'}
            </label>
        </div>
      </div>
    </div>
  );
};

const TrainingPage: React.FC<TrainingPageProps> = ({ materials, onToggleCompletion }) => {
  const completedCount = materials.filter(m => m.completed).length;
  const totalCount = materials.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div>
      <div className="bg-surface p-6 rounded-xl shadow-card border border-border-color mb-8 animate-fade-in">
        <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold text-text-primary">Seu Progresso de Capacitação</h2>
            <span className="text-2xl font-bold text-primary">{progressPercentage.toFixed(0)}%</span>
        </div>
        <p className="text-text-secondary mb-4">Você concluiu <span className="font-semibold text-text-primary">{completedCount} de {totalCount}</span> módulos. Continue assim!</p>
        <ProgressBar progress={progressPercentage} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {materials.map((material, index) => (
          <TrainingCard key={material.id} material={material} index={index} onToggleCompletion={onToggleCompletion} />
        ))}
      </div>
    </div>
  );
};

export default TrainingPage;