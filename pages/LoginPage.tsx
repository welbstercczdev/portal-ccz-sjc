import React, { useState } from 'react';

interface LoginPageProps {
  onLogin: (email: string, pass: string) => boolean;
}

const Logo: React.FC = () => (
    <div className="flex items-center justify-center space-x-3 text-primary mb-8">
        <div className="bg-primary/10 rounded-lg p-3 shadow-md">
            <svg className="w-10 h-10 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L4 5v6.09c0 4.95 3.58 9.38 8 10.91c4.42-1.53 8-5.96 8-10.91V5L12 2zm-1 14.5l-3.5-3.5l1.41-1.41L11 13.67l5.59-5.59L18 9.5L11 16.5z" fill="currentColor"/>
            </svg>
        </div>
        <h1 className="text-3xl font-bold whitespace-nowrap text-text-primary">Portal CCZ SJC</h1>
    </div>
);


const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = onLogin(email, password);
    if (!success) {
      setError('E-mail ou senha inválidos. Tente novamente.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <main className="w-full max-w-md bg-surface p-8 rounded-2xl shadow-card border border-border-color animate-fade-in">
        <Logo />
        <h2 className="text-xl text-center text-text-secondary mb-8">Faça login para acessar o portal</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-border-color rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent transition"
              placeholder="seu.email@ccz.sjc.gov.br"
            />
          </div>
          <div>
            <label htmlFor="password"className="block text-sm font-medium text-text-primary mb-2">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-border-color rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent transition"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">{error}</p>
          )}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark transition-transform transform hover:scale-105"
            >
              Entrar
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default LoginPage;