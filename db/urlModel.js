const mongoose = require("mongoose");

const UrlSchema = new mongoose.Schema({
    longUrl: String,
    shortUrl: String,
    urlCode: String,
    used: { type: Number, default: 0 },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("url", UrlSchema);