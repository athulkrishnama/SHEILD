import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Predict gift price using Google Gemini AI
 * @param {string} giftName - Name of the gift
 * @returns {Promise<number>} - Estimated price in INR
 */
export async function predictGiftPrice(giftName) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY not found, using default price");
      return 5000; // Default fallback price
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

    const prompt = `Estimate the average market price in Indian Rupees (INR) for the following gift item: "${giftName}". 
Respond with ONLY a number (the price), nothing else. 
Consider current market prices in India for typical consumer products.
Example response: 45000`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const priceText = response.text().trim();

    // Extract only numbers from the response
    const price = parseInt(priceText.replace(/[^0-9]/g, ""));

    // Validate price is reasonable (between 100 and 1,000,000)
    if (isNaN(price) || price < 100 || price > 1000000) {
      console.warn(
        `Invalid price prediction for ${giftName}: ${priceText}, using default`
      );
      return 5000;
    }

    return price;
  } catch (error) {
    console.error("Error predicting gift price:", error.message);
    return 5000; // Default fallback price
  }
}
