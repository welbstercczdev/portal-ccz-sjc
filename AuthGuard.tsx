import React, { useState, useEffect } from 'react';
import { Agent } from './types';
import App from './App';
import LoginPage from './pages/LoginPage';

// URL do seu backend no Apps Script
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwsazswwzHbNkjngS7PNz90afjxPnRdqUPSY0iCpwle7hqMVU9rUL0_-p8K0U-2tSbi/exec'; 

const AuthGuard: React.FC = () => {
  const [loggedInAgent, setLoggedInAgent] = useState<Agent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verifica se o usuário já está logado no localStorage quando a página carrega
  useEffect(() => {
    const agentData = localStorage.getItem('ccz_agent');
    if (agentData) {
      setLoggedInAgent(JSON.parse(agentData));
    }
    setIsLoading(false);
  }, []);

  // Função que chama o backend usando a técnica JSONP para contornar o CORS
  const handleLogin = (email: string, pass: string): Promise<boolean> => {
    
    // Cria um nome de função de callback único para evitar conflitos
    const callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());

    // Retorna uma Promise que será resolvida quando o backend responder
    return new Promise((resolve) => {
      // Cria a função de callback no objeto global 'window'
      window[callbackName] = (data: any) => {
        // Limpa o script e o callback da window para não deixar lixo
        document.body.removeChild(script);
        delete window[callbackName];

        // Processa a resposta do backend
        if (data.success && data.loggedIn) {
          const agentToStore = data.agent;
          localStorage.setItem('ccz_agent', JSON.stringify(agentToStore));
          setLoggedInAgent(agentToStore);
          resolve(true); // Login bem-sucedido
        } else {
          resolve(false); // Login falhou
        }
      };

      // Constrói a URL da API com todos os parâmetros necessários
      const url = new URL(SCRIPT_URL);
      url.searchParams.append('action', 'login');
      url.searchParams.append('email', email);
      url.searchParams.append('password', pass);
      url.searchParams.append('callback', callbackName); // Informa ao backend o nome da nossa função de callback

      // Cria a tag <script> que fará a "requisição"
      const script = document.createElement('script');
      script.src = url.toString();
      
      // Adiciona um manipulador de erro para casos de falha de rede
      script.onerror = () => {
        console.error("Erro ao carregar o script JSONP. Verifique a URL da API e a conexão.");
        document.body.removeChild(script);
        delete window[callbackName];
        alert("Não foi possível conectar ao servidor. Verifique sua conexão ou contate o suporte.");
        resolve(false);
      };

      // Adiciona o script à página para iniciar o download e a execução
      document.body.appendChild(script);
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('ccz_agent');
    setLoggedInAgent(null);
  };

  // Mostra uma tela de carregamento enquanto verifica o estado de login
  if (isLoading) {
    return <div className="flex h-screen w-screen items-center justify-center bg-background"><p>Carregando...</p></div>;
  }

  // Renderiza o App ou a página de Login com base no estado de autenticação
  if (loggedInAgent) {
    return <App loggedInAgent={loggedInAgent} onLogout={handleLogout} />;
  } else {
    return <LoginPage onLogin={handleLogin} />;
  }
};

export default AuthGuard;