
import { GoogleGenAI, Chat } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const systemInstruction = `
Você é um assistente especialista para agentes do Centro de Controle de Zoonoses (CCZ). 
Seu nome é 'IA-CCZ'.
Forneça informações técnicas claras, precisas e concisas, baseadas nas normas de saúde pública do Brasil e no conhecimento científico sobre zoonoses, controle de vetores, saúde animal e vigilância sanitária.
Sempre que possível, cite as fontes ou normas técnicas relacionadas (ex: "Conforme a Norma Técnica X do Ministério da Saúde...").
Seu tom deve ser profissional, educativo e direto. Responda exclusivamente em português do Brasil.
`;

export const startChat = (): Chat => {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.5,
      topP: 0.95,
      topK: 64,
    },
  });
};