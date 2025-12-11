import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult, SentenceType } from "../types";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key is missing");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeEssayBlock = async (text: string): Promise<AnalysisResult | null> => {
  const ai = getAiClient();
  if (!ai) return null;
  if (!text.trim()) return null;

  const prompt = `
    Analyze the following text which is part of an essay. 
    1. Break the text down into individual sentences.
    2. Classify each sentence based on its function:
       - CLAIM (Red): Presents an argument, main point, or topic sentence.
       - EVIDENCE (Blue): Provides facts, quotes, citations, or concrete examples.
       - REFLECTION (Green): Discusses the evidence, offers personal insight, analysis, or explanation.
       - NEUTRAL: Transitional phrases or standard descriptions that don't fit the above strictly.
    3. Calculate the percentage of each type (0-100).
    4. Provide a brief, constructive feedback tip (max 20 words) based on the balance. E.g., if there is too much evidence but no reflection, suggest adding personal thoughts.

    Text to analyze:
    "${text}"
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      sentences: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            type: { type: Type.STRING, enum: [SentenceType.CLAIM, SentenceType.EVIDENCE, SentenceType.REFLECTION, SentenceType.NEUTRAL] },
            suggestion: { type: Type.STRING, nullable: true },
          },
          required: ["text", "type"]
        }
      },
      balanceScore: {
        type: Type.OBJECT,
        properties: {
          claim: { type: Type.NUMBER },
          evidence: { type: Type.NUMBER },
          reflection: { type: Type.NUMBER }
        },
        required: ["claim", "evidence", "reflection"]
      },
      feedback: { type: Type.STRING }
    },
    required: ["sentences", "balanceScore", "feedback"]
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });

    const resultText = response.text;
    if (!resultText) return null;

    return JSON.parse(resultText) as AnalysisResult;

  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return null;
  }
};

export const getStructuralAdvice = async (blocks: string[]): Promise<string> => {
    const ai = getAiClient();
    if (!ai) return "AI services unavailable.";
  
    const prompt = `
      I have an essay structure with the following block types in order: ${blocks.join(', ')}.
      Is this a logical flow? If not, suggest a better order or what is missing in one sentence.
    `;
  
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      return response.text || "Structure looks okay.";
    } catch (error) {
      return "Could not analyze structure.";
    }
  };