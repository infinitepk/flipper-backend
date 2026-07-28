const Parser = require('rss-parser');

const parser = new Parser();

async function fetchNews() {

    const feed = await parser.parseURL(
        'https://timesofindia.indiatimes.com/rssfeedstopstories.cms'
    );

    console.log("NEWS:");

    feed.items.forEach(article => {
        console.log(article.title);
    });
}

fetchNews();