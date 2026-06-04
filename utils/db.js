import mongoose from "mongoose";

const connectDB = async () => {
    try{

        await mongoose.connect(process.env.MONGO_URL,{
            dbName:"Ecommerce2025",
        });

        console.log("MongoDB connected successfully");
    }
    catch(error)
    {
        console.error("Error connecting to MongoDB:", error);
    }
}

export default connectDB;