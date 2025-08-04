// server/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import scrapeArticle from "./newScrape.js"; // Make sure this file exists and exports properly

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const GNEWS_API_KEY = process.env.GNEWS_API_KEY;

// Route 1: Get latest news from GNews API
app.get("/api/news", async (req, res) => {
  try {
    const response = await axios.get(
      `https://gnews.io/api/v4/top-headlines?lang=en&country=in&max=10&apikey=${GNEWS_API_KEY}`
    );

    const news = response.data.articles.map((article, index) => ({
      id: index + 1,
      title: article.title,
      description: article.description,
      url: article.url,
      image: article.image,
      publishedAt: article.publishedAt,
      source: article.source.name,
    }));

    res.json(news);
  } catch (error) {
    console.error("Error fetching news from GNews:", error.message);
    res.status(500).json({ error: "Failed to fetch news." });
  }
});

// Route 2: Scrape full content from a specific news URL
app.get("/api/scrape", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Missing URL parameter" });
  }

  try {
    const articleData = await scrapeArticle(url);
    res.json(articleData);
  } catch (error) {
    console.error("Scraping error:", error.message);
    res.status(500).json({ error: "Failed to scrape the article." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
