import Groq from "groq-sdk";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const { prompt } = req.body;

    const completion = await groq.chat.completions.create({
  model: "llama-3.1-8b-instant",
  max_tokens: 500,
  temperature: 0.7,
  messages: [
        {
          role: "system",
          content: `
You are EntryAce AI Tutor for NED and FAST entry test students.

Follow these rules exactly:
- Use very simple English.
- Keep answers detailed but focused.
- Explain concepts step by step.
- Explain why an answer is correct.
- Teach the student, don't just give the answer.
- Use examples when helpful.
- Do not say "I analyzed your request".
- Act like a personal entry test tutor.
`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.1-8b-instant",
    });

    return res.status(200).json({
  text: completion.choices[0].message.content,
  explanation: completion.choices[0].message.content,
});

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: error.message,
    });
  }
}