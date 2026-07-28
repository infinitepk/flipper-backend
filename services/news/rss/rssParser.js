function parseGoogleRSS(items) {
  return items.map((item) => {
    const parts = item.title.split(" - ");

    const source =
      parts.length > 1
        ? parts[parts.length - 1].trim()
        : "Unknown";

    return {
      title: item.title,
      link: item.link,
      source,
      publishedAt: item.pubDate,

      // Keep original RSS metadata
      enclosure: item.enclosure,
      content: item.content,
      contentSnippet: item.contentSnippet,
      creator: item.creator,
      categories: item.categories,
    };
  });
}

module.exports = {
  parseGoogleRSS,
};