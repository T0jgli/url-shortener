import mongoose from "mongoose";

export const UrlSchema = new mongoose.Schema({
    longUrl: String,
    shortUrl: String,
    urlCode: String,
    date: { type: Date, default: Date.now }
});

export default mongoose.model("url", UrlSchema);