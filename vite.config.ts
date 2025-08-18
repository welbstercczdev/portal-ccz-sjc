import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Substitua pelo seu nome de usuário do GitHub
const GITHUB_USER = 'welbstercczdev' 

// Substitua pelo nome do seu repositório no GitHub
const REPO_NAME = 'portal-ccz-sjc' 

export default defineConfig({
  plugins: [react()],
  // Configuração essencial para o GitHub Pages
  base: `/${REPO_NAME}/`, 
})