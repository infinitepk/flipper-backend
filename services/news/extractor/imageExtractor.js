const axios = require("axios");
const cheerio = require("cheerio");

async function extractImage(article, url) {

    // 1. RSS image (fast path)
    if (article.image_url) {
        return article.image_url;
    }

    if (article.enclosure?.url) {
        return article.enclosure.url;
    }

    // 2. Scrape only if RSS has no image
    try {
        const response = await axios.get(url, {
            timeout: 10000,
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/137 Safari/537.36",
            },
        });

        const $ = cheerio.load(response.data);

        return (
            $('meta[property="og:image"]').attr("content") ||
            $('meta[property="og:image:secure_url"]').attr("content") ||
            $('meta[name="twitter:image"]').attr("content") ||
            $('meta[name="twitter:image:src"]').attr("content") ||
            null
        );

    } catch (err) {
        console.error("Image extraction failed:", url);
        return null;
    }
}

module.exports = {
    extractImage,
};
