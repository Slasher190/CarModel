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
            // vehicle_id: { bsonType: "string" },
            car_id: { bsonType: "string" },
            vehicle_info: { bsonType: "object" },
          },
        },
      },
    });
  }
};

export const SoldVehicles = {
  createSoldVehiclesCollection,
  createSoldVehicle: async (soldVehicle) => {
    try {
      const database = await getDatabase();
      const soldVehiclesCollection = await database.collection(
        soldVehiclesCollectionName
      );
      await soldVehiclesCollection.insertOne(soldVehicle);
    } catch (error) {
      console.error("Error creating SoldVehicles:", error);
      throw new Error("Failed to create SoldVehicles");
    }
  },
  getSoldCarsByDealership: async (dealershipId) => {
    try {
      const database = await getDatabase();
      const soldVehiclesCollection = await database.collection(
        soldVehiclesCollectionName
      );

      const soldCars = await soldVehiclesCollection.find({
        dealership_id: dealershipId,
      }).toArray();

      return soldCars;
    } catch (error) {
      console.error("Error retrieving sold cars:", error);
      throw new Error("Failed to retrieve sold cars");
    }
  },
};

export default SoldVehicles;
