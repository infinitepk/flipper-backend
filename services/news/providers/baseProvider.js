const Parser = require("rss-parser");
const axios = require("axios");

const parser = new Parser();

const MAX_RETRIES = 3;
const DEFAULT_BACKOFF = 5000;
const MAX_RETRY_DELAY = 60000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizePublishedDate(value) {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
}

function getRetryDelay(error, attempt) {
  const retryAfter = error.response?.headers?.["retry-after"];

  if (retryAfter) {
    const retrySeconds = Number(retryAfter);

    if (Number.isFinite(retrySeconds)) {
      return Math.min(retrySeconds * 1000, MAX_RETRY_DELAY);
    }
  }

  return Math.min(
    DEFAULT_BACKOFF * Math.pow(2, attempt),
    MAX_RETRY_DELAY
  );
}

async function fetchArticles({
  source,
  category,
  rssUrl,
  userAgent,
}) {
  const rssUrls = Array.isArray(rssUrl) ? rssUrl : [rssUrl];

  let items = [];

  for (const url of rssUrls) {
    console.log(`Fetching: ${url}`);

    let feed;

   for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
  try {
    console.log("RSS URL:", url);
    console.log("RSS User-Agent:", userAgent || "DEFAULT USER-AGENT");

    const response = await axios.get(url, {
      timeout: 15000,
     headers: {
  "User-Agent": url.includes("newscientist.com")
  ? "curl/8.0"
  : userAgent ||
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/137.0.0.0 Safari/537.36",
  Accept:
    "application/rss+xml, application/xml;q=0.9, text/xml;q=0.8, */*;q=0.7",
},
    });
	
	let rssXml = response.data;

if (
  typeof rssXml === "string" &&
  url.includes("science.nasa.gov/feed/")
) {
  rssXml = rssXml.replace(
    /("https:\/\/science\.nasa\.gov\/apod\/")\s*(xmlns:media=)/,
    '$1 $2'
  );
}

console.log(`\n========== RSS DEBUG: ${source} ==========`);

console.log("Response type:", typeof rssXml);
console.log("Response preview:");
console.log(String(rssXml).slice(0, 1000));

console.log("========================================\n");


    feed = await parser.parseString(rssXml);
	
	console.log(`[${source}] First article date fields:`);
console.log(feed.items?.[0]);
    break;
  } catch (err) {
    // Keep your existing catch block unchanged.
        const status = err.response?.status || err.statusCode;

        if (status === 429 && attempt < MAX_RETRIES) {
          const delay = getRetryDelay(err, attempt);

          console.log(
            `429 rate limit: retry ${attempt + 1}/${MAX_RETRIES} in ${Math.ceil(
              delay / 1000
            )}s`
          );

          await sleep(delay);
          continue;
        }

        console.error(`Failed: ${url}`);
        console.error(err);

        throw err;
      }
    }

    console.log(`Success: ${url}`);

    // Keep only the newest 50 candidates per category.
    items.push(...feed.items);

    if (items.length > 100) {
      items.sort(
        (a, b) =>
          new Date(normalizePublishedDate(b.pubDate) || 0) -
          new Date(normalizePublishedDate(a.pubDate) || 0)
      );

      items = items.slice(0, 50);
    }
  }

  // Final safety limit: newest 50.
  items.sort(
  (a, b) =>
    new Date(normalizePublishedDate(b.pubDate) || 0) -
    new Date(normalizePublishedDate(a.pubDate) || 0)
);

  items = items.slice(0, 50);

  return items.map((item) => {
    let videoUrl = null;

    // RSS enclosure
    if (item.enclosure?.url) {
      const type = item.enclosure.type || "";
      const url = item.enclosure.url;

      if (
        type.startsWith("video/") ||
        /\.(mp4|m4v|webm|mov|m3u8)(\?|$)/i.test(url)
      ) {
        videoUrl = url;
      }
    }

    // Media RSS
    if (!videoUrl) {
      const mediaContent = item["media:content"];

      const media = Array.isArray(mediaContent)
        ? mediaContent[0]
        : mediaContent;

      if (
        media?.url &&
        (
          media.medium === "video" ||
          media.type?.startsWith("video/") ||
          /\.(mp4|m4v|webm|mov|m3u8)(\?|$)/i.test(media.url)
        )
      ) {
        videoUrl = media.url;
      }
    }

    return {
  title: item.title,
  summary: item.contentSnippet || item.summary || item.content || "",
  article_url: item.link,
  source,
  publishedAt: normalizePublishedDate(
    item.isoDate || item["dc:date"] || item.date || item.pubDate
    ),
  category,
  video_url: videoUrl,
};
  });
}

module.exports = {
  fetchArticles,
};