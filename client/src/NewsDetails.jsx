// src/NewsDetails.jsx
import React, { useEffect, useState } from "react";

const NewsDetails = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const url = urlParams.get("url");

    const fetchContent = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/scrape?url=${encodeURIComponent(url)}`
        );
        const data = await res.json();
        setContent(data);
      } catch (err) {
        console.error("Error fetching article:", err);
        setContent({ title: "Error", content: "Failed to load content." });
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (loading) return <p>Loading article...</p>;
  if (!content) return <p>No content found.</p>;

  return (
    <div className="news-details">
      <h1>{content.title}</h1>
      <p>
        <em>{content.date}</em>
      </p>
      <div>
        {content.content.split("\n\n").map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
    </div>
  );
};

export default NewsDetails;
