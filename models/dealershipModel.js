import { getDatabase } from "../config/database.js";

const dealershipCollectionName = "dealership";
// Create the admin collection if it doesn't exist
const createDealershipCollection = async () => {
  const database = getDatabase();
  const dealershipCollectionExists = await database
    .listCollections({ name: dealershipCollectionName })
    .hasNext();

  if (!dealershipCollectionExists) {
    await database.createCollection(dealershipCollectionName, {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: [
            "dealership_email",
            // "dealership_id",
            "dealership_name",
            "dealership_location",
            "password",
          ],
          properties: {
            dealership_email: { bsonType: "string" },
            // dealership_id: { bsonType: "string" },
            dealership_name: { bsonType: "string" },
            dealership_location: { bsonType: "string" },
            password: { bsonType: "string" },
            dealership_info: { bsonType: "object" },
            cars: { bsonType: "array" },
            deals: { bsonType: "array" },
            sold_vehicles: { bsonType: "array" },
            created_at: { bsonType: "date" },
          },
        },
      },
    });
  }
};

export const Dealership = {
  createDealershipCollection,
  createDealership: async (dealership) => {
    try {
      const database = await getDatabase();
      const dealershipCollection = await database.collection(
        dealershipCollectionName
      );
      await dealershipCollection.insertOne(dealership);
    } catch (error) {
      console.error("Error creating Dealership:", error);
      throw new Error("Failed to create Dealership");
    }
  },
  getDealershipByEmail: async(email) => {
    try {
      const database = await getDatabase();
      const dealershipCollection = await database.collection(dealershipCollectionName);
      const dealer = await dealershipCollection.findOne({ dealership_email: email });
      return dealer;
    } catch (error) {
      console.error("Error retrieving dealer by email:", error);
      throw new Error("Failed to retrieve dealer by email");
    }
  },
  findOne: async (query) => {
    try {
      const database = await getDatabase();
      const dealershipCollection = await database.collection(dealershipCollectionName);
      const dealer = await dealershipCollection.findOne(query);
      return dealer;
    } catch (error) {
      console.error(`Error retrieving dealer by ${key}:`, error);
      throw new Error(`Failed to retrieve dealer by ${key}`);
    }
  },
  update: async (dealer) => {
    try {
      const database = await getDatabase();
      const dealershipCollection = database.collection(dealershipCollectionName);
      await dealershipCollection.updateOne({ _id: dealer._id }, { $set: dealer });
    } catch (error) {
      console.error("Error updating dealer:", error);
      throw new Error("Failed to update dealer");
    }
  },
};

export default Dealership;
