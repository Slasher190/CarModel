import { getDatabase } from "../config/database.js";

const dealCollectionName = "deal";
// Create the admin collection if it doesn't exist
const createDealCollection = async () => {
  const database = getDatabase();
  const dealCollectionExists = await database
    .listCollections({ name: dealCollectionName })
    .hasNext();

  if (!dealCollectionExists) {
    await database.createCollection(dealCollectionName, {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["deal_id", "car_id"],
          properties: {
            deal_id: { bsonType: "string" },
            car_id: { bsonType: "string" },
            deal_info: { bsonType: "object" },
          },
        },
      },
    });
  }
};

export const Deal = {
  createDealCollection,
  createDeal: async (deal) => {
    const database = getDatabase();
    const dealCollection = database.collection(dealCollectionName);
    await dealCollection.insertOne(deal);
  },
};

export default Deal;
