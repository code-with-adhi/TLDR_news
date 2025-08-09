const axios = require("axios");

const GNEWS_API_KEY = process.env.GNEWS_API_KEY;

module.exports = async (req, res) => {
  if (req.method === "GET") {
    try {
      const response = await axios.get(
        `https://gnews.io/api/v4/top-headlines?lang=en&country=in&max=10&apikey=${GNEWS_API_KEY}`
      );

      if (!response.data || !response.data.articles) {
        return res
          .status(500)
          .json({ error: "Failed to fetch news from GNews." });
      }

      const news = response.data.articles.map((article, index) => ({
        id: index + 1,
        title: article.title,
        description: article.description,
        url: article.url,
        image: article.image,
        publishedAt: article.publishedAt,
        source: article.source.name,
      }));

      res.status(200).json({ articles: news });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch news." });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};
