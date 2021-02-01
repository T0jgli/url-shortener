import express from "express";
import MongoUrl from "../db/urlModel.js";

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
    res.redirect("https://urlc.kvlk.hu")
})

export default router