import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(process.cwd(), ".env")
});

console.log("Using API key:", process.env.GROQ_API_KEY ? "LOADED" : "MISSING");

console.log("Current folder:", process.cwd());
console.log("API KEY:", process.env.GROQ_API_KEY ? "FOUND" : "MISSING");

import express from "express";
import { createServer as createViteServer } from "vite";
import Groq from "groq-sdk";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Server-Side Gemini API Proxy Route
app.post("/api/gemini/tutor", async (req, res) => {
  try {
    const { prompt, history , systemContext } = req.body;

    if (!prompt && (!history || history.length === 0)) {
      return res.status(400).json({ error: "Prompt or conversation history is required" });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ 
        error: "GROQ_API_KEY environment variable is missing on server."
      });
    }

    const groq = new Groq({
  apiKey,
});

const systemInstruction = `
You are EntryAce AI Tutor, an expert tutor for NED, FAST, and other university entrance tests.

Your mission is to help students understand concepts instead of memorizing answers.

Follow these rules strictly:

1. Explain everything in very simple English.
2. Teach like a friendly teacher talking to one student.
3. Never use headings such as "Concept", "Reasoning", "Solution", or "Explanation".
4. Never use Markdown formatting like **, ##, ###, or tables.
5. Never use LaTeX symbols such as $...$.
6. Keep answers between 80 and 150 words.
7. Start explaining immediately without greetings or introductions.
8. Explain the main idea in one short sentence.
9. Show only the important calculation steps.
10. Avoid unnecessary theory.
11. If the question is conceptual, explain the logic first.
12. If the question is numerical, solve it step by step.
13. If it is a multiple-choice question:
    - Explain why the correct option is correct.
    - Briefly mention why the other options are incorrect if helpful.
15.Write formulas in plain text using symbols like √, ×, ÷, and ^.
Do not write "square root of" unless necessary.
14. If useful, give one short exam tip at the end.
15. End every response with:
Answer: <correct option>

Example response:

We use the formula for the resultant of two forces.

R = √(A² + B² + 2AB cosθ)

Here A = F, B = F and cos60 = 1/2.

R = √(F² + F² + F²)

R = √3F

Answer: C) √3F

Never reveal only the answer without an explanation.
Always encourage understanding.
`;

    // Format conversation history for Gemini if present
    const finalPrompt = `
Student Question:
${prompt}

Answer using this exact format:

1. Explain the idea in 1-2 simple sentences.
2. Show the important calculation steps.
3. Give the final answer.
4. Keep the total answer between 80 and 150 words.

Never answer in one sentence.
Never stop after the first line.
`;

let contentsPayload: any = finalPrompt;

    if (Array.isArray(history) && history.length > 0) {
      // Convert history array ({ sender: 'user' | 'ai', text: string }) into Gemini contents format
      const formattedHistory = history.map((msg: any) => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      }));

      if (prompt) {
        formattedHistory.push({
          role: 'user',
          parts: [{ text: finalPrompt }],
        });
      }

      contentsPayload = formattedHistory;
    }

    const completion = await groq.chat.completions.create({
  model: "llama-3.1-8b-instant",
  messages: [
    {
      role: "system",
      content: systemContext || `
You are EntryAce AI Tutor for NED and FAST entry test students.

Follow these rules exactly:
- Use very simple English.
- Keep answers short (100-150 words).
- Explain concepts clearly.
- Give step-by-step explanations.
`
    },
    {
      role: "user",
      content: prompt,
    },
  ],
});
console.log("========== GROQ RESPONSE ==========");
console.log(completion.choices[0].message.content);
console.log("====================================");

return res.json({ 
  text: completion.choices[0].message.content 
});

} catch (err: any) {
  console.error("Groq API server error:", err);
  return res.status(500).json({ 
    error: err.message || "Failed to generate AI response from Groq" 
  });
}
});

// Vite middleware setup for development vs production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
