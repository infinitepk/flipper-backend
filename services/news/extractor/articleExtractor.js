
const axios = require("axios");
const { Readability } = require("@mozilla/readability");
const { JSDOM } = require("jsdom");
const { formatArticle } = require("./articleFormatter");

async function extractArticle(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/137.0.0.0 Safari/537.36",
      },
      timeout: 15000,
    });

    const dom = new JSDOM(response.data, {
      url,
    });

    const document = dom.window.document;
   

const ogImage =
  document
    .querySelector('meta[property="og:image"]')
    ?.getAttribute("content") ||
  document
    .querySelector('meta[name="twitter:image"]')
    ?.getAttribute("content") ||
  null;

    const reader = new Readability(dom.window.document);

    const article = reader.parse();

return formatArticle(article, url, ogImage);
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

module.exports = {
  extractArticle,
};