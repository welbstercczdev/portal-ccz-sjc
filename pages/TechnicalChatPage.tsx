
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chat } from '@google/genai';
import { ChatMessage } from '../types';
import { startChat } from '../services/geminiService';

const UserIcon = () => (
    <div className="w-9 h-9 rounded-lg bg-blue-400 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-inner border-2 border-white/50">
        A
    </div>
);

const ModelIcon = () => (
    <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white font-bold flex-shrink-0 shadow-inner">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
        </svg>
    </div>
);

const TypingIndicator = () => (
    <div className="flex items-center space-x-1.5 p-4">
        <div className="h-2 w-2 bg-primary-dark rounded-full animate-typing-dot"></div>
        <div className="h-2 w-2 bg-primary-dark rounded-full animate-typing-dot" style={{animationDelay: '0.2s'}}></div>
        <div className="h-2 w-2 bg-primary-dark rounded-full animate-typing-dot" style={{animationDelay: '0.4s'}}></div>
    </div>
);

const TechnicalChatPage: React.FC = () => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', content: 'Olá! Eu sou o IA-CCZ, seu assistente virtual para consultas técnicas. Estou aqui para ajudar com informações sobre zoonoses, controle de vetores e normas de saúde pública. Como posso auxiliá-lo hoje?' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const initChat = useCallback(() => {
    try {
        const chatSession = startChat();
        setChat(chatSession);
    } catch (error) {
        console.error("Error initializing chat:", error);
        setMessages([{ role: 'model', content: "Desculpe, não foi possível iniciar o assistente de IA. Verifique a configuração da API e tente novamente." }]);
    }
  }, []);

  useEffect(() => {
    initChat();
  }, [initChat]);

  useEffect(() => {
    if (chatContainerRef.current) {
        setTimeout(() => {
            chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
        }, 100);
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || !chat || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: userInput };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = userInput;
    setUserInput('');
    setIsLoading(true);

    try {
      const stream = await chat.sendMessageStream({ message: currentInput });
      
      let modelResponse = '';
      setMessages(prev => [...prev, { role: 'model', content: '' }]);

      for await (const chunk of stream) {
        modelResponse += chunk.text;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content = modelResponse;
          return newMessages;
        });
      }

    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage.role === 'model' && lastMessage.content === '') {
            lastMessage.content = "Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.";
        } else {
            newMessages.push({role: 'model', content: "Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente."});
        }
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-surface shadow-card rounded-xl overflow-hidden border border-border-color">
      <div ref={chatContainerRef} className="flex-1 p-6 space-y-6 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-end gap-3 animate-stagger-item-in ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'model' && <ModelIcon />}
            <div className={`max-w-xl p-3.5 rounded-2xl shadow-sm ${msg.role === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-slate-100 text-text-primary rounded-bl-none'}`}>
              <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
            </div>
             {msg.role === 'user' && <UserIcon />}
          </div>
        ))}
        {isLoading && (
            <div className="flex items-end gap-3 justify-start animate-stagger-item-in">
                <ModelIcon />
                <div className="max-w-xl rounded-2xl shadow-sm bg-slate-100 rounded-bl-none">
                    <TypingIndicator />
                </div>
            </div>
        )}
      </div>
      <div className="p-4 bg-slate-50/70 border-t border-border-color">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder={isLoading ? "IA-CCZ está respondendo..." : "Digite sua pergunta técnica..."}
            className="w-full p-3 border border-border-color rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
            disabled={isLoading}
            aria-label="Chat input"
          />
          <button
            type="submit"
            disabled={isLoading || !userInput.trim()}
            className="bg-primary text-white p-3 rounded-lg disabled:bg-slate-400 disabled:cursor-not-allowed hover:bg-primary-dark transition-all duration-200 transform hover:scale-105 shadow-md disabled:shadow-none disabled:transform-none flex-shrink-0"
            aria-label="Send message"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default TechnicalChatPage;