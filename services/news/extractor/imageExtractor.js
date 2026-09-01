const axios = require("axios");
const cheerio = require("cheerio");

async function extractMedia(article, url) {
    // 1. RSS image
    let imageUrl = article.image_url || null;

    // 2. RSS enclosure
    if (!imageUrl && article.enclosure?.url) {
        imageUrl = article.enclosure.url;
    }

    // 3. RSS video
    let videoUrl = null;

    if (
        article.enclosure?.url &&
        article.enclosure?.type?.startsWith("video/")
    ) {
        videoUrl = article.enclosure.url;
    }

    // 4. Fetch article page
    try {
        const response = await axios.get(url, {
            timeout: 10000,
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/137 Safari/537.36",
            },
        });

        const $ = cheerio.load(response.data);

        // 5. Image fallback
        if (!imageUrl) {
            imageUrl =
                $('meta[property="og:image"]').attr("content") ||
                $('meta[property="og:image:secure_url"]').attr("content") ||
                $('meta[name="twitter:image"]').attr("content") ||
                $('meta[name="twitter:image:src"]').attr("content") ||
                null;
        }

        // 10. Convert relative URLs to absolute URLs
        if (imageUrl) {
            imageUrl = makeAbsoluteUrl(imageUrl, url);
        }

        if (videoUrl) {
            videoUrl = makeAbsoluteUrl(videoUrl, url);
        }

    } catch (err) {
        console.error("Media extraction failed:", url);
        console.error("Error:", err.message);
        console.error("Status:", err.response?.status);
    }

    return {
        imageUrl,
        videoUrl,
    };
}


// Backwards compatibility
async function extractImage(article, url) {
    const media = await extractMedia(article, url);
    return media.imageUrl;
}


// URL helper
function makeAbsoluteUrl(value, baseUrl) {
    try {
        return new URL(value, baseUrl).href;
    } catch {
        return null;
    }
}


module.exports = {
    extractMedia,
    extractImage,
};