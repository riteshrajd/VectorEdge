'use server'

import { CombinedData } from "@/types/types";
import axios from "axios";
import { fetchUser } from "./fetchUser";

// Define the structure for the function's return value
interface Response {
  success: boolean;
  data?: string; // The AI's text response will be stored here
  error?: string;
}

/**
 * Generates an AI response based on a user's message and provided stock data.
 * This is a Next.js Server Action and runs exclusively on the server.
 * @param userMessage The user's question or prompt.
 * @param data The combined stock data to use as context for the AI.
 * @returns A promise that resolves to a Response object.
 */
export async function generateAIResponse(
  userMessage: string,
  data: CombinedData
): Promise<Response> {

  const res = await fetchUser();
  
  if(!res.success || !res.data?.is_paid_member) {
    return {
      success: true,
      data: "Get Premium to enable this feature"   
    }
  }
  // Safely access server-side environment variables
  const API_KEY = process.env.GEMINI_API_KEY;
  const API_URL = process.env.GEMINI_API_URL;

  // Validate that API credentials are set
  if (!API_KEY || !API_URL) {
    console.error("Gemini API key or URL not found in environment variables.");
    return {
      success: false,
      error: "Server configuration error: Missing API credentials.",
    };
  }

  // Construct a detailed prompt for the AI
  const prompt = `
    You are VectorEdge, a helpful financial assistant. A user is asking a question about the stock ${data.ticker}. 
    Use the provided data to answer their question accurately and concisely.

    User's Question: "${userMessage}"

    Contextual Data - ${JSON.stringify(data)}

    Based on this data, answer the user's question. If the data is insufficient, state that clearly.
    Provide the answer as a clean, direct text response.
  `;

  try {
    // Make the API call to the Gemini model
    const geminiResponse = await axios.post(
      `${API_URL}?key=${API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1000,
        },
      },
      { headers: { "Content-Type": "application/json" } }
    );

    // Safely extract the text from the API response
    const responseText = geminiResponse.data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      console.error("Invalid response structure from Gemini API:", geminiResponse.data);
      return { success: false, error: "Failed to get a valid response from the AI." };
    }

    // Return the successful response
    return { success: true, data: responseText };

  } catch (err) {
    // Handle network errors or other exceptions
    const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
    console.error(`Error in generateAIResponse for ${data.ticker}: ${errorMessage}`);
    
    // Provide more specific error details if available from Axios
    if (axios.isAxiosError(err) && err.response) {
      console.error('Axios error details:', err.response.data);
      const apiError = err.response.data.error?.message || errorMessage;
      return {
        success: false,
        error: `API request failed: ${apiError}`,
      };
    }

    return { success: false, error: `Request failed: ${errorMessage}` };
  }
}