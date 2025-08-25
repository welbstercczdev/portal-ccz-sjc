import React from 'react';
import Spinner from './Spinner';

const LoadingScreen: React.FC<{ message?: string }> = ({ message = "Carregando Portal..." }) => {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-background text-text-primary gap-4">
      <Spinner size="lg" />
      <p className="text-lg font-semibold text-text-secondary animate-pulse">{message}</p>
    </div>
  );
};

export default LoadingScreen;