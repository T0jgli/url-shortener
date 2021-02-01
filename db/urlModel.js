import mongoose from "mongoose";

export const UrlSchema = new mongoose.Schema({
    longUrl: String,
    shortUrl: String,
    urlCode: String,
    used: { type: Number, default: 0 },
    date: { type: Date, default: Date.now }
});

export default mongoose.model("url", UrlSchema);