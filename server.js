import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fs from "fs";
import OpenAI from "openai";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Load question bank
const questions = JSON.parse(fs.readFileSync("questions.json", "utf-8"));

// OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Endpoint: Get random question
app.get("/api/question", (req, res) => {
  const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
  res.json(randomQuestion);
});

// Endpoint: Evaluate answer
app.post("/api/evaluate", async (req, res) => {
  const { question, studentAnswer, expected_points } = req.body;

  try {
    const prompt = `
You are an examiner. Question: "${question}".
Expected key points: ${expected_points.join(", ")}.
Student's answer: "${studentAnswer}".

Evaluate if the student covered the key points. Give constructive feedback. Keep it short and professional.
    `;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    });

    res.json({ feedback: response.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
