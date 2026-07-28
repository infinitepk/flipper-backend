function getWeatherInfo(weatherCode) {

    switch (weatherCode) {

        case 0:
            return {
                condition: "Clear Sky",
            };

        case 1:
            return {
                condition: "Mainly Clear",
            };

        case 2:
            return {
                condition: "Partly Cloudy",
            };

        case 3:
            return {
                condition: "Overcast",
            };

        case 45:
        case 48:
            return {
                condition: "Fog",
            };

        case 51:
        case 53:
        case 55:
            return {
                condition: "Drizzle",
            };

        case 61:
        case 63:
        case 65:
            return {
                condition: "Rain",
            };

        case 71:
        case 73:
        case 75:
            return {
                condition: "Snow",
            };

        case 80:
        case 81:
        case 82:
            return {
                condition: "Rain Showers",
            };

        case 95:
            return {
                condition: "Thunderstorm",
            };

        case 96:
        case 99:
            return {
                condition: "Severe Thunderstorm",
            };

        default:
            return {
                condition: "Unknown",
            };
    }
}

module.exports = {
    getWeatherInfo
};