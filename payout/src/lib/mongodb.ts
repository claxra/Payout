import mongoose from "mongoose";

const connectMongo = async () => {
  if (process.env.MONGODB_URI) {
    await mongoose.connect(process.env.MONGODB_URI).then(() => {
      console.log("Connected to MongoDB 🚀");
    });
  }
};

export default connectMongo;
