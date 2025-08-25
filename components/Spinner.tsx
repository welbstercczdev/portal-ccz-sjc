import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', color = 'border-primary', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
  };

  return (
    <div
      className={`animate-spin rounded-full border-2 ${color} border-t-transparent ${sizeClasses[size]} ${className}`}
      role="status"
      aria-live="polite"
      aria-label="Carregando"
    />
  );
};

export default Spinner;