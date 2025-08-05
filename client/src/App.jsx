import { Routes, Route } from "react-router-dom";
import NewsList from "./NewsList";
import ArticlePage from "./ArticlePage";
import "./App.css";

function App() {
  return (
    <div className="app">
      <header className="app-header">My News</header>
      <Routes>
        <Route path="/" element={<NewsList />} />
        <Route path="/article/:id" element={<ArticlePage />} />
      </Routes>
    </div>
  );
}

export default App;
