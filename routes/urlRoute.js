const express = require("express");
const shortid = require("shortid");

const MongoUrl = require("../db/urlModel.js");
require("dotenv").config();

const router = express.Router();
const BASE_URL = process.env.BASEURL;

router.post("/", async (req, res) => {
    const { urlToShorten } = req.body;

    const urlCode = shortid.generate();

    try {
        const shortUrl = `${BASE_URL}/${urlCode}`;

        const url = new MongoUrl({
            longUrl: urlToShorten,
            shortUrl,
            urlCode: urlCode
        });

        await url.save();

        res.json(url);

        /*         MongoUrl.findOne({
                    longUrl: urlToShorten
                }, async (err, doc) => {
                    if (doc) {
                        return res.json({ shortUrl: doc.shortUrl, longUrl: doc.longUrl })
                    }
                    if (err) {
                        return console.log(err)
                    }
        
                    const shortUrl = `${BASE_URL}/${urlCode}`;
        
                    const url = new MongoUrl({
                        longUrl: urlToShorten,
                        shortUrl,
                        urlCode: urlCode
                    });
        
                    await url.save();
        
                    res.json(url);
                }) */


    } catch (error) {
        console.log(error)
    }
});

router.delete("/:code", async (req, res) => {
    const url = await MongoUrl.findOne({ urlCode: req.params.code });

    if (!url) {
        return res.json({ errorMessage: "Nincs ilyen URL" })
    }

    await MongoUrl.findOneAndDelete({ urlCode: req.params.code })

    return res.status(200).json({ success: true })
})

module.exports = router;