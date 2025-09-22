
import { GoogleGenAI, Chat, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This will be visible in the browser's developer console.
  throw new Error("API_KEY environment variable not set. Please add it to your project configuration.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const systemInstruction = `You are "Springwell", an expert AI assistant for analyzing groundwater data in India. 
Your purpose is to provide clear, concise, and actionable insights to farmers, policymakers, and researchers. 
You are an expert in all major Indian languages including English, Hindi, Tamil, Telugu, Kannada, Malayalam, Bengali, Marathi, Gujarati, and Punjabi.
When a user asks a question, you MUST detect their language and respond in the EXACT SAME language in the 'responseText'.

You have special capabilities to control the application's UI. When a user's request implies an action, you must format your response as a JSON object matching the provided schema.

Available actions:
1.  'text_only': For general conversation, questions, and greetings.
2.  'navigate': When the user wants to go to a specific section ('map' or 'analytics').
3.  'show_on_map': When the user asks to visualize data on the map. You must identify the location (an Indian state) and the data layer ('groundwater', 'rainfall', 'stress').
4.  'create_chart': When the user wants a new chart. You must identify the location, the chart type ('bar' or 'line'), and create a descriptive title.
5.  'add_marker': When the user wants to add a marker on the map. You must provide lat, lng coordinates and popup text.

Always provide a friendly 'responseText' confirming the action or answering the question.

Example user queries and your JSON responses:
- User: "Hello there" -> {"action": "text_only", "responseText": "Hello! How can I help you with India's groundwater data today?"}
- User: "Take me to the map" -> {"action": "navigate", "tab": "map", "responseText": "Navigating to the interactive map."}
- User: "Show me groundwater levels in Tamil Nadu" -> {"action": "show_on_map", "location": "Tamil Nadu", "layer": "groundwater", "responseText": "Certainly! Displaying groundwater levels for Tamil Nadu on the map."}
- User: "Generate a bar chart for rainfall in Kerala" -> {"action": "create_chart", "chartType": "bar", "location": "Kerala", "title": "Annual Rainfall in Kerala", "responseText": "I've created a bar chart showing rainfall data for Kerala on the analytics page."}
- User: "Mark the location at 13.0827, 80.2707 with 'Chennai City'" -> {"action": "add_marker", "lat": 13.0827, "lng": 80.2707, "popup": "Chennai City", "responseText": "I've added a marker for Chennai City on the map."}
`;

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    action: {
      type: Type.STRING,
      enum: ["navigate", "show_on_map", "create_chart", "add_marker", "text_only"],
      description: "The action to perform in the UI. Use 'text_only' for general conversation.",
    },
    tab: { type: Type.STRING, enum: ["chat", "map", "analytics"], description: "The tab to navigate to. Used with 'navigate' action." },
    location: { type: Type.STRING, description: "The Indian state or major city. Used with 'show_on_map' or 'create_chart'." },
    layer: { type: Type.STRING, enum: ["groundwater", "rainfall", "stress"], description: "The data layer to display on the map. Used with 'show_on_map'." },
    chartType: { type: Type.STRING, enum: ["bar", "line"], description: "The type of chart to create. Used with 'create_chart'." },
    title: { type: Type.STRING, description: "A descriptive title for the chart. Used with 'create_chart'." },
    lat: { type: Type.NUMBER, description: "Latitude for the marker. Used with 'add_marker'." },
    lng: { type: Type.NUMBER, description: "Longitude for the marker. Used with 'add_marker'." },
    popup: { type: Type.STRING, description: "Popup text for the marker. Used with 'add_marker'." },
    responseText: {
      type: Type.STRING,
      description: "A friendly, conversational response to show to the user in the chat. This should always be present.",
    },
  },
  required: ["action", "responseText"]
};


export const initializeChat = (): Chat => {
    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: systemInstruction,
            // FIX: Set the response schema and MIME type during chat initialization, as it's not supported per-message.
            responseMimeType: 'application/json',
            responseSchema: responseSchema,
        }
    });
    return chat;
};

export interface AiActionResponse {
    action: 'navigate' | 'show_on_map' | 'create_chart' | 'add_marker' | 'text_only';
    tab?: 'chat' | 'map' | 'analytics';
    location?: string;
    layer?: 'groundwater' | 'rainfall' | 'stress';
    chartType?: 'bar' | 'line';
    title?: string;
    lat?: number;
    lng?: number;
    popup?: string;
    responseText: string;
}


export const getAiResponse = async (chat: Chat, message: string): Promise<AiActionResponse> => {
    try {
        // FIX: Removed invalid 'generationConfig' property. Configuration is handled during chat initialization.
        const result = await chat.sendMessage({
          message,
        });
        
        const responseText = result.text;
        // Basic cleanup in case the model returns markdown noise
        const cleanedText = responseText.replace(/^```json\n/, '').replace(/\n```$/, '');
        const parsedResponse = JSON.parse(cleanedText) as AiActionResponse;
        return parsedResponse;

    } catch (error) {
        console.error("Error sending message to Gemini or parsing response:", error);
        // Fallback to a simple text response on error
        return {
            action: 'text_only',
            responseText: "I'm sorry, I encountered an error. Could you please rephrase your request?"
        };
    }
};
