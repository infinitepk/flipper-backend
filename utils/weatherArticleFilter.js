const weatherKeywords = [

    "weather",
    "rain",
    "rainfall",
    "storm",
    "cyclone",
    "temperature",
    "heatwave",
    "cold wave",
    "humidity",
    "wind",
    "snow",
    "fog",
    "forecast",
    "monsoon",
    "drizzle",
    "thunderstorm",
    "hail",
    "cloudburst",
    "lightning",
    "showers",
    "flood",
    "flooding",
    "air quality",
    "aqi"

];

function isWeatherArticle(article) {

    const text = `${

        article.title || ""

    } ${

        article.summary || ""

    }`.toLowerCase();

    return weatherKeywords.some(
        keyword => text.includes(keyword)
    );

}

module.exports = {
    isWeatherArticle,
};