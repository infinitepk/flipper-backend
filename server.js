require("dotenv").config();
const { startScheduler } = require("./services/news/scheduler");
const express = require("express");
const cors = require("cors");
const feedRoutes = require("./routes/feedRoutes");
const categoryRoutes = require("./routes/categoryRoutes");


const app = express();

app.use(cors());

app.use(express.json());

app.use("/", feedRoutes);

app.use("/", categoryRoutes);



app.post('/article', async (req, res) => {
    res.send('Coming Soon');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

    startScheduler();
});