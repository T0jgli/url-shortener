const express = require("express");
const MongoUrl = require("../db/urlModel.js");
const path = require("path");

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


router.get("/", (req, res) => {
    //res.redirect("https://urlc.kvlk.hu");

    res.sendFile(path.join(__dirname, "../client/build/index.html"));
})

module.exports = router;