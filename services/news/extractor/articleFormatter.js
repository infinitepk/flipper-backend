function formatArticle(article, originalUrl, ogImage = null) {
  if (!article) return null;

  return {
    title: article.title,
    description: article.excerpt,
    content: article.textContent,
    author: article.byline,
    source: article.siteName,
    publishedAt: article.publishedTime,
    url: originalUrl,
    image: article.image || ogImage || null,
    length: article.length,
    readingTime: Math.ceil((article.length || 0) / 1000),
  };
}

module.exports = {
  formatArticle,
};