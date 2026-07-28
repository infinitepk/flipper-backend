const axios = require("axios");

const { getWeatherInfo } = require("../utils/weatherMapper");

const weatherCache = new Map();
const geoCache = new Map();

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes



async function getCoordinates(city) {

const cacheKey = city.toLowerCase();

if (geoCache.has(cacheKey)) {

    console.log("Returning cached coordinates");

    return geoCache.get(cacheKey);

}

    const url =
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;

    const response = await axios.get(url);
    

    if (
        !response.data.results ||
        response.data.results.length === 0
    ) {
        throw new Error("City not found");
    }

    const place = response.data.results[0];

    const location = {

    latitude: place.latitude,

    longitude: place.longitude,

    city: place.name,

    country: place.country

};

geoCache.set(cacheKey, location);

return location;
}

async function getWeather(city, latitude, longitude) {

   let location;

if (latitude && longitude) {

    location = {
        latitude: Number(latitude),
        longitude: Number(longitude),
        city: "Current Location",
        country: "",
    };

    try {
        const reverseResponse = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
            {
                headers: {
                    "User-Agent": "Flipper Weather Engine",
                },
                timeout: 5000,
            }
        );

        console.log("Reverse geocoding response:", reverseResponse.data);

const address = reverseResponse.data.address;
console.log("Address:", address);

        location.city =
            address.city ||
            address.town ||
            address.village ||
            address.state_district ||
            "Current Location";

        location.country = address.country || "";

    } catch (err) {
    console.error("Reverse geocoding failed:", err.message);
}

} else {

    location = await getCoordinates(city);

}   
    const cacheKey = `${location.latitude},${location.longitude}`;

    const cached = weatherCache.get(cacheKey);

if (
    cached &&
    Date.now() - cached.timestamp < CACHE_DURATION
) {
    console.log("Returning cached weather");
    return cached.data;
}

    const url =
`https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,surface_pressure,visibility,is_day&hourly=temperature_2m,weather_code,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&forecast_days=7&timezone=auto`;



   console.log("Fetching forecast...");
const response = await axios.get(url);
console.log("Forecast OK");

// AQI API
const airQualityUrl =
`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${location.latitude}&longitude=${location.longitude}&current=us_aqi`;

console.log("Fetching AQI...");
const airQualityResponse = await axios.get(airQualityUrl);
console.log("AQI OK");

const current = response.data.current;

console.log("Current is_day:", current.is_day);


// 👇 ADD HERE
const aqi = airQualityResponse.data.current.us_aqi;

let aqiLevel;

if (aqi <= 50) {
    aqiLevel = "Good";
} else if (aqi <= 100) {
    aqiLevel = "Moderate";
} else if (aqi <= 150) {
    aqiLevel = "Unhealthy";
} else if (aqi <= 200) {
    aqiLevel = "Very Unhealthy";
} else {
    aqiLevel = "Hazardous";
}


const currentHour = current.time.substring(0, 13);
     const currentIndex = response.data.hourly.time.findIndex(
    time => time.startsWith(currentHour)
    );

console.log(
    "Hourly is_day:",
    response.data.hourly.is_day.slice(currentIndex, currentIndex + 5)
);

    const weatherInfo = getWeatherInfo(current.weather_code);

    const today = {

    max: Math.round(response.data.daily.temperature_2m_max[0]),

    min: Math.round(response.data.daily.temperature_2m_min[0]),

    sunrise: new Date(response.data.daily.sunrise[0]).toLocaleTimeString(
    "en-US",
    {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    }
),

sunset: new Date(response.data.daily.sunset[0]).toLocaleTimeString(
    "en-US",
    {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    }
),

    uvIndex: Math.round(response.data.daily.uv_index_max[0]),

};

    const daily = response.data.daily.time.map((date, index) => {

    const info = getWeatherInfo(
        response.data.daily.weather_code[index]
    );

   return {

    date,

    weatherCode: response.data.daily.weather_code[index],

    max: Math.round(
        response.data.daily.temperature_2m_max[index]
    ),

    min: Math.round(
        response.data.daily.temperature_2m_min[index]
    ),

    condition: info.condition

};


});

    const hourly = response.data.hourly.time
    .slice(currentIndex, currentIndex + 24)

   
    .map((time, index) => {

        const actualIndex = currentIndex + index;

        const info = getWeatherInfo(
            response.data.hourly.weather_code[actualIndex]
        );

        return {

            time: time.substring(11, 16),
  
           temperature: Math.round(
             response.data.hourly.temperature_2m[actualIndex]
           ),

           weatherCode:
              response.data.hourly.weather_code[actualIndex],

           isDay:
              response.data.hourly.is_day[actualIndex],

           condition: info.condition,

         };

    });

const weather = {

    provider: "Flipper Weather Engine",

     units: {
        temperature: "°C",
        windSpeed: "km/h",
        visibility: "km",
        pressure: "hPa",
        humidity: "%",
        aqi: "US AQI",
    },

    location: {
        city: location.city,
        country: location.country
    },

 current: {

    temperature: Math.round(current.temperature_2m),

    feelsLike: Math.round(current.apparent_temperature),

    weatherCode: current.weather_code,

    isDay: current.is_day,

    condition: weatherInfo.condition,

    humidity: current.relative_humidity_2m,

    windSpeed: Math.round(current.wind_speed_10m),

    pressure: Math.round(current.surface_pressure),

    visibility: Math.round(current.visibility / 1000),

    aqi: {
    value: aqi,
    level: aqiLevel,



},

},

    today,

    hourly,

    daily,

    lastUpdated: current.time
};

weatherCache.set(cacheKey, {
    timestamp: Date.now(),
    data: weather
});

return weather;

}

module.exports = {
    getWeather
};