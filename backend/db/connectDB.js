import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log(" MongoDB connection success");
    } catch (error) {
        console.error(` Error: ${error}`);
        process.exit(1);
    }
}

export default connectDB;

