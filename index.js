const express = require("express");
const cors = require("cors");
const path = require("path");
const indexRoute = require("./routes/indexRoute.js");
const urlRoute = require("./routes/urlRoute.js");
const dbConnect = require("./db/db.js");

dbConnect();

const app = express();
const PORT = process.env.PORT || 8080;
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "client/build")));

app.use("/", indexRoute);
app.use("/api", urlRoute);


app.listen(PORT, () => {
    console.log(`App running on http://localhost:${PORT}`)
});