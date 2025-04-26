import axios from "axios"

const API_KEY = 'AIzaSyCy4-wPjHJB03w-spa2IvcOIJbb9WOyB7o'  // Best practice: use .env

export const fetchGeminiResponse = async (userMessage: string): Promise<string> => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`

  try {
    const response = await axios.post(url, {
      contents: [
        {
          parts: [{ text: userMessage }],
        },
      ],
    }, {
      headers: {
        "Content-Type": "application/json"
      }
    })

    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text
    return text || "🤖 No response from Gemini."
  } catch (error: any) {
    console.error("Gemini API error:", error.response?.data || error.message)
    return "⚠️ Error: Failed to get a response from Gemini."
  }
}
