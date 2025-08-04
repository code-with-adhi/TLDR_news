import puppeteer from "puppeteer";

const scrapeArticle = async (url) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

  const result = await page.evaluate(() => {
    const title = document.querySelector("h1")?.innerText || "";
    const date =
      document.querySelector("meta[property='article:published_time']")
        ?.content || "";

    const paragraphs = Array.from(
      document.querySelectorAll("div.articlebodycontent p")
    );
    const content = paragraphs
      .filter((p) => p && p.innerText)
      .map((p) => p.innerText)
      .join("\n\n");

    return { title, date, content };
  });

  await browser.close();
  return result;
};

export default scrapeArticle;
