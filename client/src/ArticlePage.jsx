import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ArticlePage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const article = state?.article;

  if (!article) {
    return (
      <div>
        <h2>Article not found</h2>
        <button onClick={() => navigate("/")}>Back to Home</button>
      </div>
    );
  }

  return (
    <div className="article-page">
      <button onClick={() => navigate("/")}>⬅ Back</button>
      <h1>{article.title}</h1>
      {article.image && <img src={article.image} alt={article.title} />}
      <p>{article.content || article.description}</p>
      <a href={article.url} target="_blank" rel="noopener noreferrer">
        View Original Source
      </a>
    </div>
  );
};

export default ArticlePage;
