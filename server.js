import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || "*" }));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Ask endpoint
app.post("/api/ask", async (req, res) => {
  try {
    const { question, answer } = req.body;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a marine engineering oral examiner." },
        { role: "user", content: Question: ${question}\nStudent Answer: ${answer}\nEvaluate and give feedback. }
      ],
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Use Render’s assigned port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});