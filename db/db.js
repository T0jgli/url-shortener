const mongoose = require("mongoose");
require("dotenv").config();

const CONNECTURL = process.env.MONGOURL;

const dbConnect = async () => {
    try {
        await mongoose.connect(CONNECTURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("MongoDB connected...");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

module.exports = dbConnect;