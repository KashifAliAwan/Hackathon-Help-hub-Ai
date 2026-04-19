// Note: Mongo DB connection / configuration...!

import mongoose from "mongoose";

const conectMongoDB = async () => {
  try {
    const isConnect = await mongoose.connect(process.env.MONGO_DB_URL, {
      dbName: "hackathon",
    });

    isConnect && console.log("Mongo DB connected successfully");
  } catch (error) {
    console.log("Something went wrong while connecting to DB: ", error);
  }
};

export default conectMongoDB;
