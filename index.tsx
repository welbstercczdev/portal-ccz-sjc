 import React from 'react';
 import ReactDOM from 'react-dom/client';
 import AuthGuard from './AuthGuard'; // Mude a importação de App para AuthGuard
 
 const rootElement = document.getElementById('root');
 if (!rootElement) {
   throw new Error("Could not find root element to mount to");
 }
 
 const root = ReactDOM.createRoot(rootElement);
 root.render(
   <React.StrictMode>
     <AuthGuard /> {/* Renderize o AuthGuard */}
   </React.StrictMode>
 );