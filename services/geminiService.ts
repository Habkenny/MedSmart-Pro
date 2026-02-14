
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getMedicationInsights = async (medicationName: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a clear, concise summary of the medication: ${medicationName}. 
      Include: 
      1. Primary use. 
      2. Common side effects. 
      3. Key warnings/interactions. 
      4. Best time to take it.
      
      Keep it professional but easy for a patient to understand. Add a disclaimer that this is AI-generated and not professional medical advice.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm sorry, I couldn't retrieve information for that medication at this time.";
  }
};

export const findProviders = async (query: string, location?: { latitude: number, longitude: number }) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite-latest",
      contents: `Find high-quality healthcare providers or clinics matching: ${query}. Focus on providing helpful details like specialty, rating, and what they are known for.`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: location ? {
              latitude: location.latitude,
              longitude: location.longitude
            } : undefined
          }
        }
      },
    });

    const text = response.text;
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    return { text, sources };
  } catch (error) {
    console.error("Maps Grounding Error:", error);
    return { text: "I encountered an error searching for providers. Please try again later.", sources: [] };
  }
};

export const analyzeMedicationImage = async (base64Image: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: "Analyze this image of a medication or its packaging. Identify the medication name if visible, and explain what it's for. If it's a pill, describe its likely purpose based on physical characteristics if known." }
        ]
      }
    });
    return response.text;
  } catch (error) {
    console.error("Image Analysis Error:", error);
    return "Could not analyze the image. Please try again or type the medication name.";
  }
};

export const checkInteractions = async (medications: string[]) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Evaluate potential interactions between these medications: ${medications.join(', ')}. 
      Highlight any serious risks and provide simple advice.`,
    });
    return response.text;
  } catch (error) {
    console.error("Interaction Check Error:", error);
    return "Error checking interactions.";
  }
};
