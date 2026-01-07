import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google AI client with API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

/**
 * Analyzes a food image using Google Gemini AI
 * @param {Object} imageData - Image data with base64 encoding
 * @returns {Promise<Object>} Nutrition data (food name, calories, protein, sugar)
 */
export const analyzeImage = async (imageData) => {
  try {
    // Get the Gemini 3 Flash model (fast and efficient for image analysis)
    const model = genAI.getGenerativeModel({
      model: "models/gemini-3-flash-preview",
    });

    // Prompt instructing the AI what to do
    const prompt =
      'Identify food and count nutritional values. if possible be precise with the values and quantity. Return strictly JSON: { "food": "Name", "calories": 564, "sugar": "2.8g", "protein": "33.3g" }. (if image is not food reurn the identified object nae with other valures nulled feeel free to be funny in that case just be very short)';

    // Send image and prompt to AI
    const result = await model.generateContent([
      prompt,
      { inlineData: { data: imageData.base64, mimeType: "image/jpeg" } },
    ]);

    // Parse the AI response
    // Remove markdown code blocks if present and parse JSON
    const responseText = result.response.text();
    const cleanText = responseText.replace(/```json|```/g, "").trim();
    const data = JSON.parse(cleanText);

    return data;
  } catch (err) {
    console.error("AI Analysis Error:", err);
    throw new Error("Failed to analyze image. Please try again.");
  }
};
