import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const CONNECTURL = process.env.MONGOURL;

export const dbConnect = async () => {
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