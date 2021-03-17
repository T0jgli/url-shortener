const express = require("express");
const MongoUrl = require("../db/urlModel.js");
const logger = require("../helpers/logger.js");

const router = express.Router();

router.get("/:code", async (req, res) => {
    try {
        const url = await MongoUrl.findOneAndUpdate({ urlCode: req.params.code }, {
            $inc: {
                used: 1
            }
        });

        if (url) return res.status(308).redirect(url.longUrl.includes("http") ? url.longUrl : `http://${url.longUrl}`);

        return res.status(404).json("No URL found");
    } catch (error) {
        logger("error", error)
        res.status(500).send("Server error")
    }
})

module.exports = router;