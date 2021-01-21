import express from "express";
import shortid from "shortid";
import MongoUrl from "../db/urlModel.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
const BASE_URL = process.env.BASEURL;

router.post("/", (req, res) => {
    const { urlToShorten } = req.body;

    const urlCode = shortid.generate();

    try {
        MongoUrl.findOne({
            longUrl: urlToShorten
        }, async (err, doc) => {
            if (doc) return res.json({ shortUrl: doc.shortUrl });
            if (err) return console.log(err);

            const shortUrl = `${BASE_URL}/${urlCode}`;

            const url = new MongoUrl({
                longUrl: urlToShorten,
                shortUrl,
                urlCode: urlCode
            });

            await url.save();

            res.json(url);
        })


    } catch (error) {
        console.log(error)
    }
});

export default router