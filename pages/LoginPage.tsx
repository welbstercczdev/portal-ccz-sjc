import React, { useState } from 'react';

// Define as propriedades que o componente LoginPage espera receber.
// Neste caso, é a função onLogin que vem do AuthGuard.
interface LoginPageProps {
  onLogin: (email: string, pass: string) => Promise<boolean>;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  // Estados para controlar os inputs do formulário
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Estado para feedback ao usuário
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Função chamada quando o formulário é enviado
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Impede o recarregamento padrão da página
    setError(null);
    setIsLoading(true);

    try {
      // Chama a função onLogin passada pelo AuthGuard
      const loginSuccess = await onLogin(email, password);

      // Se o login falhar, mostra uma mensagem de erro
      if (!loginSuccess) {
        setError('Email ou senha inválidos. Por favor, tente novamente.');
      }
      // Se o login for bem-sucedido, o AuthGuard irá redirecionar automaticamente.
    } catch (err) {
      setError('Ocorreu um erro ao tentar fazer login. Verifique sua conexão.');
    } finally {
      setIsLoading(false); // Para de mostrar o estado de carregamento
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background font-sans">
      <div className="w-full max-w-md p-8 space-y-8 bg-surface rounded-2xl shadow-card m-4">
        <div className="text-center">
            <div className="inline-block bg-primary text-white p-3 rounded-xl mb-4 shadow-lg">
                <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L4 5v6.09c0 4.95 3.58 9.38 8 10.91c4.42-1.53 8-5.96 8-10.91V5L12 2zm-1 14.5l-3.5-3.5l1.41-1.41L11 13.67l5.59-5.59L18 9.5L11 16.5z" fill="currentColor"/>
                </svg>
            </div>
          <h1 className="text-3xl font-extrabold text-text-primary">
            Portal do Agente
          </h1>
          <p className="mt-2 text-text-secondary">
            Faça login para acessar o sistema
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
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
                placeholder="Email"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
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
                placeholder="Senha"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 text-center text-sm text-red-800 bg-red-100 border border-red-200 rounded-lg animate-shake">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-lg font-bold rounded-lg text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark transition-all duration-300 disabled:bg-slate-400"
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;