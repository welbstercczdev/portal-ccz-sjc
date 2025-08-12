import React, { useState, useEffect } from 'react';
import { AGENTS } from '../data';
import { Agent } from '../types';
import App from '../App';
import LoginPage from '../pages/LoginPage';

const AuthGuard: React.FC = () => {
  const [loggedInAgent, setLoggedInAgent] = useState<Agent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage for a logged in user
    const agentId = localStorage.getItem('ccz_agent_id');
    if (agentId) {
      const agent = AGENTS.find(a => a.id === agentId);
      if (agent) {
        setLoggedInAgent(agent);
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (email: string, pass: string): boolean => {
    const agent = AGENTS.find(a => a.email.toLowerCase() === email.toLowerCase() && a.password === pass);
    if (agent) {
      localStorage.setItem('ccz_agent_id', agent.id);
      setLoggedInAgent(agent);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    localStorage.removeItem('ccz_agent_id');
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
