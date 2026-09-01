const Parser = require("rss-parser");

const parser = new Parser();

async function fetchArticles({
  source,
  category,
  rssUrl,
}) {
  const rssUrls = Array.isArray(rssUrl) ? rssUrl : [rssUrl];

  let items = [];

for (const url of rssUrls) {
  console.log(`Fetching: ${url}`);

  try {
    const feed = await parser.parseURL(url);

    console.log(`Success: ${url}`);

    items.push(...feed.items);
  } catch (err) {
    console.error(`Failed: ${url}`);
    console.error(err);

    throw err;
  }
}

  // Keep only the newest 50 articles
  items.sort(
    (a, b) => new Date(b.pubDate || 0) - new Date(a.pubDate || 0)
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
    article_url: item.link,
    source,
    publishedAt: item.pubDate,
    category,
    video_url: videoUrl,
  };
});
}

module.exports = {
  fetchArticles,
};