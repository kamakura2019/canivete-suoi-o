import { GoogleGenAI } from "@google/genai";
import { PromptRequestPayload, ToolType, GeneratedResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const TEXT_MODEL_NAME = 'gemini-2.5-flash';
const IMAGE_MODEL_NAME = 'gemini-2.5-flash-image';

const buildSystemInstruction = (payload: PromptRequestPayload): string => {
  const baseInstruction = `Você é o "Canivete Suíço AI", um assistente especializado em Engenharia de Prompts. 
  Sua tarefa é ajudar o usuário a obter o melhor resultado possível de LLMs.
  Responda sempre em Português do Brasil (PT-BR).
  
  Contexto da Categoria: ${payload.category.systemContext}
  `;

  switch (payload.toolType) {
    case ToolType.GENERATOR:
      return `${baseInstruction}
      OBJETIVO: Crie um prompt altamente detalhado e estruturado com base na ideia do usuário.
      ESTRUTURA: Use técnicas como Persona, Contexto, Tarefa, Restrições e Formato de Saída.
      SAÍDA: Forneça apenas o prompt otimizado, pronto para ser copiado.`;
      
    case ToolType.REFINER:
      return `${baseInstruction}
      OBJETIVO: Reescreva o prompt do usuário para torná-lo mais claro, específico e eficaz.
      AÇÃO: Identifique ambiguidades e remova redundâncias. Adicione diretrizes de estilo se necessário.
      SAÍDA: Forneça a versão melhorada do prompt.`;

    case ToolType.PERSONA:
      return `${baseInstruction}
      OBJETIVO: Crie uma "System Instruction" ou definição de Persona robusta.
      DETALHES: Inclua tom de voz, base de conhecimento permitida e restrições de comportamento.
      SAÍDA: O texto da persona pronto para uso.`;

    case ToolType.ANALYZER:
      return `${baseInstruction}
      OBJETIVO: Analise o prompt do usuário e dê notas de 0 a 10 em: Clareza, Especificidade e Contexto.
      AÇÃO: Liste 3 pontos fortes e 3 sugestões de melhoria.
      SAÍDA: Um relatório estruturado de análise.`;
      
    default:
      return baseInstruction;
  }
};

export const generatePromptResponse = async (payload: PromptRequestPayload): Promise<GeneratedResult> => {
  try {
    
    // IMAGE EDITING FLOW
    if (payload.toolType === ToolType.IMAGE_EDITOR && payload.image) {
      // Remove data URL prefix if present (e.g. "data:image/png;base64,")
      const base64Data = payload.image.split(',')[1] || payload.image;
      
      const response = await ai.models.generateContent({
        model: IMAGE_MODEL_NAME,
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: 'image/png' // Assuming png or jpeg, API handles both
              }
            },
            {
              text: payload.input || "Enhance this image"
            }
          ]
        }
      });

      // Iterate through parts to find the image part
      if (response.candidates?.[0]?.content?.parts) {
         for (const part of response.candidates[0].content.parts) {
           if (part.inlineData) {
             const imgBase64 = part.inlineData.data;
             return {
               content: `data:image/png;base64,${imgBase64}`,
               type: 'image'
             };
           }
         }
      }
      return { content: "Não foi possível gerar a imagem. Tente uma instrução diferente.", type: 'text' };
    }

    // TEXT GENERATION FLOW
    const systemInstruction = buildSystemInstruction(payload);
    const response = await ai.models.generateContent({
      model: TEXT_MODEL_NAME,
      contents: payload.input,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
      }
    });

    if (response.text) {
      return { content: response.text, type: 'text' };
    }
    
    throw new Error("Nenhuma resposta de texto foi gerada.");

  } catch (error) {
    console.error("Erro ao chamar Gemini API:", error);
    return { 
      content: "Desculpe, ocorreu um erro ao processar sua solicitação. Verifique se o arquivo não é muito grande e tente novamente.", 
      type: 'text' 
    };
  }
};