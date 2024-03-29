const express = require("express");
const shortid = require("shortid");
const logger = require("../helpers/logger.js");

const MongoUrl = require("../db/urlModel.js");
require("dotenv").config();

const router = express.Router();
const BASE_URL = process.env.BASEURL;

router.post("/", async (req, res) => {
    const { urlToShorten, customUrl } = req.body;

    const urlCode = customUrl ? customUrl : shortid.generate();

    try {
        const shortUrl = `${BASE_URL}/${urlCode}`;

        const existingUrlWithThatCode = await MongoUrl.findOne({
            urlCode
        });

        if (existingUrlWithThatCode)
            return res.json({ existingError: true })

        const url = new MongoUrl({
            longUrl: urlToShorten,
            shortUrl,
            urlCode
        });

        await url.save();

        res.status(201).json(url);

    } catch (error) {
        logger("error", error)
        res.status(500).send("Server error")
    }
});

router.delete("/:code", async (req, res) => {
    try {
        const url = await MongoUrl.findOne({ urlCode: req.params.code });

        if (!url) {
            return res.json({ errorMessage: "Nincs ilyen URL" })
        }

        await MongoUrl.findOneAndDelete({ urlCode: req.params.code })

        return res.status(200).json({ success: true })
    } catch (error) {
        logger("error", error)
        res.status(500).send("Server error")
    }
})

router.get("/getViewers", async (req, res) => {
    try {
        const parsedParam = req.query.urlCodes.split("&")
        const viewers = {};
        for (param of parsedParam) {
            const { used } = await MongoUrl.findOne({ urlCode: param })
            viewers[param] = used
        }
        return res.status(200).json({
            viewers
        })

    } catch (error) {
        logger("error", error)
        res.status(500).send("Server error")
    }

})

module.exports = router;
