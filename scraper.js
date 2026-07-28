const axios = require('axios');
const cheerio = require('cheerio');

const Parser = require('rss-parser');
const { Pool } = require('pg');

const parser = new Parser();

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'flipper',
    password: '9059859008@Pk',
    port: 5432,
});

async function scrapeFeed(url, category) {
     console.log("Parsing:", url);

    const feed = await parser.parseURL(url);

console.log(feed.title);
console.log(feed.items.length);
  

    for (const article of feed.items) {

    try {

        const response = await axios.get(article.link);

        const $ = cheerio.load(response.data);

        const summary =
            $('meta[property="og:description"]').attr('content') ||
            $('meta[name="description"]').attr('content') ||
            '';
        const image =
            $('meta[property="og:image"]').attr('content') ||
            article.enclosure?.url ||
            '';

        await pool.query(
            `
            INSERT INTO articles
            (
                title,
                summary,
                article_url,
                image_url,
                source,
                category,
                published_at
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7)
            ON CONFLICT (article_url) DO NOTHING
            `,
           [
              article.title,
              summary,
              article.link,
              image,
              article.creator,
              category,
              article.isoDate
           ]
        );

        console.log(`Inserted [${category}]`, article.title);

    } catch (err) {

        console.log(`Skipped [${category}]`, article.title);

    }
}
}

