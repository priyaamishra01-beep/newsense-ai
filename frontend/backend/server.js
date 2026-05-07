import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import axios from "axios";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8000;

/* ================= MONGODB ================= */

mongoose.connect(process.env.Mongo_URI)
.then(() => {
  console.log("✅ MongoDB Connected");
})
.catch((err) => {
  console.log("❌ MongoDB Error:", err);
});

/* ================= TEST ROUTE ================= */

app.get("/", (req, res) => {
  res.send("NewsSenseAI Backend Running 🚀");
});

/* ================= NEWS ROUTE ================= */

app.get("/news", async (req, res) => {

  try {

    const query = req.query.q || "india";

    const response = await axios.get(
      `https://newsapi.org/v2/everything?q=${query}&pageSize=20&apiKey=${process.env.News_API_KEY}`
    );

    res.json(response.data);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: "Failed to fetch news"
    });

  }

});

/* ================= SUMMARY ROUTE ================= */

app.post("/summarize", async (req, res) => {

  try {

    const { text } = req.body;

    res.json({
      summary: text
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: "Summary failed"
    });

  }

});

/* ================= START SERVER ================= */

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});