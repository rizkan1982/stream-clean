import express from "express";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { config } from "dotenv";
import { Groq } from "groq-sdk";

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Route API chat
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required." });

    const chatCompletion = await groq.chat.completions.create({
  model: "llama3-8b-8192",
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply = chatCompletion.choices[0]?.message?.content || "Maaf, saya tidak bisa menjawab.";

    res.json({ reply });
  } catch (err) {
    console.error("❌ Error saat menghubungi Groq:", err);
    res.status(500).json({ error: "Terjadi kesalahan saat memproses permintaan AI." });
  }
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`✅ Stream AI is running on http://localhost:${PORT}`);
});
