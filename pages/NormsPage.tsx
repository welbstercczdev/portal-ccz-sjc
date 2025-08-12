
import React, { useState, useMemo } from 'react';
import { NormDocument } from '../types';

interface NormsPageProps {
  norms: NormDocument[];
}

const NormsPage: React.FC<NormsPageProps> = ({ norms }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNorms = useMemo(() => {
    if (!searchTerm) {
      return norms;
    }
    return norms.filter(norm =>
      norm.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      norm.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, norms]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <input
          type="text"
          placeholder="Buscar por título ou código da norma..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-lg p-3 border border-border-color rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
          aria-label="Buscar normas"
        />
      </div>

      <div className="space-y-4">
        {filteredNorms.map((norm, index) => (
          <div key={norm.id} className="bg-surface p-5 rounded-lg shadow-card border-l-4 border-primary transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 animate-stagger-item-in" style={{ animationDelay: `${index * 50}ms` }}>
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-bold text-primary flex-1 pr-4">{norm.title}</h3>
              <span className="text-sm font-semibold text-text-secondary bg-slate-100 px-3 py-1 rounded-full whitespace-nowrap">{norm.code}</span>
            </div>
            <p className="mt-2 text-text-secondary">{norm.summary}</p>
            <a 
              href={norm.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary font-semibold mt-4 inline-block hover:underline"
            >
              Ver documento completo &rarr;
            </a>
          </div>
        ))}
         {filteredNorms.length === 0 && (
          <div className="text-center p-12 bg-surface rounded-lg shadow-card animate-fade-in">
            <p className="text-text-secondary text-lg">Nenhuma norma encontrada com o termo <span className="font-semibold text-text-primary">"{searchTerm}"</span>.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NormsPage;
