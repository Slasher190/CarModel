import { getDatabase } from "../config/database.js";

const soldVehiclesCollectionName = "sold_vehicles";
// Create the admin collection if it doesn't exist
const createSoldVehiclesCollection = async () => {
  const database = getDatabase();
  const soldVehiclesCollectionExists = await database
    .listCollections({ name: soldVehiclesCollectionName })
    .hasNext();

  if (!soldVehiclesCollectionExists) {
    await database.createCollection(soldVehiclesCollectionName, {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["vehicle_id", "car_id"],
          properties: {
            vehicle_id: { bsonType: "string" },
            car_id: { bsonType: "string" },
            vehicle_info: { bsonType: "object" }
          }
        }
      }
    });
  }
};

export const SoldVehicles = {
  createSoldVehiclesCollection,
  createSoldVehicle: async (soldVehicle) => {
    const database = getDatabase();
    const soldVehiclesCollection = database.collection(soldVehiclesCollectionName);
    await soldVehiclesCollection.insertOne(soldVehicle);
  },
};

export default SoldVehicles;
