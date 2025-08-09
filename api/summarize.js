const { GoogleGenerativeAI } = require("@google/generative-ai");
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

module.exports = async (req, res) => {
  if (req.method === "POST") {
    try {
      const { articleText } = req.body;

      if (!articleText) {
        return res.status(400).json({ error: "Article text is required." });
      }

      if (!GEMINI_API_KEY) {
        return res
          .status(500)
          .json({ error: "Gemini API key is not configured on the server." });
      }

      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Summarize the following article:\n\n${articleText}`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const summaryText = response.text();

      res.status(200).json({ summary: summaryText });
    } catch (err) {
      res
        .status(500)
        .json({ error: "Internal server error during summarization." });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};
