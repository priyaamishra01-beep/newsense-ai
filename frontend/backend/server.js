import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";
import Groq from "groq-sdk";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ================= MONGODB =================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// ================= ROOT =================

app.get("/", (req, res) => {
  res.send("NewsSenseAI Backend Running 🚀");
});

// ================= NEWS API =================

app.get("/news", async (req, res) => {

  try {

    const query = req.query.q;

    const response = await axios.get(
      `https://newsapi.org/v2/everything?q=${query}&pageSize=20&apiKey=${process.env.NEWS_API_KEY}`
    );

    res.json(response.data);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Failed to fetch news",
    });

  }

});

// ================= AI SUMMARY =================

app.post("/summarize", async (req, res) => {

  try {

    const { text } = req.body;

    const chatCompletion = await groq.chat.completions.create({

      messages: [
        {
          role: "user",
          content: `Summarize this news in simple words:\n${text}`,
        },
      ],

      model: "llama3-8b-8192",

    });

    const summary =
      chatCompletion.choices[0]?.message?.content;

    res.json({ summary });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Summarization failed",
    });

  }

});

// ================= START SERVER =================

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});