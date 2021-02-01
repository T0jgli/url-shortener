import express from "express";
import cors from "cors";
import indexRoute from "./routes/indexRoute.js";
import urlRoute from "./routes/urlRoute.js";

import { dbConnect } from "./db/db.js";

dbConnect();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cors())

app.use("/", indexRoute);
app.use("/api", urlRoute);


app.listen(PORT, () => {
    console.log(`App running on http://localhost:${PORT}`)
});