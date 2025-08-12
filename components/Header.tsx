
import React from 'react';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header>
      <h2 className="text-4xl font-extrabold text-text-primary tracking-tight">{title}</h2>
    </header>
  );
};

export default Header;