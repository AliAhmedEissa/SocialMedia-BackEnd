import mongoose from "mongoose";
import client from "mongoose";
//import { MongoClient } from "mongodb"
//export const client = new MongoClient(process.env.DB_LOCAL);

export const dbConnection = async () => {
  return await mongoose
    .connect(process.env.DB_LOCAL)
    .then((res) => {
      console.log("Database Connected Successfully");
    })
    .catch((err) => console.log("Database Connection Failed  " + err.message));
};
