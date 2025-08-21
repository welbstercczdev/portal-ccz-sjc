import { defineConfig, loadEnv } from 'vite';
import { fileURLToPath } from 'url';
import path from 'path';

export default defineConfig(({ mode }) => {
    // Carrega as variáveis de ambiente do arquivo .env* na raiz do projeto
    const env = loadEnv(mode, process.cwd(), '');

    // Resolve o diretório atual de forma segura, compatível com ES Modules
    const __dirname = path.dirname(fileURLToPath(import.meta.url));

    return {
      // Define a base para o deploy no GitHub Pages (ou similar)
      base: '/portal-ccz-sjc/',
      
      // Define variáveis de ambiente globais para serem usadas no código do frontend
      define: {
        // Expõe a chave da API do Gemini para o frontend de forma segura
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        
        // ADICIONADO: Expõe a URL da API do Apps Script para o frontend
        'import.meta.env.VITE_API_BASE_URL': JSON.stringify(env.VITE_API_BASE_URL)
      },

      // Configura aliases para facilitar a importação de módulos
      resolve: {
        alias: {
          // Se sua pasta principal de código se chama 'src', use './src'. Se não, use '.'
          '@': path.resolve(__dirname, '.'), 
        }
      }
    };
});