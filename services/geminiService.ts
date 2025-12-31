import { GoogleGenAI } from "@google/genai";
import { PROMPT_A_TEMPLATE, PROMPT_B_TEMPLATE, formatRegisterForPrompt } from "../constants";
import { Idea } from "../types";

const getAIClient = () => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is missing.");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateDiscoveryIdeas = async (
  domain: string,
  existingIdeas: Idea[]
): Promise<string> => {
  const ai = getAIClient();
  const dateStr = new Date().toLocaleDateString();
  const registerStr = formatRegisterForPrompt(existingIdeas);
  
  const prompt = PROMPT_A_TEMPLATE(dateStr, registerStr, domain);
  
  // Using gemini-2.0-flash as requested in prompt instructions, mapping to closest available or falling back to a supported one.
  // The system instruction says: "gemini-3-flash-preview" for basic tasks. 
  // However, the prompt B specifically mentions "gemini-2.0-flash". 
  // I will use "gemini-3-flash-preview" as the engine but keep the prompt text requesting the model behavior.
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview', 
    contents: prompt,
    config: {
        thinkingConfig: { thinkingBudget: 0 } // Disable thinking for faster speed on discovery
    }
  });

  return response.text || "No response generated.";
};

export const generateBuildSpec = async (
  winnerName: string,
  winnerPitch: string
): Promise<string> => {
  const ai = getAIClient();
  
  const prompt = PROMPT_B_TEMPLATE(winnerName, winnerPitch);

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview', // Use a smarter model for the technical spec
    contents: prompt,
    config: {
        thinkingConfig: { thinkingBudget: 2048 } // Enable some thinking for architectural decisions
    }
  });

  return response.text || "No specification generated.";
};
