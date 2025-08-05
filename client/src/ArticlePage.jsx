import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ArticlePage.css";
const ArticlePage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const articleFromList = state?.article;

  const [scrapedArticle, setScrapedArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [summary, setSummary] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);

  if (!articleFromList) {
    return (
      <div>
        <h2>Article not found</h2>
        <button onClick={() => navigate("/")}>Back to Home</button>
      </div>
    );
  }

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
  }, [articleFromList.url]);

  const handleSummarize = async () => {
    setIsSummarizing(true);
    setSummary("");
    try {
      if (scrapedArticle && scrapedArticle.content) {
        const response = await fetch("http://localhost:5000/api/summarize", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ articleText: scrapedArticle.content }),
        });

        if (!response.ok) {
          throw new Error("Failed to get summary from the server.");
        }

        const data = await response.json();
        setSummary(data.summary);
      } else {
        setSummary("Article content is not available for summarization.");
      }
    } catch (err) {
      console.error("Error summarizing article:", err);
      setSummary("Failed to summarize the article. Please try again.");
    } finally {
      setIsSummarizing(false);
    }
  };

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

  const displayedTitle = scrapedArticle?.title || articleFromList.title;
  const displayedContent =
    scrapedArticle?.content || articleFromList.description;
  const displayedImage = articleFromList.image;

  return (
    <div className="article-page">
      <button onClick={() => navigate("/")}>⬅ Back</button>
      <h1>{displayedTitle}</h1>
      {displayedImage && <img src={displayedImage} alt={displayedTitle} />}
      <p>{displayedContent}</p>

      <div className="button-container">
        <button
          onClick={handleSummarize}
          disabled={isSummarizing || !scrapedArticle}
        >
          {isSummarizing ? "Summarizing..." : "Summarize Article"}
        </button>
        <a href={articleFromList.url} target="_blank" rel="noopener noreferrer">
          View Original Source
        </a>
      </div>

      {summary && (
        <div className="summary-container">
          <h3>Summary</h3>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
};

export default ArticlePage;
