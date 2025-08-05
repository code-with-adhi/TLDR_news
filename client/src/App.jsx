// client/src/App.jsx

import React from "react";
import { Routes, Route } from "react-router-dom";
import NewsList from "./NewsList.jsx";
import ArticlePage from "./ArticlePage";
import logo from "./assets/logo.png";
import "./App.css";
import "./index.css";

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <img src={logo} alt="TLDR News Logo" className="app-logo" />
          <div className="header-text">
            {" "}
            {/* New wrapper for the text */}
            <h1>TLDR News</h1>
            <p>Too Long, Didn't Read</p>
          </div>
        </div>
      </header>
      <Routes>
        <Route path="/" element={<NewsList />} />
        {/* MODIFIED: Added a dynamic parameter ":articleId" to the path */}
        <Route path="/article/:articleId" element={<ArticlePage />} />
      </Routes>
    </div>
  );
}

export default App;
