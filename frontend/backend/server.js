import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/* ===========================
   🔗 CONNECT TO MONGODB
=========================== */

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

/* ===========================
   👤 USER SCHEMA
=========================== */

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

/* ===========================
   🔐 SIGNUP API
=========================== */

app.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.json({ error: "User already exists" });
    }

    const newUser = new User({ email, password });
    await newUser.save();

    res.json({ message: "Signup successful" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Signup failed" });
  }
});

/* ===========================
   🔐 LOGIN API
=========================== */

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({
      user: {
        name: user.email,
        email: user.email,
      },
      token: "dummy-token",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

/* ===========================
   🔥 GROQ (AI SUMMARY)
=========================== */

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

/* ===========================
   🧠 SUMMARIZE API
=========================== */

app.post("/summarize", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "No text provided" });
    }

    const response = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: `Summarize this news in 2-3 lines:\n${text}`,
        },
      ],
    });

    const summary = response.choices[0].message.content;

    res.json({ summary });

  } catch (error) {
    console.error("ERROR:", error);

    res.json({
      summary: "Unable to generate summary right now.",
    });
  }
});

/* ===========================
   🚀 SERVER START
=========================== */

app.listen(8000, () => {
  console.log("🚀 Server running on port 8000");
});