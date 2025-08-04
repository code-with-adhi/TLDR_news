import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ArticlePage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const articleFromList = state?.article; // The initial data from the GNews API

  // State to hold the scraped content and handle loading/errors
  const [scrapedArticle, setScrapedArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // If the initial article data is missing, handle the error gracefully
  if (!articleFromList) {
    return (
      <div>
        <h2>Article not found</h2>
        <button onClick={() => navigate("/")}>Back to Home</button>
      </div>
    );
  }

  // Use the useEffect hook to fetch the scraped data
  useEffect(() => {
    const fetchScrapedContent = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/scrape?url=${encodeURIComponent(
            articleFromList.url
          )}`
        );

        if (!response.ok) {
          throw new Error("Failed to scrape the article content.");
        }

        const data = await response.json();
        setScrapedArticle(data);
      } catch (err) {
        console.error("Error fetching scraped content:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchScrapedContent();
  }, [articleFromList.url]); // Re-run the effect if the article URL changes

  // Conditional rendering based on loading and error states
  if (loading) {
    return (
      <div className="article-page">
        <button onClick={() => navigate("/")}>⬅ Back</button>
        <p>Loading full article content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="article-page">
        <button onClick={() => navigate("/")}>⬅ Back</button>
        <h2>Error</h2>
        <p>{error}</p>
        <p>Displaying the limited information from the API instead:</p>
        <h1>{articleFromList.title}</h1>
        {articleFromList.image && (
          <img src={articleFromList.image} alt={articleFromList.title} />
        )}
        <p>{articleFromList.description}</p>
        <a href={articleFromList.url} target="_blank" rel="noopener noreferrer">
          View Original Source
        </a>
      </div>
    );
  }

  // Use the scraped content if it exists, otherwise fall back to the initial data
  const displayedTitle = scrapedArticle?.title || articleFromList.title;
  const displayedContent =
    scrapedArticle?.content || articleFromList.description;
  const displayedImage = articleFromList.image; // Use the image from the initial API call

  return (
    <div className="article-page">
      <button onClick={() => navigate("/")}>⬅ Back</button>
      <h1>{displayedTitle}</h1>
      {displayedImage && <img src={displayedImage} alt={displayedTitle} />}
      <p>{displayedContent}</p>
      <a href={articleFromList.url} target="_blank" rel="noopener noreferrer">
        View Original Source
      </a>
    </div>
  );
};

export default ArticlePage;
