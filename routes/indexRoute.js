const express = require("express");
const MongoUrl = require("../db/urlModel.js");

const router = express.Router();

router.get("/:code", async (req, res) => {
    try {
        const url = await MongoUrl.findOneAndUpdate({ urlCode: req.params.code }, {
            $inc: {
                used: 1
            }
        });

        if (url) return res.redirect(url.longUrl.includes("http") ? url.longUrl : `http://${url.longUrl}`);

        return res.json("No URL found");
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;