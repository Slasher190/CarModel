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
            "dealership_id",
            "dealership_name",
            "dealership_location",
            "password",
          ],
          properties: {
            dealership_email: { bsonType: "string" },
            dealership_id: { bsonType: "string" },
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
    const database = getDatabase();
    const dealershipCollection = database.collection(dealershipCollectionName);
    await dealershipCollection.insertOne(dealership);
  },
};

export default Dealership;
