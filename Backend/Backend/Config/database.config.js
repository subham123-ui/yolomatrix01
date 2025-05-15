import mongoose from "mongoose";

export const DataBaseConnect = async () => {
  try {
    // ! db connection using Mongoose
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("MongoDB connetcted succesfully");
  } catch (error) {
    console.log("Database Connection Error", error);
  }
};
