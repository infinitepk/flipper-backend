const axios = require("axios");
const { Readability } = require("@mozilla/readability");
const { JSDOM } = require("jsdom");
const { formatArticle } = require("./articleFormatter");

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function extractArticle(url) {
  const MAX_RETRIES = 3;
  const DEFAULT_BACKOFF = 5000;
  const MAX_RETRY_DELAY = 60000;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await axios.get(url, {
        headers: {
          "User-Agent": url.includes("newscientist.com")
            ? "curl/8.0"
            : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/137.0.0.0 Safari/537.36",
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

      if (!article) {
        console.error(`Could not parse article: ${url}`);
        return null;
      }

      return formatArticle(article, url, ogImage);

    } catch (error) {
      const status = error.response?.status;

      const isRetryable =
        !status || status === 408 || status === 429 || status >= 500;

      if (isRetryable && attempt < MAX_RETRIES) {
        const retryAfter = error.response?.headers?.["retry-after"];

        let delay = DEFAULT_BACKOFF * Math.pow(2, attempt);

        if (status === 429 && retryAfter) {
          const retrySeconds = Number(retryAfter);

          if (Number.isFinite(retrySeconds)) {
            delay = Math.min(retrySeconds * 1000, MAX_RETRY_DELAY);
          }
        }

        console.log(
          `[Article Extractor] Retry ${attempt + 1}/${MAX_RETRIES} ` +
            `after ${Math.ceil(delay / 1000)}s: ${url} — ${error.message}`
        );

        await sleep(delay);
        continue;
      }

      console.error(`[Article Extractor] URL: ${url}`);
      console.error(`[Article Extractor] Status: ${status ?? "Unknown"}`);
      console.error(`[Article Extractor] Error: ${error.message}`);

      return null;
    }
  } // Added missing brace for the 'for' loop
} // Added missing brace for the 'extractArticle' function

module.exports = {
  extractArticle,
};