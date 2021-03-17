const mongoose = require("mongoose");
const logger = require("../helpers/logger.js")
require("dotenv").config();

const CONNECTURL = process.env.MONGOURL;

const dbConnect = async () => {
    try {
        await mongoose.connect(CONNECTURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });

        logger("build", "MongoDB connected...")
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

module.exports = dbConnect;