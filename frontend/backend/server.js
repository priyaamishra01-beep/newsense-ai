import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import axios from "axios";

dotenv.config();

const app = express();

// ================= MIDDLEWARE =================

app.use(cors());
app.use(express.json());

// ================= DATABASE =================

mongoose
  .connect(process.env.Mongo_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.log("❌ MongoDB Error:", err);
  });

// ================= TEST ROUTE =================

app.get("/", (req, res) => {
  res.send("NewsSenseAI Backend Running 🚀");
});

// ================= NEWS API ROUTE =================

app.get("/news", async (req, res) => {
  try {
    const query = req.query.q || "india";

    const response = await axios.get(
      `https://newsapi.org/v2/everything?q=${query}&pageSize=20&apiKey=${process.env.News_API_KEY}`
    );

    res.json(response.data);

  } catch (error) {

    console.log("❌ News API Error:", error.message);

    res.status(500).json({
      error: "Failed to fetch news",
    });

  }
});

// ================= AI SUMMARY ROUTE =================

app.post("/summarize", async (req, res) => {
  try {

    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        summary: "No text provided",
      });
    }

    // TEMP SIMPLE SUMMARY
    // Replace later with GROQ/OpenAI if needed

    const shortSummary =
      text.length > 150
        ? text.substring(0, 150) + "..."
        : text;

    res.json({
      summary: shortSummary,
    });

  } catch (error) {

    console.log("❌ Summary Error:", error.message);

    res.status(500).json({
      summary: "Failed to generate summary",
    });

  }
});

// ================= SERVER =================

const PORT = process.env.PORT || 8000;
// ================= TEMP AUTH ROUTES =================

// Signup
app.post("/signup", async (req, res) => {

  try {

    const { name, email, password } = req.body;

    res.json({
      success: true,
      user: {
        name,
        email,
      },
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Signup failed",
    });

  }

});

// Login
app.post("/login", async (req, res) => {

  try {

    const { email } = req.body;

    res.json({
      success: true,
      user: {
        name: email,
        email,
      },
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Login failed",
    });

  }

});
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});