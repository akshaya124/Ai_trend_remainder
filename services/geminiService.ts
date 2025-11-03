
import { GoogleGenAI, Type } from "@google/genai";
import { AITrendUpdate } from '../types';

// FIX: Initialize the GoogleGenAI client with the API key from environment variables directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const prompt = `
Act as a personal AI Trend Reminder & Guide Agent for an aspiring AI developer named Akshaya. Your objective is to generate the content for a daily AI trend reminder.

Base your information on authentic and recent developments from sources like the OpenAI Blog, Hugging Face Blog, TechCrunch AI, Google AI Blog, and ArXiv's Computer Science section (cs.AI).

For each trend, find a visually appealing and relevant image and provide its direct URL in the 'imageUrl' field. The image should be high-quality and suitable for a web application.

For the 'How to act' section of each trend, provide a concise, actionable strategy (e.g., 2-3 steps or bullet points) on how to learn about or apply the trend. This strategy should guide the user on their next steps. Then, provide a link to a specific, high-quality resource.

Generate a JSON object with the specified schema. Do not include any text outside of the JSON object. The content should be friendly, energetic, and concise.
`;

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    greeting: {
      type: Type.STRING,
      description: "A short, energetic greeting."
    },
    trends: {
      type: Type.ARRAY,
      description: "An array of the top 3 AI trends.",
      items: {
        type: Type.OBJECT,
        properties: {
          title: {
            type: Type.STRING,
            description: "The name of the AI trend."
          },
          happening: {
            type: Type.STRING,
            description: "A short, 2-3 line explanation of what's happening with the trend."
          },
          matters: {
            type: Type.STRING,
            description: "How this trend impacts AI users or creators."
          },
          action: {
            type: Type.OBJECT,
            properties: {
              strategy: {
                type: Type.STRING,
                description: "A concise, actionable strategy (e.g., 2-3 steps or bullet points) on how to learn or apply the trend."
              },
              text: {
                type: Type.STRING,
                description: "The title or description of the resource link (e.g., 'Explore the GitHub Repo')."
              },
              link: {
                type: Type.STRING,
                description: "The URL to the actionable resource."
              }
            },
            required: ['strategy', 'text', 'link']
          },
          imageUrl: {
            type: Type.STRING,
            description: "A direct URL to a relevant and high-quality image for the trend."
          }
        },
        required: ['title', 'happening', 'matters', 'action', 'imageUrl']
      }
    },
    closing: {
      type: Type.STRING,
      description: "An inspiring closing message."
    }
  },
  required: ['greeting', 'trends', 'closing']
};


export const fetchAITrends = async (): Promise<AITrendUpdate> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7,
      },
    });

    const jsonText = response.text.trim();
    const data = JSON.parse(jsonText);
    
    // Quick validation
    if (!data.greeting || !data.trends || !data.closing || data.trends.length === 0) {
        throw new Error("Invalid data structure received from API.");
    }

    return data as AITrendUpdate;
  } catch (error) {
    console.error("Error fetching AI trends:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to fetch AI trends: ${error.message}`);
    }
    throw new Error("An unknown error occurred while fetching AI trends.");
  }
};