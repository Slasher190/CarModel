import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();
const uri = process.env.MONGO_URI;
const dbName = "CarDeal";

const client = new MongoClient(uri, { useUnifiedTopology: true });

let database = null;

export const connectToDatabase = async () => {
  try {
    await client.connect();
    database = client.db(dbName);
    console.log("Connected to MongoDB database,", uri);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export const getDatabase = () => {
  return new Promise((resolve, reject) => {
    if (database) {
      resolve(database);
    } else {
      reject(new Error("Database connection not established."));
    }
  });
};
