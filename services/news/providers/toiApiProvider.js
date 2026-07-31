const axios = require("axios");

const CATEGORY_MAP = {
  india: "BriefsIndia-01",
  world: "BriefsWorld-01",
  business: "BriefsBusiness-01",
  sports: "BriefsSports-01",
  entertainment: "BriefsEntertainment-01",
 
};

async function fetchListing(secuid) {
  const url =
    `https://plus.timesofindia.com/toi-feed/toi-shorts/toia/listing` +
    `?lang=1&fv=117&secuid=${secuid}`;

  const { data } = await axios.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Accept": "application/json",
    },
    timeout: 10000,
  });

  return data;
}

module.exports = {
  name: "TOI",

  categories: Object.keys(CATEGORY_MAP),

  async getArticles(category) {
    const secuid = CATEGORY_MAP[category];

    if (!secuid) {
      console.warn(`[TOI] Unknown category: ${category}`);
      return [];
    }

    const data = await fetchListing(secuid);

console.log("Cards length:", data.cards?.length);

    console.log(Object.keys(data));

const articles = [];

for (const card of data.items || []) {

console.log(card);

    if (card.cardType !== "singleItem") {
        continue;
    }

    const item = card.itemA;

console.log("Template:", item.template);

    let article;

    if (item.template === "news") {
        article = item.news;
    } else if (item.template === "visualstory") {
        article = item.visualstory;
    } else {
        continue;
    }

    articles.push({
        title: article.headLine,
        summary: article.synopsis,
        article_url: article.webUrl,
        image_url: article.imageid,
        source: article.pubInfo?.pn ?? "TOI",
        publishedAt: new Date(Number(article.updatedDate)),
    });

console.log("Added:", article.headLine);
}

console.log("Returning", articles.length, "articles");

return articles;
  },
};