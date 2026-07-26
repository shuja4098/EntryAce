import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

try {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-lite",
    contents: "Say hello in one sentence.",
  });

  console.log(response.text);
} catch (e) {
  console.error(e);
}