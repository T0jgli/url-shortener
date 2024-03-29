const express = require("express");
const path = require("path");
const cors = require("cors");
const indexRoute = require("./routes/indexRoute.js");
const urlRoute = require("./routes/urlRoute.js");

const dbConnect = require("./db/db.js");
const logger = require("./helpers/logger.js")
require("dotenv").config();

dbConnect();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static(path.join(__dirname, "client", "build")));

if (process.env.NODE_ENV) {
    app.use(cors())
    app.use((req, res, next) => {
        res.on("finish", () => {
            logger("info", `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}], STATUS - [${res.statusCode}]`)
        })
        next()
    })
}

app.use("/", indexRoute);
app.use("/api", urlRoute);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
})

app.listen(PORT, () => {
    logger("build", "Started listening:", `http://localhost:${PORT}`)
});