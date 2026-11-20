require("dotenv").config();
const { startScheduler } = require("./services/news/scheduler");
const express = require("express");
const cors = require("cors");
const feedRoutes = require("./routes/feedRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const interactionRoutes = require("./routes/interactionRoutes");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/", feedRoutes);

app.use("/", categoryRoutes);

app.use(authRoutes);

app.use(profileRoutes);
app.use("/", interactionRoutes);



app.post('/article', async (req, res) => {
    res.send('Coming Soon');
});

const PORT = process.env.PORT || 3000;

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "flipper-backend",
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

    if (process.env.ENABLE_NEWS_SCHEDULER === "true") {
        startScheduler();
    } else {
        console.log("News scheduler disabled. GitHub Actions handles news fetching.");
    }
});