const feeds = [
    {
        url: 'https://timesofindia.indiatimes.com/rssfeeds/-2128936835.cms',
        category: 'India'
    },
    {
         url: 'https://www.thehindu.com/news/national/feeder/default.rss',
         category: 'India'
    },
    {
        url: 'https://indianexpress.com/section/india/feed/',
        category: 'India'
    },
    {
        url: 'https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml',
       category: 'India'
    },
    {
        url: 'https://feeds.feedburner.com/ndtvnews-india-news',
       category: 'India'
    },

     {
    "url": "https://www.news18.com/rss/india.xml",
    "category": "India"
    },
    
   
    {
        url: 'https://timesofindia.indiatimes.com/rssfeeds/296589292.cms',
        category: 'World'
    },
    {
        url: 'https://timesofindia.indiatimes.com/rssfeeds/1898055.cms',
        category: 'Business'
    },
    {
        url: 'https://timesofindia.indiatimes.com/rssfeeds/4719148.cms',
        category: 'Sports'
    },
    
    {
       url: 'https://www.espn.com/espn/rss/news',
       category: 'Sports'
   },
   {
       url: 'https://feeds.bbci.co.uk/sport/rss.xml',
       category: 'Sports'
   },
   
    {
        url: 'https://timesofindia.indiatimes.com/rssfeeds/1081479906.cms',
        category: 'Entertainment'
    },
    {
        url: 'https://www.hollywoodreporter.com/feed/',
        category: 'Entertainment'
    },
    {
        url: 'https://variety.com/feed/',
        category: 'Entertainment'
    },
    {
       url: 'https://deadline.com/feed/',
        category: 'Entertainment'
    },
    {
        url: 'https://feeds.ign.com/ign/all',
        category: 'Entertainment'
    },

     {
    url: 'https://www.billboard.com/feed/',
    category: 'Entertainment'
     },

     {
    url: 'https://timesofindia.indiatimes.com/rssfeeds/1081479906.cms',
    category: 'Entertainment'
    },

    {
    url: 'https://www.bollywoodhungama.com/rss/news.xml',
    category: 'Entertainment'
    },

    {
    url: 'https://www.koimoi.com/feed/',
    category: 'Entertainment'
    },
   
    {
       url: 'https://feeds.bbci.co.uk/news/world/rss.xml',
       category: 'World'
    },
    {
       url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml',
        category: 'World'
    },
    {
       url: 'https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms',
       category: 'Business'
    },
    {
        url: 'https://www.nasa.gov/rss/dyn/breaking_news.rss',
       category: 'Space'
    },
    {
        url: 'https://spacenews.com/feed/',
       category: 'Space'
    },
    {
       url: 'https://www.space.com/feeds/all',
       category: 'Space'
    },
    {
        url: 'https://www.universetoday.com/feed/',
        category: 'Space'
    },
    {
        url: 'https://jatan.space/feed/',
        category: 'Space'
    },

    {
    url: "https://shasthrasnehi.com/feed/",
    category: "Sci-Tech"
     },

     {
    url: 'https://feeds.arstechnica.com/arstechnica/index',
    category: 'Sci-Tech'
    },

    {
    url: 'https://www.sciencedaily.com/rss/all.xml',
    category: 'Sci-Tech'
    },

    {
    url: 'https://www.technologyreview.com/feed/',
    category: 'Sci-Tech'
    },

   {
    url: 'https://www.newscientist.com/feed/home/',
    category: 'Sci-Tech'
    },

    {
    url: 'https://www.theverge.com/rss/index.xml',
    category: 'Sci-Tech'
    },

    {
    url: 'https://www.gsmarena.com/rss-news-reviews.php3',
    category: 'Sci-Tech'
    },
   


    {
    url: "https://www.hindustantimes.com/feeds/rss/lifestyle/art-                   culture/rssfeed.xml",
    category: "History"
    },

    {
    url: "https://feeds.feedburner.com/AncientOrigins",
    category: "History"
    },

    {
    url: "https://www.worldhistory.org/rss/news/",
    category: "History"
    },

    {
    url: 'https://www.smithsonianmag.com/rss/history/',
    category: 'History'
    },

    {
    url: 'https://www.historynet.com/feed/',
    category: 'History'
    },

    {
    url: 'https://www.livescience.com/feeds/all',
    category: 'History'
    },

     {
    url: "https://indianexpress.com/section/lifestyle/art-and-culture/feed/",
    category: "History"
    },


     {
    "url": "https://inditales.com/feed",
    "category": "Travel"
     },

  
  {
    "url": "https://theplanetd.com/feed",
    category: "Travel"
  },

  {
    "url": "https://goatsontheroad.com/feed",
    "category": "Travel"
  },
 
    {
    url: "https://travel.economictimes.indiatimes.com/rss/destination",
    category: "Travel"
    },

     {
    "url": "https://nomadicmatt.com/feed",
    "category": "Travel"
     },
     {
    "url": "https://nomadasaurus.com/feed",
    "category": "Travel"
     },
   
     {
    "url": "https://localadventurer.com/feed",
    "category": "Travel"
     },
     {
    "url": "https://feeds.feedburner.com/breakingtravelnews",
    "category": "Travel"
     },

    {
    url: "https://indianexpress.com/section/lifestyle/destination-of-the-week/feed/",
    category: "Travel"
    },

   {
    url: "https://india.mongabay.com/feed/?post_type=post&feedtype=bulletpoints&topic=animals",
    category: "Nature"
  },

   {
    url: "https://india.mongabay.com/feed/?post_type=post&feedtype=bulletpoints&topic=biodiversity",
    category: "Nature"
  },


  {
    url: "https://india.mongabay.com/feed/?post_type=post&feedtype=bulletpoints&topic=wildlife",
    category: "Nature"
   },

    
  {
    url: "https://india.mongabay.com/feed/?     post_type=post&feedtype=bulletpoints&location=india",
    category: "Nature"
  },

  {
    "url": "https://www.downtoearth.org.in/feed",
    "category": "Nature"
  },
  {
    "url": "https://www.greenpeace.org/india/en/feed",
    "category": "Nature"
  },
  {
    "url": "https://delhigreens.com/feed",
    "category": "Nature"
  },
   {
    url: "https://indianexpress.com/section/explained/explained-climate/feed/",
    category: "Nature"
    },
   {
    url: "https://news.mongabay.com/feed/",
    category: "Nature"
   },
];  


const categoryToRun = "";                    //set null to runall
async function run() {

    const filteredFeeds = categoryToRun
        ? feeds.filter(feed => feed.category === categoryToRun)
        : feeds;

    for (const feed of filteredFeeds) {

        try {

            await scrapeFeed(
                feed.url,
                feed.category
            );

        } catch (err) {

            console.log(`❌ Failed: ${feed.url}`);
            console.log(err.message);

        }

    }

}

run();
