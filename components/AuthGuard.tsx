import React, { useState, useEffect } from 'react';
import { AGENTS } from '../data';
import { Agent } from '../types';
import App from '../App';
import LoginPage from '../pages/LoginPage';

const SCRIPT_URL = 'URL_DO_SEU_APP_DA_WEB_AQUI'; // Cole a URL que você copiou

const AuthGuard: React.FC = () => {
  const [loggedInAgent, setLoggedInAgent] = useState<Agent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const agentData = localStorage.getItem('ccz_agent');
    if (agentData) {
      setLoggedInAgent(JSON.parse(agentData));
    }
    setIsLoading(false);
  }, []);

  const handleLogin = async (email: string, pass: string): Promise<boolean> => {
    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'cors', // Necessário para requisições cross-origin
        headers: {
          'Content-Type': 'text/plain;charset=utf-8', // Apps Script espera text/plain para doPost simples
        },
        body: JSON.stringify({ action: 'login', email: email, password: pass }),
      });
      const result = await response.json();
      
      if (result.success && result.data.loggedIn) {
        // Remove a senha antes de salvar no estado e no localStorage
        const { password, ...agentToStore } = result.data.agent;
        localStorage.setItem('ccz_agent', JSON.stringify(agentToStore));
        setLoggedInAgent(agentToStore);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('ccz_agent');
    setLoggedInAgent(null);
  };

  if (isLoading) {
    return <div className="flex h-screen w-screen items-center justify-center bg-background"><p>Carregando...</p></div>;
  }

  if (loggedInAgent) {
    return <App loggedInAgent={loggedInAgent} onLogout={handleLogout} />;
  } else {
    return <LoginPage onLogin={handleLogin} />;
  }
};

export default AuthGuard;
