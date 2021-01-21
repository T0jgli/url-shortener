import mongoose from "mongoose";

export const UrlSchema = new mongoose.Schema({
    longUrl: String,
    shortUrl: String,
    urlCode: String,
    date: { type: String, default: new Date() }
});

export default mongoose.model("url", UrlSchema);