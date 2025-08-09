module.exports = async (req, res) => {
  const { scrapeArticle } = await import("../server/newScrape.js");
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Missing URL parameter" });
  }

  try {
    const articleData = await scrapeArticle(url);
    if (!articleData) {
      throw new Error("Scraper returned no data.");
    }
    res.status(200).json(articleData);
  } catch (error) {
    console.error("API scraping error:", error);
    res.status(500).json({ error: "Failed to scrape the article." });
  }
};
