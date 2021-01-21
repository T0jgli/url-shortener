import express from "express";
import MongoUrl from "../db/urlModel.js";

const router = express.Router();

router.get("/:code", async (req, res) => {
    try {
        const url = await MongoUrl.findOne({ urlCode: req.params.code });
        if (url) return res.redirect(url.longUrl.includes("http") ? url.longUrl : `http://${url.longUrl}`);

        return res.json("No URL found");
    } catch (error) {
        console.log(error);
    }
})

export default router