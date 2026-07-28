const express = require("express");
const router = express.Router();

const { getWeather } = require("../services/weatherService");

router.get("/", async (req, res) => {

    try {

        const { city, lat, lon } = req.query;

        const weather = await getWeather(
            city,
            lat,
            lon,
        );

        res.json(weather);

    } catch (err) {

        console.error("Weather Error:");
console.error(err.response?.data || err.message || err);

        res.status(500).json({
            error: "Unable to fetch weather"
        });

    }

});

module.exports = router;